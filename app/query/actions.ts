'use server';

import prisma from '@/app/lib/db/client';
import { ChartType, Dashboard } from '@prisma/client';
import { addDashboard, getDashboard } from '@/app/lib/db/dashboards/dashboard';
import { addChart, getCharts } from '../lib/db/dashboards/charts';
import { VariableType } from '../components/helpers';

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
