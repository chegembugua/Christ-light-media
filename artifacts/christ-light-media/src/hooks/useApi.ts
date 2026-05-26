/**
 * hooks/useApi.ts
 * React hook for API calls with loading, error, and data states
 */


import { useCallback, useState } from 'react';
import type { ApiResponse } from '@/lib/api/types';
import { apiCall, FetchOptions } from '@/lib/api/client';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiActions<T> {
  refetch: () => Promise<void>;
  reset: () => void;
  setData: (data: T) => void;
}

/**
 * Hook for making API calls with automatic state management
 * 
 * @example
 * const { data, loading, error, refetch } = useApi<User[]>(
 *   '/api/users?page=1',
 *   { method: 'GET' }
 * );
 */
export function useApi<T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
  autoFetch = true
): UseApiState<T> & UseApiActions<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await apiCall<T>(endpoint, options);

    if (result.error) {
      setError(result.error);
      setData(null);
    } else {
      setData((result.data as T) || null);
    }

    setLoading(false);
  }, [endpoint, options]);

  // Auto-fetch on mount if enabled
  const [hasFetched, setHasFetched] = useState(false);
  if (autoFetch && !hasFetched && options.method !== 'POST') {
    setHasFetched(true);
    execute();
  }

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: execute,
    reset,
    setData,
  };
}

/**
 * Hook for POST/PUT/PATCH mutations
 * Doesn't auto-fetch, requires explicit execution
 * 
 * @example
 * const { execute, loading, error, data } = useMutation<PrayerRequest>(
 *   '/api/prayer-requests',
 *   { method: 'POST' }
 * );
 * 
 * const handleSubmit = async () => {
 *   await execute({
 *     title: 'Prayer title',
 *     content: 'Prayer content'
 *   });
 * };
 */
export function useMutation<T = unknown>(
  endpoint: string,
  defaultOptions: FetchOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (body?: Record<string, unknown>) => {
      setLoading(true);
      setError(null);

      const result = await apiCall<T>(endpoint, {
        ...defaultOptions,
        body,
      });

      if (result.error) {
        setError(result.error);
        return false;
      }

      setData((result.data as T) || null);
      return true;
    },
    [endpoint, defaultOptions]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  };
}

/**
 * @example Basic data fetching:
 * 
 * function SermonsList() {
 *   const { data: sermons, loading, error } = useApi<Sermon[]>(
 *     '/api/media?type=SERMON'
 *   );
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       {sermons?.map(sermon => (
 *         <div key={sermon.id}>{sermon.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 */

/**
 * @example Mutation example:
 * 
 * function CreatePrayerRequest() {
 *   const { execute, loading, error } = useMutation<PrayerRequest>(
 *     '/api/prayer-requests',
 *     { method: 'POST' }
 *   );
 * 
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     const success = await execute({
 *       title: 'My prayer',
 *       content: 'Please pray for...',
 *       isPublic: true
 *     });
 *     if (success) toast.success('Prayer request created!');
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <p>{error}</p>}
 *       <button disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
 *     </form>
 *   );
 * }
 */
