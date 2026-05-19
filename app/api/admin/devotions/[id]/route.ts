import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import {
  deleteDevotion,
  getDevotionById,
  updateDevotion,
} from '@/modules/devotions/server/devotion.server';
import type { UpdateDevotionInput } from '@/modules/devotions/types';

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const devotion = await getDevotionById(params.id);
  if (!devotion) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(devotion);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const body = (await req.json()) as UpdateDevotionInput;
    const devotion = await updateDevotion(params.id, body);
    return NextResponse.json(devotion);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    await deleteDevotion(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
