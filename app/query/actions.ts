'use server';

import { openai } from '@ai-sdk/openai';
import { Client, Pool } from 'pg';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { explanationsSchema } from '../lib/types';
import prisma from '@/app/lib/db/client';
import {
  ChartType,
  LeftRight,
  Prisma,
  CustomizableChartTypes,
  Dashboard,
} from '@prisma/client';

import {
  addDashboard,
  getDashboard,
  getDashboards,
} from '@/app/lib/db/dashboards/dashboard';
import {
  cleanQuery,
  VariableType,
  wrapQueryLimit,
} from '../components/helpers';
import { addChart, getCharts } from '../lib/db/dashboards/charts';
import { documentation, pgSchema } from './prompts';
import { log } from '../lib/logger';
import { seperateCommentsFromSql } from './seperateCommentsFromSql';

type Result = Record<string, string | number>;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  // query_timeout: 10000,
});

const DEFAULT_CHART_X = 0;
const DEFAULT_CHART_Y = 0;
const DEFAULT_CHART_HEIGHT = 20;
const DEFAULT_CHART_WIDTH = 25;

export async function addChartToDashboard({
  dashboardTitle,
  chartTitle,
  userAddress,
  chartType,
  privateDashboard,
  password,
  query,
  variables,
}: {
  dashboardTitle: string;
  chartTitle: string;
  userAddress: string;
  chartType: ChartType;
  query: string;
  variables: VariableType[];
  privateDashboard?: boolean;
  password?: string;
}) {
  let x = DEFAULT_CHART_X;
  let y = DEFAULT_CHART_Y;
  let dashboard: Dashboard | null = await getDashboard({
    title: dashboardTitle,
    address: userAddress,
  });
  if (!dashboard)
    dashboard = await addDashboard({
      title: dashboardTitle,
      privateDashboard,
      password,
      address: userAddress,
    });
  else {
    const currentCharts = await getCharts({ dashboardId: dashboard.id });
    currentCharts.map((c) => c.x);
  }

  return await prisma.$transaction(async (tx) => {
    const newChart = await addChart({
      dashboardId: dashboard.id,
      title: chartTitle,
      query,
      chartType,
      x: DEFAULT_CHART_X,
      y: DEFAULT_CHART_Y,
      width: DEFAULT_CHART_WIDTH,
      height: DEFAULT_CHART_HEIGHT,
      variables,
    });

    return {
      message: 'Added Chart',
      dashboard,
      chart: newChart,
    };
  });
}

export async function fetchData(query: string) {
  'use server';
  // await new Promise((resolve) => setTimeout(resolve, 3500));
  let queryString = seperateCommentsFromSql(query).sql;
  queryString = cleanQuery(queryString.trim());
  queryString = wrapQueryLimit(queryString);

  log.info('fetchData', { queryString });

  let data: any;
  try {
    console.time('sql query');
    const res = await pool.query(queryString);
    console.timeEnd('sql query');
    console.log('query result', { res });
    data = res;
  } catch (e: any) {
    console.error('query error', { e });
    throw e;
  }

  return data.rows as Result[];
}

const generateQuerySystemPrompt = `
You are a PostgreSQL expert specializing in Stacks (STX) on-chain data. Follow these guidelines exactly:
1. Generate only retrieval (SELECT) queries.
2. Use explicit table.column notation in all clauses.
3. Write proper JOINs with clear ON conditions.
4. Format the query using new lines and tabs for readability (do not wrap it in a code block).
5. Do not include a trailing semicolon.
6. Do not add any extra commentary or markdown formatting—only output the plain SQL query.
${documentation}
${pgSchema}
`;

export const generateQuery = async (input: string) => {
  'use server';
  try {
    // TODO check if its helpful to add examples to the prompt
    const generateQueryUserPromptWrapper = `
      USER REQUEST: ${input}
      Based on the user's request, generate a PostgreSQL query that meets these conditions:
      - Follow all the system rules exactly.
      - Use the documentation in the system rules for the table columns, indexes and foreign keys for joins. Use the indexes for filtering to optimize the query.
      - Use explicit table.column notation.
      - Format the query with clear indentations and line breaks.
      - Do not include any extraneous text or formatting.
      `;
    const result = await generateText({
      model: openai('gpt-4o'),
      system: generateQuerySystemPrompt,
      prompt: generateQueryUserPromptWrapper,
    });
    log.info('ai generateQuery', { input, result: result.text });
    if (result.text.startsWith('select'))
      return {
        query: result.text,
      };

    return { message: result.text };
  } catch (e) {
    log.error('Failed to generateQuery ' + e);
    throw new Error('Failed to generateQuery ' + e);
  }
};

export const explainQuery = async (userPrompt: string, sqlQuery: string) => {
  'use server';
  try {
    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        explanations: explanationsSchema,
      }),
      system: `You are a SQL (postgres) expert for the stacks (stx) cryptocurrency on-chain data. Your job is to explain to the user write a SQL query you wrote to retrieve the data they asked for. The table schema is as follows:
      ${pgSchema}
      When you explain you must take a section of the query, and then explain it. Each "section" should be unique. So in a query like: "SELECT * FROM blocks limit 20", the sections could be "SELECT *", "FROM blocks", "LIMIT 20".
      If a section doesnt have any explanation, include it, but leave the explanation empty.
      `,
      prompt: `Explain the SQL query to retrieve the data the user wanted. Assume the user is an idiot in SQL. Break down the query into steps. Be concise.
      ${userPrompt ? 'User AI Prompt for context: ' + userPrompt : ''}

      Generated SQL Query:
      ${sqlQuery}`,
    });
    return result.object;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate explainQuery');
  }
};
