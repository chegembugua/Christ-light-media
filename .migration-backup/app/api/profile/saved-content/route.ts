import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/** GET /api/profile/saved-content?type=devotions|sermons|music|articles */
export async function GET(request: Request) {
  try {
    const supabase = await (await import('@/lib/supabase/server')).createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionUser.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as
      | 'devotions'
      | 'sermons'
      | 'music'
      | 'articles'
      | null;
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));

    if (!type) {
      return NextResponse.json(
        { error: 'Query param "type" is required (devotions | sermons | music | articles)' },
        { status: 400 }
      );
    }

    let data: unknown[] = [];

    switch (type) {
      case 'devotions':
        data = (await prisma.savedDevotion.findMany({
          where: { userId },
          include: {
            devotion: {
              select: {
                id: true,
                title: true,
                date: true,
                verse: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { savedAt: 'desc' },
          take: limit,
        })) as unknown[];
        break;

      case 'sermons': {
        data = (await prisma.savedSermon.findMany({
          where: { userId },
          include: {
            media: {
              where: { type: 'SERMON' },
              select: {
                id: true,
                title: true,
                coverImage: true,
                speaker: true,
                duration: true,
              },
            },
          },
          orderBy: { savedAt: 'desc' },
          take: limit,
        })) as unknown[];
        break;
      }

      case 'music': {
        data = (await prisma.savedMusic.findMany({
          where: { userId },
          include: {
            media: {
              where: { type: 'MUSIC' },
              select: {
                id: true,
                title: true,
                coverImage: true,
                speaker: true,
                duration: true,
              },
            },
          },
          orderBy: { savedAt: 'desc' },
          take: limit,
        })) as unknown[];
        break;
      }

      case 'articles':
        data = (await prisma.savedArticle.findMany({
          where: { userId },
          include: {
            news: {
              select: {
                id: true,
                title: true,
                excerpt: true,
                coverImage: true,
                category: true,
              },
            },
          },
          orderBy: { savedAt: 'desc' },
          take: limit,
        })) as unknown[];
        break;
    }

    return NextResponse.json({ items: data, type });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/profile/saved-content  { contentType, contentId } */
export async function POST(request: Request) {
  try {
    const supabase = await (await import('@/lib/supabase/server')).createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionUser.id;
    const body = (await request.json()) as {
      contentType: 'devotions' | 'sermons' | 'music' | 'articles';
      contentId: string;
    };

    if (!body.contentType || !body.contentId) {
      return NextResponse.json(
        { error: 'contentType and contentId are required' },
        { status: 400 }
      );
    }

    switch (body.contentType) {
      case 'devotions':
        await prisma.savedDevotion.upsert({
          where: { userId_devotionId: { userId, devotionId: body.contentId } },
          create: { userId, devotionId: body.contentId },
          update: {},
        });
        break;

      case 'sermons':
        await prisma.savedSermon.upsert({
          where: { userId_mediaId: { userId, mediaId: body.contentId } },
          create: { userId, mediaId: body.contentId },
          update: {},
        });
        break;

      case 'music':
        await prisma.savedMusic.upsert({
          where: { userId_mediaId: { userId, mediaId: body.contentId } },
          create: { userId, mediaId: body.contentId },
          update: {},
        });
        break;

      case 'articles':
        await prisma.savedArticle.upsert({
          where: { userId_newsId: { userId, newsId: body.contentId } },
          create: { userId, newsId: body.contentId },
          update: {},
        });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE /api/profile/saved-content  { contentType, contentId } */
export async function DELETE(request: Request) {
  try {
    const supabase = await (await import('@/lib/supabase/server')).createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionUser.id;
    const body = (await request.json()) as {
      contentType: 'devotions' | 'sermons' | 'music' | 'articles';
      contentId: string;
    };

    if (!body.contentType || !body.contentId) {
      return NextResponse.json(
        { error: 'contentType and contentId are required' },
        { status: 400 }
      );
    }

    switch (body.contentType) {
      case 'devotions':
        await prisma.savedDevotion.deleteMany({
          where: { userId, devotionId: body.contentId },
        });
        break;

      case 'sermons':
        await prisma.savedSermon.deleteMany({
          where: { userId, mediaId: body.contentId },
        });
        break;

      case 'music':
        await prisma.savedMusic.deleteMany({
          where: { userId, mediaId: body.contentId },
        });
        break;

      case 'articles':
        await prisma.savedArticle.deleteMany({
          where: { userId, newsId: body.contentId },
        });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
