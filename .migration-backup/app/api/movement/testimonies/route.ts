import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

/** GET /api/movement/testimonies — fetch published testimonies */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(Number(limitParam) || 12, 1), 50);

    const testimonies = await prisma.testimony.findMany({
      where: {
        isPublished: true,
        ...(category && category !== 'all' ? { category } : {}),
        ...(featured === 'true' ? { isFeatured: true } : {}),
      },
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: limit,
      include: {
        user: { select: { fullName: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ testimonies });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/movement/testimonies — submit a new testimony (requires auth) */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as {
      title: string;
      category: string;
      story: string;
      authorTitle?: string;
      location?: string;
      isAnonymous?: boolean;
      photoUrl?: string;
    };

    const { title, category, story, authorTitle, location, isAnonymous, photoUrl } = body;

    if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!category) return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    if (!story?.trim() || story.trim().length < 200) {
      return NextResponse.json({ error: 'Story must be at least 200 characters' }, { status: 400 });
    }

    const testimony = await prisma.testimony.create({
      data: {
        title: title.trim(),
        category,
        content: story.trim(),
        authorTitle: authorTitle?.trim() || null,
        location: location?.trim() || null,
        isAnonymous: isAnonymous ?? false,
        photoUrl: photoUrl ?? null,
        userId: user.id,
        isPublished: false, // requires moderation
      },
    });

    return NextResponse.json({ testimony }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
