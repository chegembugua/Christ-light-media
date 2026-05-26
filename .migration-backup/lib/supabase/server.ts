/**
 * Server-side Supabase client.
 * Use in Server Components, Route Handlers, and Server Actions.
 * Reads session cookies via Next.js headers().
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let hasValidSupabaseUrl = false;
  if (supabaseUrl) {
    try {
      const parsedUrl = new URL(supabaseUrl);
      hasValidSupabaseUrl = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      hasValidSupabaseUrl = false;
    }
  }

  if (!hasValidSupabaseUrl || !supabaseAnonKey) {
    // Return a safe no-op client during builds or when env vars are absent.
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

  return createServerClient(supabaseUrl as string, supabaseAnonKey as string, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Called from a Server Component — middleware handles session refresh.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // Called from a Server Component — middleware handles session refresh.
        }
      },
    },
  });
}
