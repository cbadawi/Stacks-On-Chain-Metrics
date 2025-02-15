import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const stacksPool = new Pool({
  user: process.env.STACKS_DB_USER,
  host: process.env.STACKS_DB_HOST,
  database: process.env.STACKS_DB_DATABASE,
  password: process.env.STACKS_DB_PASSWORD,
  port: Number(process.env.STACKS_DB_PORT),
  query_timeout: 100000,
});
