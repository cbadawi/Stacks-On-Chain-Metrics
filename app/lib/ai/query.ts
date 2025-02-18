'use server';

import { createAnthropic } from '@ai-sdk/anthropic';
import { Pool, QueryResult } from 'pg';
import {
  cleanQuery,
  findIsAIPrompt,
  seperatePromptFromSql,
  wrapQueryLimit,
} from './cleanQuery';

import { log } from '../../lib/logger';
import { documentation, generateQuerySystemPrompt, pgSchema } from './prompts';
import { generateObject, generateText } from 'ai';
import { explanationsSchema } from '../types';
import { z } from 'zod';
import { stacksPool } from '../db/client';
import { VariableType } from '@/app/components/helpers';
import { replaceVariables } from '../variables';
import {
  getTokensPurchased,
  getTokensUsed,
  updateTokensUsed,
} from '../db/owner/tokens';
import { verifySession } from '../auth/sessions/verifySession';
import { headers } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type Result = Record<string, string | number>;

/** A common server response type */
export interface ServerResponse<T> {
  success: boolean;
  message: string;
  response: T;
}

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});
const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(Number(process.env.RL_TOKENS) || 10, '60 s'),
});

const anthropic = createAnthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const claude = anthropic('claude-3-5-haiku-latest');

// ---------------------------------------------------------------------
// fetchData
// ---------------------------------------------------------------------
export async function fetchData(
  query: string,
  explain = false
): Promise<ServerResponse<{ data: Result[] | null }>> {
  'use server';

  const ip = headers().get('x-forwarded-for') || 'unknown';
  const { success: rateSuccess } = await rateLimit.limit(ip);
  if (!rateSuccess) {
    return {
      success: false,
      message: 'Too many requests. Please try again later.',
      response: { data: null },
    };
  }

  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: { data: null },
    };
  }

  let cleanedQuery = cleanQuery(query.trim());
  const queryWithoutComments = cleanedQuery
    .replace(/^(?:\s*--.*\n)*/i, '')
    .trim();
  const startsWithExplain = queryWithoutComments
    .toLowerCase()
    .startsWith('explain');

  log.info('fetchData', { cleanedQuery, query });
  if (!startsWithExplain && !explain) {
    cleanedQuery = wrapQueryLimit(cleanedQuery);
  } else if (explain && !startsWithExplain) {
    cleanedQuery = 'explain \n ' + cleanedQuery;
  }

  try {
    console.time('sql');
    const data = await stacksPool.query(cleanedQuery);
    console.timeEnd('sql');
    log.info('fetchData result', { data });

    const rows = data.rows as Result[];
    const msg =
      rows.length === 0 ? 'Empty response.' : 'Query executed successfully.';
    return {
      success: true,
      message: msg,
      response: { data: rows },
    };
  } catch (error: any) {
    if (error instanceof Error) {
      log.error('fetchData error', { error });
      return {
        success: false,
        message: error.message ?? JSON.stringify(error),
        response: { data: null },
      };
    }
    throw error;
  }
}

// ---------------------------------------------------------------------
// generateQuery
// ---------------------------------------------------------------------
export const generateQuery = async (
  address: string,
  prompt: string,
  sql?: string
): Promise<ServerResponse<{ query?: string }>> => {
  'use server';

  // Protect server action
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: {},
    };
  }

  try {
    const generateQueryUserPromptWrapper = `
      USER REQUEST: 
      prompt: ${prompt} 
      ${sql ? 'sql: ' + sql : ''}
      Based on the user's request, generate a PostgreSQL query that meets these conditions:
      - Follow all the system rules exactly.
      - Use the documentation for the table columns, indexes and foreign keys for joins. Use the indexes for filtering to optimize the query.
      - ALWAYS ADD A LIMIT 300 to the query even if otherwise specified.
      - Format the query with clear indentations and line breaks. Do NOT add code blocks.
      - If asked about the time, use the table's block_time timestamp DATE_TRUNC('day', TO_TIMESTAMP(txs.block_time)) to get the date if asked. Join on the "blocks" table only if block_time is not present.
      - double brackets {{}}, for example "where block_height > {{variable}}" are user defined variables which will be replaced later. Do not modify any bracket or the variable within.

      DO NOT include a table that is not mentioned here:
      documentation: ${documentation}
      ${pgSchema}
      `;

    const result = await generateText({
      model: claude,
      system: generateQuerySystemPrompt,
      prompt: generateQueryUserPromptWrapper,
    });

    let aiquery = removeCodeBlocks(result.text.trim());
    const isValidQuery =
      aiquery.toLowerCase().startsWith('with') ||
      aiquery.toLowerCase().startsWith('select') ||
      aiquery.toLowerCase().startsWith('--');

    const {
      usage,
      steps,
      response: aiResponse,
      reasoning,
      warnings,
      toolCalls,
      toolResults,
    } = result;
    log.info('ai generateQuery', {
      prompt,
      sql,
      usage,
      steps,
      aiResponse,
      reasoning,
      warnings,
      toolCalls,
      toolResults,
    });

    await updateTokensUsed({ address, tokensUsed: usage.completionTokens });

    if (isValidQuery) {
      return {
        success: true,
        message: 'Query generated successfully.',
        response: { query: aiquery },
      };
    }

    return {
      success: false,
      message: result.text,
      response: {},
    };
  } catch (e: any) {
    log.error('Failed to generateQuery ' + e);
    return {
      success: false,
      message: 'Failed to generateQuery: ' + e,
      response: {},
    };
  }
};

const removeCodeBlocks = (text: string) => {
  return text.replace(/^```[\s\S]*?\n/, '').replace(/\n```$/, '');
};

// ---------------------------------------------------------------------
// explainQuery
// ---------------------------------------------------------------------
export const explainQuery = async (
  userPrompt: string,
  sqlQuery: string
): Promise<ServerResponse<any>> => {
  'use server';

  // Protect server action
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: {},
    };
  }

  try {
    const queryPlan = await fetchData(sqlQuery, true);
    const result = await generateObject({
      model: claude,
      schema: z.object({
        explanations: explanationsSchema,
      }),
      system: `
      Your job is to optimize first, then explain the SQL query. Use the query plan provided to find optimizations.
      `,
      prompt: `Explain the POSTGRES SQL query to retrieve the data the user wanted. Break down the query into steps. Be concise. 
      
      OPTIMIZATIONS : 
      Extremely important to mention future optimizations you found, using the query plan, that are not applied to the postgres query to make it run faster. Such as:
      - count(*) instead of counting a specific column.
      - avoid joins unless necessary.
      - use indexes to filter the results or to join on tables.
      - If the query is filtering on the index but the index is not used, mention that and why. One potential solution would be to pass the filter as a variable. For example	burn_block_time >= {{variable}} instead of burn_block_time >= EXTRACT(EPOCH FROM NOW()).
      for info : double brackets {{variables}} inside the query are variables my app replaces with a precomputed value.  

      Be very specific, mention inefficiencies in details in the query plan and how to fix them.
      
      SYNTAX :
      When you explain you must take a section of the query, and then explain it with its optimization if it exists. Each "section" should be unique. So in a query like: "SELECT * FROM blocks limit 20", the sections could be "SELECT *", "FROM blocks", "LIMIT 20".
      - In the first section, provide a brief overview of the query, but more importantly, mention the optimizations & modifications that are not yet applied to the query.

      If a section doesn't have any explanation, include the section, but leave the explanation empty.
      Mentioning an optimization is more important than explaining the section. Use the postgres query plan statement:
      
      QUERY PLAN : ${queryPlan}

      SQL QUERY:
      ${sqlQuery}

      use the postgres schema & indeces in your optimization analysis : ${pgSchema}

      ${userPrompt ? 'User AI Prompt for context: ' + userPrompt : ''}
      `,
    });
    log.info('ai explainQuery', {
      sqlQuery,
      queryPlan,
      result: result.object,
    });

    return {
      success: true,
      message: 'Query explained successfully.',
      response: result.object,
    };
  } catch (e: any) {
    console.error(e);
    return {
      success: false,
      message: 'Failed to generate explainQuery',
      response: {},
    };
  }
};

// ---------------------------------------------------------------------
// runQueryCombined
// ---------------------------------------------------------------------
export async function runQueryCombined(
  address: string,
  query: string,
  variables: VariableType
): Promise<
  ServerResponse<{
    data: Result[] | null;
    isAiPrompt: boolean;
    displayQuery: string;
  }>
> {
  'use server';

  const isAiPrompt = findIsAIPrompt(query);
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: {
        data: null,
        isAiPrompt,
        displayQuery: query,
      },
    };
  }

  const { prompt, sql } = seperatePromptFromSql(query);
  if (isAiPrompt) {
    // TODO token check
    const [tokensUsed, tokensPurchased] = await Promise.all([
      getTokensUsed({ address }),
      getTokensPurchased({ address }),
    ]);
    const aiQueryResult = await generateQuery(address, prompt, sql);
    if (!aiQueryResult.response.query) {
      return {
        success: false,
        message:
          aiQueryResult.message ||
          'Failed to generate SQL query from AI prompt.',
        response: {
          data: null,
          isAiPrompt,
          displayQuery: query,
        },
      };
    }
    query = aiQueryResult.response.query;
  }
  const finalQuery = replaceVariables(query, variables);
  log.info('runQueryCombined', {
    finalQuery,
    variables,
    isAiPrompt,
    prompt,
    sql,
  });
  const fetchResult = await fetchData(finalQuery);
  if (!fetchResult.success) {
    return {
      success: false,
      message: fetchResult.message,
      response: {
        data: null,
        isAiPrompt,
        displayQuery: `-- AI ${prompt} \n${query}`,
      },
    };
  }
  return {
    success: true,
    message: 'Query executed successfully.',
    response: {
      data: fetchResult.response.data,
      isAiPrompt,
      displayQuery: `-- AI ${prompt} \n${query}`,
    },
  };
}
