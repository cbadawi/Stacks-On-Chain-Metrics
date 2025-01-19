'use server';

import prisma from './client';

export async function addOwner(address: string) {
  const user = await prisma.owner.create({
    data: { address },
  });
  return user;
}

export async function getOwner(address: string) {
  return prisma.owner.findUnique({
    where: {
      address,
    },
  });
}
