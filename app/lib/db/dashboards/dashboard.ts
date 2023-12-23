'use server';

import prisma from '@/app/lib/db/client';
import { Dashboard, Chart, Prisma } from '@prisma/client';
import { fetchData } from '../../fetch';
import { addOwner, getOwner } from '../users';

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
        const data = await fetchData(chart.query);
        return { ...chart, data };
      })
    );
  }
  return dashboard;
}

export async function getDashboards({
  email,
  privateDashboard,
}: {
  email?: string;
  privateDashboard?: boolean;
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
