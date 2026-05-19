import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { deleteMedia, updateMedia } from '@/modules/media/server/media.server';
import type { UpdateMediaInput } from '@/modules/media/types';

interface RouteParams {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const body = (await req.json()) as UpdateMediaInput;
    const media = await updateMedia(params.id, body);
    return NextResponse.json(media);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    await deleteMedia(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
