import prisma from './client';

export async function addOwner(email: string, hash: string, name: string = '') {
  const user = await prisma.owner.create({
    data: { name, email, hash },
  });
  return user;
}

export async function getOwner(email: string) {
  return prisma.owner.findUnique({
    where: {
      email,
    },
  });
}
