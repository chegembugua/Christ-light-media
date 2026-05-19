/**
 * Browser-side Supabase client.
 * Use in Client Components only (forms, hooks, interactivity).
 */
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/** Singleton browser Supabase client for auth, storage, and realtime. */
export const supabase: SupabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
