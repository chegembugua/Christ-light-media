/**
 * Ensures a Supabase auth user has a matching Prisma profile.
 * Uses service role when available (signup before session cookie is set).
 */
import { createClient } from '@supabase/supabase-js';
import { upsertProfile, type UpsertProfileInput } from './profile.server';

export async function ensureProfileForAuthUser(
  input: UpsertProfileInput,
  requesterId: string | null
): Promise<{ ok: boolean; error?: string }> {
  if (requesterId === input.id) {
    await upsertProfile(input);
    return { ok: true };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return { ok: false, error: 'Unauthorized' };
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await admin.auth.admin.getUserById(input.id);

  if (error || !data.user) {
    return { ok: false, error: 'User not found in auth' };
  }

  await upsertProfile({
    ...input,
    email: input.email || data.user.email || '',
  });

  return { ok: true };
}
