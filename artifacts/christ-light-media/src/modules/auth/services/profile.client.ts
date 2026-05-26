/**
 * Client-side profile API calls.
 * All requests attach the Supabase Bearer token — backend verifies identity from JWT.
 */
import { supabase } from '@/lib/supabase/client';
import type { UserProfile } from '../types';

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const token = await getAccessToken();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`/api/auth/profile?id=${encodeURIComponent(userId)}`, { headers });
    if (!res.ok) return null;
    return (await res.json()) as UserProfile;
  } catch {
    return null;
  }
}

export async function syncPlatformProfile(payload: {
  id: string;
  email: string;
  fullName?: string | null;
}): Promise<boolean> {
  try {
    const token = await getAccessToken();
    if (!token) return false;
    const res = await fetch('/api/auth/create-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      // Identity (id + email) is derived server-side from JWT.
      // Only send fullName as supplemental data.
      body: JSON.stringify({ id: payload.id, fullName: payload.fullName }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
