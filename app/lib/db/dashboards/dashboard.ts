'use server';

import prisma from '@/app/lib/db/client';
import { Dashboard, Chart, Prisma } from '@prisma/client';
import { fetchData } from '../../fetch';
import { addOwner, getOwner } from '../users';

export type ChartWithData = Chart & { data: any[] };

export type DashboardWithCharts = Prisma.DashboardGetPayload<{
  include: { charts: { where: { deleted: false } } };
}>;

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
  const dashboard = await prisma.dashboard.findUniqueOrThrow({
    where: {
      deleted_title: {
        title,
        deleted: false,
      },
    },
    include,
  });
  return dashboard;
}

export async function getDashboards({ email }: { email?: string }) {
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
