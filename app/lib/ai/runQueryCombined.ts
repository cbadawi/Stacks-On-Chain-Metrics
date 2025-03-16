'use server';

import { log } from '../../lib/logger';
import { verifySession } from '../auth/sessions/verifySession';
import { replaceVariables } from '../variables';
import { generateQuery } from './queryGeneration';
import { findIsAIPrompt, seperatePromptFromSql } from './cleanQuery';
import { VariableType } from '@/app/components/helpers';
import { fetchData } from './fetchData';
import { config } from '../config';

export async function runQueryCombined(
  address: string,
  query: string,
  variables: VariableType
): Promise<{
  success: boolean;
  message: string;
  response: { data: any; isAiPrompt: boolean; displayQuery: string };
}> {
  'use server';

  const isAiPrompt = findIsAIPrompt(query);
  if (config.PROTECT_DATA_ROUTES) {
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
  }

  const { prompt, sql } = seperatePromptFromSql(query);
  if (isAiPrompt) {
    // TODO: Optionally add token check & update here.
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
