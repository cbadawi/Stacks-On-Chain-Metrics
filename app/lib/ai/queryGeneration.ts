'use server';

import { z } from 'zod';
import { log } from '../../lib/logger';
import { generateQuerySystemPrompt, documentation, pgSchema } from './prompts';
import { generateText } from 'ai';
import { updateTokensUsed } from '../db/owner/tokens';
import { verifySession } from '../auth/sessions/verifySession';
import { model } from './client';

/** Helper to remove code blocks from the response */
const removeCodeBlocks = (text: string) => {
  return text.replace(/^```[\s\S]*?\n/, '').replace(/\n```$/, '');
};

export const generateQuery = async (
  address: string,
  prompt: string,
  sql?: string
): Promise<{
  success: boolean;
  message: string;
  response: { query?: string };
}> => {
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
      model,
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
