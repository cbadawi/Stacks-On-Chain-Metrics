'use server';

import { addDashboard, getDashboard } from '@/app/lib/db/dashboards/dashboard';
import { addChart } from '@/app/lib/db/dashboards/charts';
import {
  ChartType,
  LeftRight,
  Prisma,
  CustomizableChartTypes,
} from '@prisma/client';
import { VariableType } from '../helpers';
import prisma from '@/app/lib/db/client';

const DEFAULT_CHART_X = 0;
const DEFAULT_CHART_Y = 0;
const DEFAULT_CHART_WIDTH = 500;
const DEFAULT_CHART_HEIGHT = 400;

function parseFormData(formData: FormData) {
  const title = formData.get('title')?.toString();
  const privateDashboard = Boolean(formData.get('private'));
  const description = formData.get('description')?.toString();
  const chartTitle = formData.get('chartTitle')?.toString() || '';
  const chartAxesTypesStr = (
    formData.get('chartAxesTypes')?.toString() || ''
  ).split(',');
  const chartAxesTypes = chartAxesTypesStr.map(
    (t) => LeftRight[t as keyof typeof LeftRight]
  );
  const chartColumnsTypesStr = (
    formData.get('chartColumnsTypes')?.toString() || ''
  ).split(',');

  const chartColumnsTypes = chartColumnsTypesStr.map(
    (t) => CustomizableChartTypes[t as keyof typeof CustomizableChartTypes]
  );

  const chartType =
    ChartType[formData.get('chartType')?.toString() as keyof typeof ChartType];

  const query = formData
    .get('query')
    ?.toString()
    .replace(/\$newline/g, `\n`);

  const variables = (JSON.parse(
    formData.get('variables')?.toString() || 'null'
  ) || []) as VariableType[];
  return {
    title,
    privateDashboard,
    description,
    chartTitle,
    chartType,
    query,
    variables,
    chartAxesTypes,
    chartColumnsTypes,
  };
}

export async function addChartToDashboard(formData: FormData) {
  // let the client handle the error https://nextjs.org/learn/dashboard-app/error-handling
  // try {
  const {
    title,
    chartType,
    query,
    chartTitle,
    variables,
    chartAxesTypes,
    chartColumnsTypes,
  } = parseFormData(formData);

  if (!title || !chartType || !query) return null;

  console.log('server query', query);

  const dashboard = await getDashboard(title);
  if (!dashboard) return;

  return await prisma.$transaction(async (tx) => {
    const newChart = await addChart(
      dashboard.id,
      chartTitle,
      query,
      chartType,
      DEFAULT_CHART_X,
      DEFAULT_CHART_Y,
      DEFAULT_CHART_WIDTH,
      DEFAULT_CHART_HEIGHT,
      variables,
      chartAxesTypes,
      chartColumnsTypes
    );

    return {
      message: 'Added Chart',
      chart: newChart,
    };
  });
  // } catch (e) {
  //   return { message: 'Database Error: Failed to Update Invoice.' };
  // }
}

export async function createNewDashboardAndChart(formData: FormData) {
  const {
    title,
    privateDashboard,
    description,
    chartTitle,
    chartType,
    query,
    variables,
    chartAxesTypes,
    chartColumnsTypes,
  } = parseFormData(formData);

  console.log('server query', query);

  if (!title || !chartType || !query) throw new Error('Missing user input');
  try {
    return await prisma.$transaction(async (tx) => {
      const dashboard = await addDashboard(
        title,
        privateDashboard,
        description
      );
      const chart = await addChart(
        dashboard!.id,
        chartTitle,
        query,
        chartType,
        DEFAULT_CHART_X,
        DEFAULT_CHART_Y,
        DEFAULT_CHART_WIDTH,
        DEFAULT_CHART_HEIGHT,
        variables,
        chartAxesTypes,
        chartColumnsTypes
      );
      return {
        message: 'Added Dashboard & Chart',
        chart,
        dashboard,
        error: null,
      };
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          error: 'P2002',
          message: 'Dashboard title already exists',
          dashboard: null,
        };
      }
    }
    throw e;
  }
}
