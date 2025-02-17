'use server';

import { ChartType, CustomizableChartTypes, LeftRight } from '@prisma/client';
import prisma from '../client';
import { VariableType } from '@/app/components/helpers';

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
  axesTypes?: LeftRight[] | undefined;
  columnTypes?: CustomizableChartTypes[] | undefined;
}) {
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

  return newChart;
}

export async function getCharts({ dashboardId }: { dashboardId: number }) {
  const charts = await prisma.chart.findMany({
    where: { dashboardId },
    orderBy: { y: 'asc' },
  });

  return charts;
}

export async function deleteChart({
  id,
  dashboardId,
  owner,
  appKey,
}: {
  dashboardId: number;
  owner: string;
  appKey: string;
  id: number;
}) {
  const dashboard = await prisma.dashboard.findUnique({
    where: { id: dashboardId, owner: { appKey, address: owner } },
  });

  if (!dashboard) return;
  const charts = await prisma.chart.delete({
    where: { id, dashboardId },
  });

  return charts;
}

export async function persistChartUpdate({
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
}) {
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
  return updatedChart;
}
