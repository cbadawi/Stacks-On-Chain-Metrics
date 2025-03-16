'use server';

import { CustomizableChartTypes, LeftRight } from '@prisma/client';
import { ChartType } from '@/app/components/helpers';
import prisma from '../client';
import { VariableType } from '@/app/components/helpers';
import { verifySession } from '../../auth/sessions/verifySession';

interface ServerResponse<T> {
  success: boolean;
  message: string;
  response: T | null;
}

export async function addChart({
  dashboardId,
  title,
  query,
  chartType,
  x,
  y,
  width,
  height,
  variables,
  axesTypes,
  columnTypes,
}: {
  dashboardId: number;
  title: string;
  query: string;
  chartType: ChartType;
  x: number;
  y: number;
  width: number;
  height: number;
  variables: VariableType;
  axesTypes?: LeftRight[];
  columnTypes?: CustomizableChartTypes[];
}): Promise<ServerResponse<any>> {
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: null,
    };
  }

  const dashboard = await prisma.dashboard.findUnique({
    where: { id: dashboardId, owner: { address: session.userId } },
  });
  if (!dashboard) {
    return {
      success: false,
      message: 'Dashboard not found or unauthorized.',
      response: null,
    };
  }

  const newChart = await prisma.chart.create({
    data: {
      title,
      query,
      type: chartType,
      x,
      y,
      width,
      height,
      dashboardId,
      variables,
    },
  });
  return {
    success: true,
    message: 'Chart added successfully.',
    response: newChart,
  };
}

export async function getCharts({
  dashboardId,
}: {
  dashboardId: number;
}): Promise<ServerResponse<any[]>> {
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: [],
    };
  }
  const charts = await prisma.chart.findMany({
    where: { dashboardId },
    orderBy: { y: 'asc' },
  });
  return {
    success: true,
    message: 'Charts retrieved successfully.',
    response: charts,
  };
}

export async function deleteChart({
  id,
  dashboardId,
}: {
  dashboardId: number;
  owner: string;
  id: number;
}): Promise<ServerResponse<any>> {
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: null,
    };
  }
  const dashboard = await prisma.dashboard.findUnique({
    where: { id: dashboardId, owner: { address: session.userId } },
  });
  if (!dashboard) {
    return {
      success: false,
      message: 'Dashboard not found or unauthorized.',
      response: null,
    };
  }
  const deletedChart = await prisma.chart.delete({
    where: { id, dashboardId },
  });
  return {
    success: true,
    message: 'Chart deleted successfully.',
    response: deletedChart,
  };
}

export async function updateChart({
  title,
  x,
  y,
  height,
  width,
  query,
  type,
  id,
}: {
  title?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  query?: string;
  type?: ChartType;
  id: number;
}): Promise<ServerResponse<any>> {
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: null,
    };
  }

  const chart = await prisma.chart.findUnique({
    where: { id },
    select: {
      dashboardId: true,
      dashboard: { select: { owner: { select: { address: true } } } },
    },
  });
  if (!chart || chart.dashboard.owner.address !== session.userId) {
    return {
      success: false,
      message: 'Dashboard not found or unauthorized.',
      response: null,
    };
  }
  const data: Record<string, any> = {};
  if (title !== undefined) data.title = title;
  if (x !== undefined) data.x = x;
  if (y !== undefined) data.y = y;
  if (height !== undefined) data.height = height;
  if (width !== undefined) data.width = width;
  if (query !== undefined) data.query = query;
  if (type !== undefined) data.type = type;

  const updatedChart = await prisma.chart.update({
    where: { id },
    data,
  });
  return {
    success: true,
    message: 'Chart updated successfully.',
    response: updatedChart,
  };
}
