import prisma from '@/app/lib/db/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const chart = await prisma.chart.findUnique({
    where: { id: parseInt(params.id), deleted: false },
  });

  if (!chart)
    return NextResponse.json({ error: 'Invalid chart' }, { status: 404 });

  await prisma.chart.delete({
    where: { id: chart.id },
  });

  return NextResponse.json({});
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const { query, variables, x, y, width, height, type } = body;

  const chart = await prisma.chart.findUnique({
    where: { id: parseInt(params.id), deleted: false },
  });
  if (!chart)
    return NextResponse.json({ error: 'Invalid chart' }, { status: 404 });

  const updatedIssue = await prisma.chart.update({
    where: { id: chart.id },
    data: {
      query,
      variables,
      x,
      y,
      width,
      height,
      type,
    },
  });

  return NextResponse.json(updatedIssue);
}
