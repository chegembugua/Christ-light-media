import { parseISO } from 'date-fns';

/**
 * Returns start date for given range
 * @param range - '7d' | '30d' | '365d'
 * @returns Date object representing the start of the range
 */
export function getDateRangeStart(range: '7d' | '30d' | '365d'): Date {
  const now = new Date();
  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '365d':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // Default to 1 year
  }
}

/**
 * Returns estimated minutes to read
 * @param content - The article content
 * @returns Estimated reading time in minutes
 */
export function getArticleReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200)); // 200 words per minute
}