/**
 * Server-side guard — ensures the request is from an authenticated ADMIN.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import type { User } from '@prisma/client';

type AdminSuccess = { user: { id: string; email: string }; profile: User };
type AdminFailure = { error: NextResponse };

export async function requireAdmin(): Promise<AdminSuccess | AdminFailure> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const profile = await prisma.user.findUnique({ where: { id: user.id } });

  if (!profile || profile.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { user: { id: user.id, email: user.email }, profile };
}
