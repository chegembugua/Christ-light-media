import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import prisma from '@/lib/prisma';
import { deleteFile } from '@/lib/supabase/storage';
import { uploadNewsImage } from '@/lib/storage/upload';
import { generateSlug } from '@/lib/utils/slug';

interface RouteParams {
  params: { slug: string };
}

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

function validatePayload(body: NewsPayload) {
  if (!body.title?.trim() || body.title.trim().length < 5 || body.title.trim().length > 100) {
    return 'Title must be between 5 and 100 characters.';
  }
  const slug = body.slug?.trim() || generateSlug(body.title);
  if (!slug || !slugPattern.test(slug)) return 'Slug is invalid.';
  if (!body.excerpt?.trim()) return 'Excerpt is required.';
  if (body.excerpt.trim().length > 160) return 'Excerpt must be 160 characters or less.';
  if (!body.category || !categories.has(body.category)) return 'Category is required.';
  if (!body.content?.trim() || body.content.trim().length < 200) {
    return 'Content must be at least 200 characters.';
  }
  return null;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const article = await prisma.news.findUnique({ where: { slug: params.slug } });
  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const existing = await prisma.news.findUnique({ where: { slug: params.slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = (await req.json()) as NewsPayload;
    const validationError = validatePayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const nextSlug = body.slug?.trim() || generateSlug(body.title!);
    if (nextSlug !== existing.slug) {
      const slugOwner = await prisma.news.findUnique({ where: { slug: nextSlug } });
      if (slugOwner) {
        return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
      }
    }

    let coverImage = existing.coverImage;
    if (body.featuredImage?.startsWith('data:')) {
      coverImage = await uploadNewsImage(body.featuredImage, nextSlug);
      await deleteFile('news', existing.coverImage);
    } else if (body.featuredImage) {
      coverImage = body.featuredImage;
    }

    const article = await prisma.news.update({
      where: { slug: params.slug },
      data: {
        title: body.title!.trim(),
        slug: nextSlug,
        excerpt: body.excerpt!.trim(),
        category: body.category!,
        content: body.content!.trim(),
        coverImage,
        author: body.author?.trim() || null,
        isPublished: Boolean(body.isPublished),
        publishedAt: body.isPublished ? existing.publishedAt ?? new Date() : null,
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const article = await prisma.news.findUnique({ where: { slug: params.slug } });
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await deleteFile('news', article.coverImage);
    await prisma.news.delete({ where: { slug: params.slug } });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
