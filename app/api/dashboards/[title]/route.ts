import prisma from '@/app/lib/db/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { title: string } }
) {
  const dashboard = await prisma.dashboard.findUnique({
    where: {
      deleted_title: {
        deleted: false,
        title: params.title,
      },
    },
  });
  if (!dashboard)
    return NextResponse.json({ error: 'Invalid dashboard' }, { status: 404 });

  await prisma.dashboard.delete({
    where: {
      deleted_title: {
        deleted: false,
        title: params.title,
      },
    },
  });

  return NextResponse.json({});
}
