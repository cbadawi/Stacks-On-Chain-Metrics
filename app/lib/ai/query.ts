'use server';

import { createAnthropic } from '@ai-sdk/anthropic';
import { Pool } from 'pg';
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

export type Result = Record<string, string | number>;

const anthropic = createAnthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const claude = anthropic('claude-3-5-sonnet-latest');

export async function fetchData(query: string, explain = false) {
  'use server';
  // await new Promise((resolve) => setTimeout(resolve, 3500));
  // let cleanedQuery = seperatePromptFromSql(query).sql;
  let cleanedQuery = cleanQuery(query.trim());
  cleanedQuery = wrapQueryLimit(cleanedQuery);
  if (explain) cleanedQuery = 'explain ' + cleanedQuery;
  log.info('fetchData', { cleanedQuery, query });

  let data: any;
  try {
    console.time('sql query');
    const res = await stacksPool.query(cleanedQuery);
    console.timeEnd('sql query');
    log.info('fetchData result', { res });
    data = res;
  } catch (error: any) {
    log.error('fetchData error', { error });
    if (error instanceof Error) {
      log.error(error.message);
      throw error;
    }
  }
  return data.rows as Result[];
}

export const generateQuery = async (
  address: string,
  prompt: string,
  sql?: string
) => {
  'use server';
  try {
    const generateQueryUserPromptWrapper = `
      USER REQUEST: 
      prompt: ${prompt} 
			${sql ? 'sql: ' + sql : ''}
      Based on the user's request, generate a PostgreSQL query that meets these conditions:
      - Follow all the system rules exactly.
      - Use the documentation for the table columns, indexes and foreign keys for joins. Use the indexes for filtering to optimize the query.
      - Add a limit 300 to the query even if otherwise specified.
      - Format the query with clear indentations and line breaks. Do NOT add code blocks.
      - If asked about the time, use the table's block_time timestamp DATE_TRUNC('day', TO_TIMESTAMP(txs.block_time))  to get the date if asked. join on "blocks" table only if block_time is not present
      - double brackets {{}}, for example "where block_height > {{variable}}" are a user defined variable which he will replace later, do not modify any bracket or the variable within.

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
      response,
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
      response,
      reasoning,
      warnings,
      toolCalls,
      toolResults,
    });

    await updateTokensUsed({ address, tokensUsed: usage.completionTokens });

    if (isValidQuery)
      return {
        query: aiquery,
      };

    return { message: result.text };
  } catch (e) {
    log.error('Failed to generateQuery ' + e);
    throw new Error('Failed to generateQuery ' + e);
  }
};

const removeCodeBlocks = (text: string) => {
  return text.replace(/^```[\s\S]*?\n/, '').replace(/\n```$/, '');
};

export const explainQuery = async (userPrompt: string, sqlQuery: string) => {
  'use server';
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
      prompt: `Explain the SQL query to retrieve the data the user wanted. Break down the query into steps. Be concise. 
      Extremely important to mention future optimizations you found, using the query plan, that are not applied to the postgres query to make it run faster. Such as:
      - count(*) instead of counting a specific column.
      - avoid joins unles necessary.
      - use indexes to filter the results or to join on tables.
      Be very specific, if you didnt find any optimizations, do not menthion them.
      When you explain you must take a section of the query, and then explain it with its optimization if it exists. Each "section" should be unique. So in a query like: "SELECT * FROM blocks limit 20", the sections could be "SELECT *", "FROM blocks", "LIMIT 20".
      - In the first section, provide a brief overview of the query, but more importantly, mention the optimizations & modifications that are not yet applied to the query.

      If a section doesnt have any explanation, include the section, but leave the explanation empty.
      Mentioning an optimization is more important than explaining the section. Use the postgres query plan statement:
      
      queryPlan : ${queryPlan}

      SQL Query:
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

    return result.object;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate explainQuery');
  }
};

export async function runQueryCombined(
  address: string,
  query: string,
  variables: VariableType
) {
  'use server';

  const isAiPrompt = findIsAIPrompt(query);
  const { prompt, sql } = seperatePromptFromSql(query);
  if (isAiPrompt) {
    const [tokensUsed, tokensPurchased] = await Promise.all([
      getTokensUsed({ address }),
      getTokensPurchased({ address }),
    ]);
    // if (tokensUsed > tokensPurchased)
    //   throw new Error(
    //     'You have run out of tokens. Please purchase more to continue.'
    //   );

    const aiQueryResult = await generateQuery(address, prompt, sql);
    if (!aiQueryResult.query) {
      throw new Error(
        aiQueryResult.message || 'Failed to generate SQL query from AI prompt.'
      );
    }
    query = aiQueryResult.query;
  }
  const finalQuery = replaceVariables(query, variables);
  log.info('runQueryCombined', {
    query,
    finalQuery,
    variables,
    isAiPrompt,
    prompt,
    sql,
  });
  const data = await fetchData(finalQuery);
  if (!data.length) {
    throw new Error('Empty response.');
  }
  return { data, displayQuery: `-- AI ${prompt} \n${query}`, isAiPrompt };
}
