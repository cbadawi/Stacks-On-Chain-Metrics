'use server';

import { addOwner, getOwner } from '../owner';
import { Chart, Dashboard, Owner } from '@prisma/client';
import prisma from '../client';

export type ChartWithData = { data: any[] } & Chart;

export type DashboardWithCharts = Dashboard & {
  charts: Chart[];
  owner: { address: string };
};

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

export async function getDashboardAndCharts({
  title,
  searchParams,
  id,
  includeCharts = true,
}: {
  title?: string;
  id?: number;
  searchParams?: any;
  includeCharts?: boolean;
}) {
  const include = includeCharts
    ? { charts: { where: { deleted: false } } }
    : {};
  const dashboard = await prisma.dashboard.findFirst({
    where: {
      title,
      deleted: false,
      id,
    },
    include: { owner: { select: { address: true } }, ...include },
  });
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
