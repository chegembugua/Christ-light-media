/**
 * Browser-side Supabase client.
 * Use in Client Components only (forms, hooks, interactivity).
 */
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Singleton browser Supabase client for auth, storage, and realtime.
 * Falls back to a safe no-op stub when environment variables are not set
 * (useful for local builds and CI where secrets may be absent).
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidHttpUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function createNoopClient(): SupabaseClient {
  const noop = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
    },
    from: () => ({ select: async () => ({ data: null, error: null }) }),
    storage: { from: () => ({ getPublicUrl: () => ({ data: null, error: null }) }) },
    functions: { invoke: async () => ({ data: null, error: null }) },
  } as unknown as SupabaseClient;

  return noop;
}

const hasValidConfig = isValidHttpUrl(supabaseUrl) && Boolean(supabaseAnonKey);

export const supabase: SupabaseClient = hasValidConfig
  ? createBrowserClient(supabaseUrl as string, supabaseAnonKey as string)
  : createNoopClient();
