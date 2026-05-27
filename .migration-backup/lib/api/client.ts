/**
 * lib/api/client.ts
 * Type-safe fetch wrapper for calling API endpoints from client components
 */

import type { ApiResponse } from './types';

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  cache?: RequestCache;
}

/**
 * Type-safe API fetch wrapper
 * Automatically adds authentication via cookies
 * Handles error responses consistently
 */
export async function apiCall<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    body,
    cache = 'no-store',
  } = options;

  try {
    const url = endpoint.startsWith('/')
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${endpoint}`
      : endpoint;

    const response = await fetch(url, {
      method,
      cache,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      return {
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return data;
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Unknown error occurred';
    return {
      error: message,
    };
  }
}

/**
 * GET request helper
 */
export function apiGet<T = unknown>(
  endpoint: string,
  cache?: RequestCache
) {
  return apiCall<T>(endpoint, { method: 'GET', cache });
}

/**
 * POST request helper
 */
export function apiPost<T = unknown>(
  endpoint: string,
  body?: Record<string, unknown>
) {
  return apiCall<T>(endpoint, { method: 'POST', body });
}

/**
 * PUT request helper
 */
export function apiPut<T = unknown>(
  endpoint: string,
  body?: Record<string, unknown>
) {
  return apiCall<T>(endpoint, { method: 'PUT', body });
}

/**
 * PATCH request helper
 */
export function apiPatch<T = unknown>(
  endpoint: string,
  body?: Record<string, unknown>
) {
  return apiCall<T>(endpoint, { method: 'PATCH', body });
}

/**
 * DELETE request helper
 */
export function apiDelete<T = unknown>(endpoint: string) {
  return apiCall<T>(endpoint, { method: 'DELETE' });
}

/**
 * Build query string from object
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const filtered = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return filtered ? `?${filtered}` : '';
}

/**
 * Example usage:
 * 
 * // Get media with filters
 * const { data, error, pagination } = await apiGet<Media[]>(
 *   `/api/media${buildQueryString({ type: 'SERMON', page: 1 })}`
 * );
 * 
 * // Create prayer request
 * const { data } = await apiPost<PrayerRequest>(
 *   '/api/prayer-requests',
 *   { title: 'Healing prayer', content: '...', isPublic: true }
 * );
 * 
 * // Update user profile
 * const { data } = await apiPut<User>(
 *   '/api/users/profile',
 *   { fullName: 'New Name', bio: 'New bio' }
 * );
 * 
 * // Vote on prayer
 * const { data } = await apiPost(
 *   '/api/prayer-requests/prayer-id/vote'
 * );
 * 
 * // Delete comment
 * const { error } = await apiDelete(
 *   '/api/comments/comment-id'
 * );
 */
