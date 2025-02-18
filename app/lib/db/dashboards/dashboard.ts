'use server';

import { addOwner, getOwner } from '../owner';
import { Chart, Dashboard, Owner } from '@prisma/client';
import prisma from '../client';
import { verifySession } from '../../auth/sessions/verifySession';

interface ServerResponse<T> {
  success: boolean;
  message: string;
  response: T | null;
}

export type ChartWithData = { data: any[] } & Chart;

export type DashboardWithCharts = Dashboard & {
  charts: Chart[];
  owner: { address: string };
};

export async function addDashboard({
  title,
  privateDashboard,
  address,
}: {
  title: string;
  address: string;
  privateDashboard?: boolean;
}): Promise<ServerResponse<Dashboard>> {
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: null,
    };
  }
  let owner = await getOwner(address);
  if (!owner) owner = await addOwner(address);
  const newDashboard = await prisma.dashboard.create({
    data: {
      title,
      private: privateDashboard,
      ownerId: owner.id,
    },
  });
  return {
    success: true,
    message: 'Dashboard created successfully.',
    response: newDashboard,
  };
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
}): Promise<ServerResponse<DashboardWithCharts | null>> {
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: null,
    };
  }
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
  return {
    success: true,
    message: 'Dashboard retrieved successfully.',
    response: dashboard,
  };
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
}): Promise<ServerResponse<Dashboard[]>> {
  // const session = await verifySession();
  // if (!session) {
  //   return {
  //     success: false,
  //     message: 'Invalid session. Sign in to continue.',
  //     response: [],
  //   };
  // }
  const whereClause = await buildDashboardWhereClause(address, id, title);
  const dashboards = await prisma.dashboard.findMany({
    where: { ...whereClause },
  });
  return {
    success: true,
    message: 'Dashboards retrieved successfully.',
    response: dashboards,
  };
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
}): Promise<ServerResponse<Dashboard | null>> {
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: null,
    };
  }
  const whereClause = await buildDashboardWhereClause(address, id, title);
  const dashboard = await prisma.dashboard.findFirst({
    where: { ...whereClause },
  });
  return {
    success: true,
    message: 'Dashboard retrieved successfully.',
    response: dashboard,
  };
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

export async function deleteDashboard({
  id,
}: {
  id: number;
}): Promise<ServerResponse<Dashboard | null>> {
  const session = await verifySession();
  if (!session) {
    return {
      success: false,
      message: 'Invalid session. Sign in to continue.',
      response: null,
    };
  }
  const dashboard = await prisma.dashboard.findFirst({
    where: {
      id,
      owner: {
        address: session.userId,
      },
      deleted: false,
    },
  });
  if (!dashboard) {
    return {
      success: false,
      message: 'Dashboard not found or unauthorized.',
      response: null,
    };
  }
  const deletedDashboard = await prisma.dashboard.delete({
    where: { id },
  });
  return {
    success: true,
    message: 'Dashboard deleted successfully.',
    response: deletedDashboard,
  };
}
