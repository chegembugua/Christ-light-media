import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const now = new Date();

    const event = await prisma.media.findFirst({
      where: {
        type: 'WORSHIP',
        isPublished: true,
        publishedAt: { not: null },
      },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        publishedAt: true,
        duration: true,
        coverImage: true,
        audioUrl: true,
        speaker: true,
      },
    });

    if (!event) {
      return NextResponse.json({ event: null });
    }

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description ?? '',
        scheduledAt: event.publishedAt!.toISOString(),
        durationMinutes: parseInt(event.duration ?? '90', 10) || 90,
        coverImage: event.coverImage,
        audioUrl: event.audioUrl,
        leaders: event.speaker ? [event.speaker] : [],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch upcoming worship';
    return NextResponse.json({ event: null, error: message }, { status: 500 });
  }
}
