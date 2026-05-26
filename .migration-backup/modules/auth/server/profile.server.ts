/**
 * Server-side profile operations (used by API routes & OAuth callback).
 */
import prisma from '@/lib/prisma';
import type { Role } from '@prisma/client';

export interface UpsertProfileInput {
  id: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}

export async function getProfileById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function upsertProfile(input: UpsertProfileInput) {
  return prisma.user.upsert({
    where: { id: input.id },
    create: {
      id: input.id,
      email: input.email,
      fullName: input.fullName ?? null,
      avatarUrl: input.avatarUrl ?? null,
      role: 'USER' satisfies Role,
    },
    update: {
      email: input.email,
      fullName: input.fullName ?? undefined,
      avatarUrl: input.avatarUrl ?? undefined,
    },
  });
}
