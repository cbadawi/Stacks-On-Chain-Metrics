'use server';

import prisma from '@/app/lib/db/client';
import { addDashboard, getDashboard } from '@/app/lib/db/dashboards/dashboard';
import { addChart } from '@/app/lib/db/dashboards/charts';
import { ChartType, Dashboard, Prisma } from '@prisma/client';

const DEFAULT_CHART_X = 0;
const DEFAULT_CHART_Y = 0;
const DEFAULT_CHART_WIDTH = 500;
const DEFAULT_CHART_HEIGHT = 400;

function parseFormData(formData: FormData) {
  const title = formData.get('title')?.toString();
  const privateDashboard = Boolean(formData.get('private'));
  const description = formData.get('description')?.toString();
  const chartTitle = formData.get('chartTitle')?.toString() || '';
  const chartType =
    ChartType[formData.get('chartType')?.toString() as keyof typeof ChartType];
  const query = formData.get('query')?.toString();
  const variables = formData.get('variables')?.toString();

  return {
    title,
    privateDashboard,
    description,
    chartTitle,
    chartType,
    query,
    variables,
  };
}

// we need to implement 1- save to an existing dashboard and 2- create new dashboard and chart
export async function addChartToDashboard(formData: FormData) {
  // let the client handle the error https://nextjs.org/learn/dashboard-app/error-handling
  // try {
  const { title, chartType, query, chartTitle } = parseFormData(formData);

  if (!title || !chartType || !query) return null;

  const dashboard = await getDashboard(title);
  if (!dashboard) return;

  const newChart = await addChart(
    dashboard.id,
    chartTitle,
    query,
    chartType,
    DEFAULT_CHART_X,
    DEFAULT_CHART_Y,
    DEFAULT_CHART_WIDTH,
    DEFAULT_CHART_HEIGHT
  );
  return {
    message: 'Added Chart',
    chart: newChart,
  };
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
  } = parseFormData(formData);

  if (!title || !chartType || !query) throw new Error('Missing user input');
  try {
    const dashboard = await addDashboard(title, privateDashboard, description);
    const chart = addChart(
      dashboard!.id,
      chartTitle,
      query,
      chartType,
      DEFAULT_CHART_X,
      DEFAULT_CHART_Y,
      DEFAULT_CHART_WIDTH,
      DEFAULT_CHART_HEIGHT
    );
    return {
      message: 'Added Dashboard & Chart',
      chart,
      dashboard,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          error: 'P2002',
          message: 'Dashboard title already exists',
        };
      }
    }
    throw e;
  }
}
