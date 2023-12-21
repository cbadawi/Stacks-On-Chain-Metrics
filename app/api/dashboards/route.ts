import prisma from '@/app/lib/db/client';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  let whereClause: {
    deleted: boolean;
    owner?: {
      email: string;
    };
  } = { deleted: false };
  if (email) {
    whereClause = { ...whereClause, owner: { email: email } };
  }

  const dashboards = await prisma.dashboard.findMany({
    where: whereClause,
    orderBy: { id: 'asc' },
  });
  return NextResponse.json({ dashboards });
}

export async function POST(request: NextRequest) {
  // const session = await getServerSession(authOptions);
  // if (!session) return NextResponse.json({}, { status: 401 });
  const body = await request.json();

  const newDashboard = await prisma.dashboard.create({
    data: { ...body },
  });

  return NextResponse.json(newDashboard, { status: 201 });
}
