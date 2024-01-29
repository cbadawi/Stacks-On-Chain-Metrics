'use server';

import prisma from '@/app/lib/db/client';
import { Dashboard, Chart } from '@prisma/client';
import { fetchData } from '../../fetch';
import { addOwner, getOwner } from '../users';
import { replaceVariables } from '../replaceVariables';
import { VariableType } from '@/app/components/helpers';

export type ChartWithData = { data: any[] } & Chart;

export type DashboardWithCharts = Dashboard & { charts: ChartWithData[] };

export async function addDashboard(
  title: string,
  privateDashboard: boolean,
  description: string = ''
) {
  // TODO get user from session
  const email = 'dummy@';
  let owner = await getOwner(email);
  if (!owner) owner = await addOwner(email, 'hash');
  const newDashboard = await prisma.dashboard.create({
    data: {
      title,
      private: privateDashboard,
      description,
      ownerId: owner.id,
    },
  });
  return newDashboard;
}

export async function getDashboard(
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
  email,
  isPrivate,
}: {
  email?: string;
  isPrivate?: boolean;
}) {
  let whereClause: {
    deleted: boolean;
    owner?: {
      email: string;
    };
  } = { deleted: false };
  if (email) {
    whereClause = { ...whereClause, owner: { email } };
  }
  return await prisma.dashboard.findMany({
    where: whereClause,
  });
}
