'use server';

import {
  addDashboard,
  getDashboard,
  getDashboards,
} from '@/app/lib/db/dashboards/dashboard';
import { addChart } from '@/app/lib/db/dashboards/charts';
import {
  ChartType,
  LeftRight,
  Prisma,
  CustomizableChartTypes,
  Dashboard,
} from '@prisma/client';
import { VariableType } from '../helpers';
import prisma from '@/app/lib/db/client';

const DEFAULT_CHART_X = 0;
const DEFAULT_CHART_Y = 0;
const DEFAULT_CHART_WIDTH = 500;
const DEFAULT_CHART_HEIGHT = 400;

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

// export async function createNewDashboardAndChart(formData: FormData) {
//   const {
//     title,
//     privateDashboard,
//     chartTitle,
//     chartType,
//     query,
//     variables,
//     chartAxesTypes,
//     chartColumnsTypes,
//   } = parseFormData(formData);

//   console.log('server query', query);

//   if (!title || !chartType || !query) throw new Error('Missing user input');
//   try {
//     return await prisma.$transaction(async (tx) => {
//       const dashboard = await addDashboard(title, privateDashboard);
//       const chart = await addChart(
//         dashboard!.id,
//         chartTitle,
//         query,
//         chartType,
//         DEFAULT_CHART_X,
//         DEFAULT_CHART_Y,
//         DEFAULT_CHART_WIDTH,
//         DEFAULT_CHART_HEIGHT,
//         variables,
//         chartAxesTypes,
//         chartColumnsTypes
//       );
//       return {
//         message: 'Added Dashboard & Chart',
//         chart,
//         dashboard,
//         error: null,
//       };
//     });
//   } catch (e) {
//     if (e instanceof Prisma.PrismaClientKnownRequestError) {
//       if (e.code === 'P2002') {
//         return {
//           error: 'P2002',
//           message: 'Dashboard title already exists',
//           dashboard: null,
//         };
//       }
//     }
//     throw e;
//   }
// }
