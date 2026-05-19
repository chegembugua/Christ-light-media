/**
 * Client-side Supabase auth operations.
 */
import { supabase } from '@/lib/supabase/client';
import { mapAuthError } from '../lib/errors';
import type { AuthResult, LoginInput, RegisterInput } from '../types';

function getAppOrigin(): string {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export async function signInWithPassword(input: LoginInput): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  if (error) return { error: mapAuthError(error.message) };
  return {};
}

export async function signUp(input: RegisterInput): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { full_name: input.fullName } },
  });

  if (error) return { error: mapAuthError(error.message) };

  const needsEmailConfirmation = Boolean(data.user && !data.session);

  if (data.user) {
    await createPlatformProfile({
      id: data.user.id,
      email: input.email,
      fullName: input.fullName,
    });
  }

  return { needsEmailConfirmation };
}

export async function signInWithGoogle(redirectTo = '/'): Promise<void> {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getAppOrigin()}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  });
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function sendPasswordResetEmail(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAppOrigin()}/reset-password`,
  });
  if (error) return { error: mapAuthError(error.message) };
  return {};
}

export async function updatePassword(password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: mapAuthError(error.message) };
  return {};
}

async function createPlatformProfile(payload: {
  id: string;
  email: string;
  fullName: string;
}): Promise<void> {
  await fetch('/api/auth/create-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
