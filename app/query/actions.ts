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
  user: process.env.STACKS_DB_USER,
  host: process.env.STACKS_DB_HOST,
  database: process.env.STACKS_DB_DATABASE,
  password: process.env.STACKS_DB_PASSWORD,
  port: Number(process.env.STACKS_DB_PORT),
  query_timeout: 100000,
});

const DEFAULT_CHART_X = 0;
const DEFAULT_CHART_Y = 2000;
const DEFAULT_CHART_HEIGHT = 300;
const DEFAULT_CHART_WIDTH = 600;

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
  variables: VariableType;
  privateDashboard?: boolean;
  password?: string;
}) {
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

export async function fetchData(query: string, explain = false) {
  'use server';
  // await new Promise((resolve) => setTimeout(resolve, 3500));
  let queryString = seperateCommentsFromSql(query).sql;
  queryString = cleanQuery(queryString.trim());
  queryString = wrapQueryLimit(queryString);
  if (explain) queryString = 'explain ' + queryString;
  log.info('fetchData', { queryString });

  let data: any;
  try {
    console.time('sql query');
    const res = await pool.query(queryString);
    console.timeEnd('sql query');
    log.info('fetchData result', { res });
    data = res;
  } catch (e: any) {
    log.error('fetchData error', { e });
    throw e;
  }
  return data.rows as Result[];
}

const generateQuerySystemPrompt = `
You are a PostgreSQL expert specializing in Stacks (STX) on-chain data. Follow these guidelines exactly:
1. Generate only retrieval (SELECT) queries.
2. Use explicit table.column notation in all clauses.
3. Write proper JOINs with clear ON conditions.
4. Format the query only using new lines and tabs
5. Do not include a trailing semicolon.
6. Do not add any extra commentary or markdown formatting—only output the plain SQL query.
7. use block_time timestamp to get the time
${documentation}
${pgSchema}
`;

export const generateQuery = async (input: string) => {
  'use server';
  try {
    // TODO check if its helpful to add examples to the prompt
    const generateQueryUserPromptWrapper = `
      USER REQUEST: 
      ${input}
      Based on the user's request, generate a PostgreSQL query that meets these conditions:
      - Follow all the system rules exactly.
      - Use the documentation in the system rules for the table columns, indexes and foreign keys for joins. Use the indexes for filtering to optimize the query.
      - Use explicit table.column notation.
      - Add a limit 300 to the query.
      - Format the query with clear indentations and line breaks.
      - use the table's block_time timestamp DATE_TRUNC('day', TO_TIMESTAMP(txs.block_time))  to get the date if asked. join on "blocks" table only if block_time is not present
      - brackets, for example "where block_height > {{variable}}" are a user defined variable which he will replace later, do not modify any bracket or the variable within.
      `;
    const result = await generateText({
      model: openai('gpt-4o'),
      system: generateQuerySystemPrompt,
      prompt: generateQueryUserPromptWrapper,
    });

    let aiquery = removeCodeBlocks(result.text.trim());
    const isValidQuery =
      aiquery.toLowerCase().startsWith('with') ||
      aiquery.toLowerCase().startsWith('select') ||
      aiquery.toLowerCase().startsWith('--');
    log.info('ai generateQuery', { input, result: aiquery });
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
      model: openai('gpt-4o'),
      schema: z.object({
        explanations: explanationsSchema,
      }),
      system: `
      Your job is to optimize first, then explain the SQL query. Use the query plan provided,  to find optimizations.
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
      
      ${queryPlan}

      Generated SQL Query:
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
