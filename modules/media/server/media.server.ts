import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { CreateMediaInput, MediaDTO, UpdateMediaInput } from '../types';

function toDTO(row: {
  id: string;
  title: string;
  description: string | null;
  coverImage: string;
  audioUrl: string;
  videoUrl: string | null;
  type: string;
  category: string;
  speaker: string;
  duration: string | null;
  playCount: number;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt?: Date;
}): MediaDTO {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    coverImage: row.coverImage,
    audioUrl: row.audioUrl,
    videoUrl: row.videoUrl,
    type: row.type,
    category: row.category,
    speaker: row.speaker,
    duration: row.duration,
    playCount: row.playCount,
    isPublished: row.isPublished,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function listPublishedMedia(type?: string): Promise<MediaDTO[]> {
  const rows = await prisma.media.findMany({
    where: { isPublished: true, ...(type ? { type } : {}) },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toDTO);
}

export async function listAllMedia(): Promise<MediaDTO[]> {
  const rows = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(toDTO);
}

export async function getMediaById(id: string): Promise<MediaDTO | null> {
  const row = await prisma.media.findUnique({ where: { id } });
  return row ? toDTO(row) : null;
}

export async function createMedia(input: CreateMediaInput): Promise<MediaDTO> {
  const publish = input.isPublished ?? false;
  const row = await prisma.media.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      coverImage: input.coverImage,
      audioUrl: input.audioUrl,
      videoUrl: input.videoUrl ?? null,
      type: input.type,
      category: input.category,
      speaker: input.speaker,
      duration: input.duration ?? null,
      isPublished: publish,
      publishedAt: publish ? new Date() : null,
    },
  });
  return toDTO(row);
}

export async function updateMedia(id: string, input: UpdateMediaInput): Promise<MediaDTO> {
  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) throw new Error('Media not found');

  const data: Prisma.MediaUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.coverImage !== undefined) data.coverImage = input.coverImage;
  if (input.audioUrl !== undefined) data.audioUrl = input.audioUrl;
  if (input.videoUrl !== undefined) data.videoUrl = input.videoUrl;
  if (input.type !== undefined) data.type = input.type;
  if (input.category !== undefined) data.category = input.category;
  if (input.speaker !== undefined) data.speaker = input.speaker;
  if (input.duration !== undefined) data.duration = input.duration;

  if (input.isPublished !== undefined) {
    data.isPublished = input.isPublished;
    if (input.isPublished && !existing.publishedAt) {
      data.publishedAt = new Date();
    }
  }

  const row = await prisma.media.update({ where: { id }, data });
  return toDTO(row);
}

export async function deleteMedia(id: string): Promise<void> {
  await prisma.media.delete({ where: { id } });
}

export async function countMedia(): Promise<{ total: number; published: number }> {
  const [total, published] = await Promise.all([
    prisma.media.count(),
    prisma.media.count({ where: { isPublished: true } }),
  ]);
  return { total, published };
}
