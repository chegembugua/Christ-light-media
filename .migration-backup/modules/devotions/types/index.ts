/** Devotion DTOs for API and UI */
export interface DevotionDTO {
  id: string;
  title: string;
  verse: string;
  verseText: string | null;
  reflection: string;
  date: string;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDevotionInput {
  title: string;
  verse: string;
  verseText?: string | null;
  reflection: string;
  date: string;
  imageUrl?: string | null;
  isPublished?: boolean;
}

export type UpdateDevotionInput = Partial<CreateDevotionInput>;
