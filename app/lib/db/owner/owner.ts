'use server';

import prisma from '../client';

export async function createOwner(address: string, appKey: string) {
  const owner = await prisma.owner.create({
    data: {
      address,
      appKey,
    },
  });
  return owner;
}
