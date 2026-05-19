import type { MediaType } from '@prisma/client';

export interface MediaDTO {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  type: MediaType;
  category: string | null;
  speaker: string | null;
  duration: string | null;
  playCount: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface CreateMediaInput {
  title: string;
  description?: string;
  coverImage?: string;
  audioUrl?: string;
  videoUrl?: string;
  type: MediaType;
  category?: string;
  speaker?: string;
  duration?: string;
  isPublished?: boolean;
}

export type UpdateMediaInput = Partial<CreateMediaInput>;

export const MEDIA_TYPE_OPTIONS: { value: MediaType; label: string }[] = [
  { value: 'SERMON', label: 'Sermon' },
  { value: 'PODCAST', label: 'Podcast' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'WORSHIP', label: 'Worship' },
  { value: 'RADIO', label: 'Radio' },
];
