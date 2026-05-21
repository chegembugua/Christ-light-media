import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { uploadDevotionImage } from '@/lib/storage/upload';

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

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const status = req.nextUrl.searchParams.get('status') ?? 'all';
    const where =
      status === 'published'
        ? { isPublished: true }
        : status === 'draft'
          ? { isPublished: false }
          : undefined;

    const devotions = await prisma.devotion.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 20,
    });

    return NextResponse.json({ devotions });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const body = (await req.json()) as DevotionPayload;
    const validationError = validatePayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const imageUrl = body.imageUrl
      ? await uploadDevotionImage(body.imageUrl, body.date!, body.title!)
      : null;

    const devotion = await prisma.devotion.create({
      data: {
        title: body.title!.trim(),
        verse: body.verse!.trim(),
        verseText: body.verseText?.trim() || null,
        reflection: body.reflection!.trim(),
        date: dateOnly(body.date!),
        isPublished: Boolean(body.isPublished),
        publishedAt: body.isPublished ? new Date() : null,
        imageUrl,
      },
    });

    return NextResponse.json({ devotion }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
