import prisma from './client';

export async function addUser(email: string, hash: string, name: string = '') {
  const user = await prisma.user.create({
    data: { name, email, hash },
  });
  return user;
}

export async function getUser(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}
