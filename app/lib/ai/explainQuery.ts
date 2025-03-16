'use server';

import { z } from 'zod';
import { log } from '../../lib/logger';
import { generateObject } from 'ai';
import { pgSchema } from './prompts';
import { explanationsSchema } from '../types';

import { verifySession } from '../auth/sessions/verifySession';
import { model } from './client';
import { fetchData } from './fetchData';

export async function explainQuery(
  userPrompt: string,
  sqlQuery: string
): Promise<{ success: boolean; message: string; response: any }> {
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
      model,
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
}
