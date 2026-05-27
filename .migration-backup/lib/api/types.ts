/**
 * lib/api/types.ts
 * Type-safe API request/response types for all endpoints
 */

import type {
  Media,
  Devotion,
  News,
  PrayerRequest,
  PrayerVote,
  Comment,
  Donation,
  User,
  Notification,
} from '@prisma/client';

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  pagination?: PaginationMeta;
}

// ============================================================================
// MEDIA
// ============================================================================

export interface CreateMediaRequest {
  title: string;
  description?: string;
  coverImage?: string;
  audioUrl?: string;
  videoUrl?: string;
  type: 'SERMON' | 'PODCAST' | 'MUSIC' | 'WORSHIP' | 'RADIO';
  category?: string;
  speaker?: string;
  duration?: number;
  podcastShowId?: string;
}

export interface UpdateMediaRequest extends Partial<CreateMediaRequest> {
  isPublished?: boolean;
  publishedAt?: string | null;
}

export interface MediaResponse extends Media {
  comments?: Comment[];
  podcastShow?: { id: string; title: string } | null;
  commentCount?: number;
}

// ============================================================================
// DEVOTIONS
// ============================================================================

export interface CreateDevotionRequest {
  title: string;
  verse?: string;
  verseText?: string;
  reflection?: string;
  date: string; // ISO date
}

export interface UpdateDevotionRequest extends Partial<CreateDevotionRequest> {
  isPublished?: boolean;
}

// ============================================================================
// NEWS
// ============================================================================

export interface CreateNewsRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {
  isPublished?: boolean;
  publishedAt?: string | null;
}

// ============================================================================
// PRAYER REQUESTS
// ============================================================================

export interface CreatePrayerRequestRequest {
  title: string;
  content: string;
  category?: string;
  isPublic?: boolean;
}

export interface UpdatePrayerRequestRequest
  extends Partial<CreatePrayerRequestRequest> {
  isAnswered?: boolean;
}

export interface PrayerRequestResponse extends PrayerRequest {
  user?: Omit<User, 'password' | 'role'> & { role?: string };
  votes?: PrayerVote[];
}

// ============================================================================
// COMMENTS
// ============================================================================

export interface CreateCommentRequest {
  content: string;
  mediaId: string;
}

export interface CommentResponse extends Comment {
  user?: Pick<User, 'id' | 'fullName' | 'avatarUrl'>;
}

// ============================================================================
// DONATIONS
// ============================================================================

export interface CreateDonationRequest {
  amount: number;
  type: 'ONE_TIME' | 'MONTHLY' | 'PROJECT';
  project?: string;
  currency?: string;
}

export interface DonationResponse extends Donation {
  user?: Pick<User, 'id' | 'fullName' | 'email'>;
}

// ============================================================================
// USER PROFILE
// ============================================================================

export interface UpdateUserProfileRequest {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UserProfileResponse extends Omit<User, 'role'> {
  role: string;
}

// ============================================================================
// SEARCH
// ============================================================================

export interface SearchRequest extends PaginationParams {
  q: string;
  type?: 'media' | 'news' | 'devotion';
  limit?: number;
}

export interface SearchResponse {
  media?: Media[];
  news?: News[];
  devotions?: Devotion[];
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface UpdateNotificationRequest {
  isRead?: boolean;
}

// ============================================================================
// QUERY FILTERS
// ============================================================================

export interface MediaFilters extends PaginationParams {
  type?: string;
  category?: string;
  published?: boolean;
}

export interface DevotionFilters extends PaginationParams {
  published?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface NewsFilters extends PaginationParams {
  category?: string;
  published?: boolean;
}

export interface PrayerRequestFilters extends PaginationParams {
  category?: string;
  answered?: boolean;
}

export interface DonationFilters extends PaginationParams {
  type?: string;
  status?: string;
}

export interface NotificationFilters extends PaginationParams {
  unreadOnly?: boolean;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Generic async API call result type
 */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Type-safe fetch wrapper return
 */
export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}
