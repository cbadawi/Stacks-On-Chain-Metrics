import { ChartType } from '@prisma/client';
import prisma from '../client';

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
