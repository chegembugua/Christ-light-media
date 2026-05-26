export type MediaType = 'SERMON' | 'PODCAST' | 'MUSIC' | 'WORSHIP' | 'RADIO';

export interface MediaDTO {
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
  publishedAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMediaInput {
  title: string;
  description?: string;
  coverImage: string;
  audioUrl: string;
  videoUrl?: string;
  type: string;
  category: string;
  speaker: string;
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
