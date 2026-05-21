import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') ?? 'MUSIC';

    const rows = await prisma.media.findMany({
      where: {
        ...(type ? { type } : {}),
        isPublished: true,
        speaker: { not: '' },
      },
      select: { speaker: true },
      distinct: ['speaker'],
      orderBy: { speaker: 'asc' },
    });

    const artists = (rows as Array<{ speaker: string | null }>)
      .map((row) => row.speaker)
      .filter((artist: string | null): artist is string => Boolean(artist?.trim()));

    return NextResponse.json({ artists });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch artists';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
