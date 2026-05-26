/**
 * app/api/community/prayers/[id]/route.ts
 * GET  — fetch single prayer request (increments view count)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prayer = await prisma.prayerRequest.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true, bio: true } },
        prayerVotes: { select: { id: true, userId: true } },
      },
    });

    if (!prayer) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!prayer.isPublished) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Increment view count (fire and forget)
    prisma.prayerRequest
      .update({
        where: { id: params.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    return NextResponse.json({
      prayer: {
        id: prayer.id,
        title: prayer.title,
        content: prayer.content,
        category: prayer.category,
        isAnswered: prayer.isAnswered,
        isAnonymous: prayer.isAnonymous,
        duration: prayer.duration,
        prayerCount: prayer.prayerCount,
        viewCount: prayer.viewCount + 1,
        createdAt: prayer.createdAt,
        updatedAt: prayer.updatedAt,
        author: prayer.isAnonymous ? 'Anonymous' : (prayer.user.fullName ?? 'Anonymous'),
        user: prayer.user,
      },
    });
  } catch (error) {
    console.error(`GET /api/community/prayers/[${params.id}] error:`, error);
    return NextResponse.json({ error: 'Failed to fetch prayer request' }, { status: 500 });
  }
}
