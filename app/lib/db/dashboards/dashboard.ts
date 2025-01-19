'use server';

import { fetchData } from '../../fetch';
import { addOwner, getOwner } from '../owner';
import { replaceVariables } from '../replaceVariables';
import { VariableType } from '@/app/components/helpers';
import { Chart, Dashboard, Owner } from '@prisma/client';
import prisma from '../client';

export type ChartWithData = { data: any[] } & Chart;

export type DashboardWithCharts = Dashboard & { charts: ChartWithData[] };

export async function addDashboard({
  title,
  privateDashboard,
  password,
  address,
}: {
  title: string;
  address: string;
  privateDashboard?: boolean | undefined;
  password?: string | undefined;
}) {
  let owner = await getOwner(address);
  if (!owner) owner = await addOwner(address);
  const newDashboard = await prisma.dashboard.create({
    data: {
      title,
      private: privateDashboard,
      ownerId: owner.id,
    },
  });
  return newDashboard;
}

export async function getDashboardAndCharts(
  title: string,
  searchParams?: any,
  includeCharts: Boolean = true
): Promise<Dashboard | DashboardWithCharts | null> {
  const include = includeCharts
    ? { charts: { where: { deleted: false } } }
    : {};
  const dashboard = await prisma.dashboard.findUnique({
    where: {
      deleted_title: {
        title,
        deleted: false,
      },
    },
    include,
  });

  if (includeCharts && dashboard?.charts.length) {
    dashboard.charts = await Promise.all(
      dashboard?.charts.map(async (chart) => {
        const defaultVariables = chart.variables.map((variableObj) => {
          const variableType = variableObj as VariableType;
          const value = searchParams
            ? searchParams[variableType.variable]
            : null;
          if (value) variableType.value = value;
          return variableType as VariableType;
        });
        const queryWithDefaultVariables = defaultVariables?.length
          ? replaceVariables(chart.query, defaultVariables)
          : chart.query;
        const data = await fetchData(queryWithDefaultVariables);
        return { ...chart, data };
      })
    );
  }
  return dashboard;
}

export async function getDashboards({
  address,
  id,
  title,
}: {
  address?: string;
  id?: number;
  title?: string;
  includePrivate?: boolean;
}): Promise<Dashboard[]> {
  const whereClause = await buildDashboardWhereClause(address, id, title);
  return await prisma.dashboard.findMany({
    where: { ...whereClause },
  });
}

export async function getDashboard({
  address,
  id,
  title,
}: {
  address?: string;
  id?: number;
  title?: string;
  includePrivate?: boolean;
}): Promise<Dashboard | null> {
  const whereClause = await buildDashboardWhereClause(address, id, title);
  return await prisma.dashboard.findFirst({
    where: { ...whereClause },
  });
}

async function buildDashboardWhereClause(
  address?: string,
  id?: number,
  title?: string
) {
  let whereClause: {
    deleted: boolean;
    owner?: Owner;
    id?: number;
    title?: string;
  } = { deleted: false };

  if (address) {
    const owner = await getOwner(address);
    if (owner) whereClause = { ...whereClause, owner };
  }
  if (id) whereClause = { ...whereClause, id };
  if (title) whereClause = { ...whereClause, title };
  return whereClause;
}
