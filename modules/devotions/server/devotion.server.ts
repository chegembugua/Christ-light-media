import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { CreateDevotionInput, DevotionDTO, UpdateDevotionInput } from '../types';

function toDTO(row: {
  id: string;
  title: string;
  verse: string | null;
  verseText: string | null;
  reflection: string | null;
  date: Date;
  isPublished: boolean;
  createdAt: Date;
}): DevotionDTO {
  return {
    id: row.id,
    title: row.title,
    verse: row.verse,
    verseText: row.verseText,
    reflection: row.reflection,
    date: row.date.toISOString(),
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listPublishedDevotions(): Promise<DevotionDTO[]> {
  const rows = await prisma.devotion.findMany({
    where: { isPublished: true },
    orderBy: { date: 'desc' },
  });
  return rows.map(toDTO);
}

export async function listAllDevotions(): Promise<DevotionDTO[]> {
  const rows = await prisma.devotion.findMany({ orderBy: { date: 'desc' } });
  return rows.map(toDTO);
}

export async function getDevotionById(id: string): Promise<DevotionDTO | null> {
  const row = await prisma.devotion.findUnique({ where: { id } });
  return row ? toDTO(row) : null;
}

export async function createDevotion(input: CreateDevotionInput): Promise<DevotionDTO> {
  const row = await prisma.devotion.create({
    data: {
      title: input.title,
      verse: input.verse ?? null,
      verseText: input.verseText ?? null,
      reflection: input.reflection ?? null,
      date: input.date ? new Date(input.date) : new Date(),
      isPublished: input.isPublished ?? false,
    },
  });
  return toDTO(row);
}

export async function updateDevotion(
  id: string,
  input: UpdateDevotionInput
): Promise<DevotionDTO> {
  const data: Prisma.DevotionUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.verse !== undefined) data.verse = input.verse;
  if (input.verseText !== undefined) data.verseText = input.verseText;
  if (input.reflection !== undefined) data.reflection = input.reflection;
  if (input.date !== undefined) data.date = new Date(input.date);
  if (input.isPublished !== undefined) data.isPublished = input.isPublished;

  const row = await prisma.devotion.update({ where: { id }, data });
  return toDTO(row);
}

export async function deleteDevotion(id: string): Promise<void> {
  await prisma.devotion.delete({ where: { id } });
}

export async function countDevotions(): Promise<{ total: number; published: number }> {
  const [total, published] = await Promise.all([
    prisma.devotion.count(),
    prisma.devotion.count({ where: { isPublished: true } }),
  ]);
  return { total, published };
}
