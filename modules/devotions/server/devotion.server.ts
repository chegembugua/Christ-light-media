import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { CreateDevotionInput, DevotionDTO, UpdateDevotionInput } from '../types';

function toDTO(row: {
  id: string;
  title: string;
  verse: string;
  verseText: string | null;
  reflection: string;
  date: Date;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): DevotionDTO {
  return {
    id: row.id,
    title: row.title,
    verse: row.verse,
    verseText: row.verseText,
    reflection: row.reflection,
    date: row.date.toISOString(),
    imageUrl: row.imageUrl,
    isPublished: row.isPublished,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
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
      verse: input.verse,
      verseText: input.verseText ?? null,
      reflection: input.reflection,
      date: new Date(input.date),
      imageUrl: input.imageUrl ?? null,
      isPublished: input.isPublished ?? false,
      publishedAt: input.isPublished ? new Date() : null,
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
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
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
