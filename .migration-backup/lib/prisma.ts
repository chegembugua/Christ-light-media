/**
 * Prisma client singleton — prevents connection exhaustion in development.
 * Import as: import prisma from '@/lib/prisma'
 */
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

declare const globalThis: {
  prismaGlobal: PrismaClient | undefined;
} & typeof global;

let prisma: any;

if (process.env.DATABASE_URL) {
  prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
  }
} else {
  // Fallback noop prisma when DATABASE_URL is not provided (prevents build-time crashes).
  const noopModel = new Proxy({}, {
    get(_, method) {
      if (method === 'findMany') return async () => [];
      if (method === 'findUnique') return async () => null;
      if (method === 'create') return async () => null;
      if (method === 'update') return async () => null;
      if (method === 'delete') return async () => null;
      if (method === 'count') return async () => 0;
      return async () => null;
    }
  });

  prisma = new Proxy({}, {
    get(_, modelName) {
      return noopModel;
    }
  });
}

export default prisma;
