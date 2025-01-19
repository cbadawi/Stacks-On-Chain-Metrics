'use server';

import {
  Chart,
  ChartType,
  CustomizableChartTypes,
  LeftRight,
} from '@prisma/client';
import prisma from '../client';
import { ChartWithData } from './dashboard';
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
  variables: VariableType[];
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
      columnTypes,
      axesTypes,
    },
  });

  return newChart;
}

export async function updateChart(chart: Chart | ChartWithData) {
  const { title, x, y, height, width, query, type } = chart;

  const updatedChart = await prisma.chart.update({
    where: { id: chart.id },
    data: { title, x, y, height, width, query, type },
  });
  return updatedChart;
}
