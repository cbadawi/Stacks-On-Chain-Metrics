'use server';

import prisma from '@/app/lib/db/client';
import { addDashboard, getDashboard } from '@/app/lib/db/dashboards/dashboard';
import { addChart, getCharts } from '../lib/db/dashboards/charts';
import { ChartType, VariableType } from '../components/helpers';

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
  dashboardPassword?: string;
}) {
  let dashboardResponse = await getDashboard({
    title: dashboardTitle,
    address: userAddress,
  });
  let dashboard = dashboardResponse.response;
  let message = dashboardResponse.message;
  if (!dashboard) {
    const addDashboardResp = await addDashboard({
      title: dashboardTitle,
      privateDashboard,
      address: userAddress,
    });
    message = addDashboardResp.message;
    dashboard = addDashboardResp.response;
  } else {
    // const currentCharts = await getCharts({ dashboardId: dashboard.id });
    // currentCharts.map((c) => c.x);
  }

  if (!dashboard)
    return { message: 'Failed to add chart: ' + message, success: false };

  const response = await prisma.$transaction(async (tx) => {
    const newChart = await addChart({
      dashboardId: dashboard.id,
      title: chartTitle,
      query,
      chartType: chartType,
      x: DEFAULT_CHART_X,
      y: DEFAULT_CHART_Y,
      width: DEFAULT_CHART_WIDTH,
      height: DEFAULT_CHART_HEIGHT,
      variables,
    });

    return {
      message: newChart.message ?? 'Added Chart',
      success: newChart.success,
      dashboard,
      chart: newChart,
    };
  });

  return response;
}
