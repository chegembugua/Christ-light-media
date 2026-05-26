/**
 * Client-side profile API calls.
 */
import type { UserProfile } from '../types';

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`/api/auth/profile?id=${encodeURIComponent(userId)}`);
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
    const res = await fetch('/api/auth/create-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
