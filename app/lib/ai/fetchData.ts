'use server';

import { Pool, QueryResult } from 'pg';
import { headers } from 'next/headers';
import { log } from '../../lib/logger';
import { stacksPool } from '../db/client';
import { verifySession } from '../auth/sessions/verifySession';
import { rateLimit } from './client';
import { cleanQuery, wrapQueryLimit } from './cleanQuery';
import { config } from '../config';
import { ServerResponse } from '@/app/components/helpers';

export type Result = Record<string, string | number | Buffer>;

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
      message: 'Rate Limited.',
      response: { data: null },
    };
  }

  if (config.PROTECT_DATA_ROUTES) {
    const session = await verifySession();
    if (!session) {
      return {
        success: false,
        message: 'Invalid session. Sign in to continue.',
        response: { data: null },
      };
    }
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
    const data = await stacksPool.query(cleanedQuery);
    log.info('fetchData result', { data });

    const rows = data.rows as Result[];
    const msg =
      rows.length === 0 ? 'Empty response.' : 'Query executed successfully.';

    const bufferColumns = data.fields.filter(
      (field) => field.dataTypeID === 17
    );
    const bufferColumnNames = bufferColumns.map((col) => col.name);

    if (bufferColumnNames.length)
      for (const row of rows) {
        for (const colName of bufferColumnNames) {
          const value = row[colName];
          if (Buffer.isBuffer(value)) {
            row[colName] = `0x${value.toString('hex')}`;
          }
        }
      }

    return {
      success: true,
      message: msg,
      response: { data: rows },
    };
  } catch (error: any) {
    log.error('fetchData error', { error });
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message ?? JSON.stringify(error),
        response: { data: null },
      };
    }
    throw error;
  }
}
