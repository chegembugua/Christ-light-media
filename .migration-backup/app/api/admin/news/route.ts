import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { uploadNewsImage } from '@/lib/storage/upload';
import { generateSlug } from '@/lib/utils/slug';

type NewsPayload = {
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  featuredImage?: string;
  content?: string;
  author?: string | null;
  isPublished?: boolean;
};

const categories = new Set(['Theology', 'Ministry', 'Events', 'Global', 'Education', 'Community']);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validatePayload(body: NewsPayload, requireImage: boolean) {
  if (!body.title?.trim() || body.title.trim().length < 5 || body.title.trim().length > 100) {
    return 'Title must be between 5 and 100 characters.';
  }
  const slug = body.slug?.trim() || generateSlug(body.title);
  if (!slug || !slugPattern.test(slug)) return 'Slug is invalid.';
  if (!body.excerpt?.trim()) return 'Excerpt is required.';
  if (body.excerpt.trim().length > 160) return 'Excerpt must be 160 characters or less.';
  if (!body.category || !categories.has(body.category)) return 'Category is required.';
  if (requireImage && !body.featuredImage) return 'Featured image is required.';
  if (!body.content?.trim() || body.content.trim().length < 200) {
    return 'Content must be at least 200 characters.';
  }
  return null;
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

    const news = await prisma.news.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      take: 20,
    });

    return NextResponse.json({ news });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const body = (await req.json()) as NewsPayload;
    const validationError = validatePayload(body, true);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const slug = body.slug?.trim() || generateSlug(body.title!);
    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
    }

    const imageUrl = await uploadNewsImage(body.featuredImage!, slug);
    const article = await prisma.news.create({
      data: {
        title: body.title!.trim(),
        slug,
        excerpt: body.excerpt!.trim(),
        category: body.category!,
        content: body.content!.trim(),
        coverImage: imageUrl,
        author: body.author?.trim() || null,
        isPublished: Boolean(body.isPublished),
        publishedAt: body.isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
