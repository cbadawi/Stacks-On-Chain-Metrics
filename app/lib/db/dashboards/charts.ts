'use server';

import { Chart, ChartType } from '@prisma/client';
import prisma from '../client';
import { ChartWithData } from './dashboard';

export async function addChart(
  dashboardId: number,
  title: string,
  query: string,
  chartType: ChartType,
  x: number,
  y: number,
  width: number,
  height: number,
  variables?: any[],
  custommizations?: any
) {
  const newChart = await prisma.chart.create({
    data: {
      title,
      query,
      variables,
      type: chartType,
      x,
      y,
      width,
      height,
      dashboardId,
    },
  });

  return newChart;
}

export async function updateChart(chart: Chart | ChartWithData) {
  const { title, x, y, height, width, query, variables, type } = chart;

  const updatedChart = await prisma.chart.update({
    where: { id: chart.id },
    data: { title, x, y, height, width, query, variables, type },
  });
  return updatedChart;
}
