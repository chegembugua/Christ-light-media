/**
 * authFetch — drop-in replacement for fetch() that attaches the current
 * Supabase session token as an Authorization: Bearer header.
 *
 * Falls back to a plain fetch (no auth header) when Supabase is not
 * configured or no session is active — so unauthenticated endpoints
 * continue to work unchanged.
 */

import { supabase } from '@/lib/supabase/client';

async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getAccessToken();
  const headers = new Headers(init.headers ?? {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Preserve Content-Type if caller set it; default to JSON for body requests
  if (!headers.has('Content-Type') && (init.method === 'POST' || init.method === 'PATCH' || init.method === 'PUT')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(input, { ...init, headers });
}
