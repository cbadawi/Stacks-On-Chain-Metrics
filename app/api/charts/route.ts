import prisma from '@/app/lib/db/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const dashboardId = parseInt(
    request.nextUrl.searchParams.get('dashboard') || ''
  );
  const filter = dashboardId
    ? {
        dashboardId,
        deleted: false,
      }
    : {
        deleted: false,
      };
  const users = await prisma.chart.findMany({
    where: filter,
    orderBy: { id: 'asc' },
  });

  return NextResponse.json(users);
}
