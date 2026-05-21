import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { deleteFile } from '@/lib/supabase/storage';
import { uploadDevotionImage } from '@/lib/storage/upload';

interface RouteParams {
  params: { id: string };
}

type DevotionPayload = {
  title?: string;
  verse?: string;
  verseText?: string | null;
  reflection?: string;
  date?: string;
  isPublished?: boolean;
  imageUrl?: string | null;
};

const versePattern = /^[A-Za-z0-9\s:]+$/;

function validatePayload(body: DevotionPayload) {
  if (!body.title?.trim() || body.title.trim().length < 5) {
    return 'Title must be at least 5 characters.';
  }
  if (!body.verse?.trim() || !versePattern.test(body.verse.trim())) {
    return 'Bible verse is invalid.';
  }
  if (!body.reflection?.trim() || body.reflection.trim().length < 100) {
    return 'Reflection must be at least 100 characters.';
  }
  if (!body.date || Number.isNaN(new Date(`${body.date}T00:00:00`).getTime())) {
    return 'A valid date is required.';
  }
  return null;
}

function dateOnly(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const devotion = await prisma.devotion.findUnique({ where: { id: params.id } });
  if (!devotion) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ devotion });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const existing = await prisma.devotion.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = (await req.json()) as DevotionPayload;
    const validationError = validatePayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    let imageUrl = body.imageUrl ?? null;
    if (imageUrl?.startsWith('data:')) {
      imageUrl = await uploadDevotionImage(imageUrl, body.date!, body.title!);
      if (existing.imageUrl) await deleteFile('devotions', existing.imageUrl);
    } else if (!imageUrl && existing.imageUrl) {
      await deleteFile('devotions', existing.imageUrl);
    }

    const devotion = await prisma.devotion.update({
      where: { id: params.id },
      data: {
        title: body.title!.trim(),
        verse: body.verse!.trim(),
        verseText: body.verseText?.trim() || null,
        reflection: body.reflection!.trim(),
        date: dateOnly(body.date!),
        isPublished: Boolean(body.isPublished),
        publishedAt: body.isPublished ? existing.publishedAt ?? new Date() : null,
        imageUrl,
      },
    });

    return NextResponse.json({ devotion });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const devotion = await prisma.devotion.findUnique({ where: { id: params.id } });
    if (!devotion) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (devotion.imageUrl) await deleteFile('devotions', devotion.imageUrl);
    await prisma.devotion.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
