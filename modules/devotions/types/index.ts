/** Devotion DTOs for API and UI */
export interface DevotionDTO {
  id: string;
  title: string;
  verse: string | null;
  verseText: string | null;
  reflection: string | null;
  date: string;
  isPublished: boolean;
  createdAt: string;
}

export interface CreateDevotionInput {
  title: string;
  verse?: string;
  verseText?: string;
  reflection?: string;
  date?: string;
  isPublished?: boolean;
}

export type UpdateDevotionInput = Partial<CreateDevotionInput>;
