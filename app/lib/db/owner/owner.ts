'use server';

import prisma from '../client';

export async function createOwner(address: string) {
  const owner = await prisma.owner.create({
    data: {
      address,
    },
  });
  return owner;
}
