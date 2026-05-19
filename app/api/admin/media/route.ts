import { NextRequest, NextResponse } from 'next/server';
import type { MediaType } from '@prisma/client';
import { requireAdmin } from '@/lib/auth/require-admin';
import { uploadToStorage } from '@/lib/storage/upload';
import { createMedia, listAllMedia } from '@/modules/media/server/media.server';

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const items = await listAllMedia();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const formData = await req.formData();
    const title = String(formData.get('title') ?? '').trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const cover = formData.get('cover');
    if (!(cover instanceof File) || cover.size === 0) {
      return NextResponse.json({ error: 'Cover image is required' }, { status: 400 });
    }

    const coverImage = await uploadToStorage('covers', cover);

    let audioUrl: string | undefined;
    const audio = formData.get('audio');
    if (audio instanceof File && audio.size > 0) {
      audioUrl = await uploadToStorage('audio', audio);
    }

    let videoUrl: string | undefined;
    const video = formData.get('video');
    if (video instanceof File && video.size > 0) {
      videoUrl = await uploadToStorage('video', video);
    }

    const type = (String(formData.get('type') ?? 'SERMON') as MediaType) || 'SERMON';
    const isPublished = formData.get('isPublished') === 'true';

    const media = await createMedia({
      title,
      description: String(formData.get('description') ?? '') || undefined,
      type,
      category: String(formData.get('category') ?? '') || undefined,
      speaker: String(formData.get('speaker') ?? '') || undefined,
      duration: String(formData.get('duration') ?? '') || undefined,
      coverImage,
      audioUrl,
      videoUrl,
      isPublished,
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
