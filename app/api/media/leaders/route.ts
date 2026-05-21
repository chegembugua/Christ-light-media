import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') ?? 'WORSHIP';

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

    const leaders = (rows as Array<{ speaker: string | null }>)
      .map((row) => row.speaker)
      .filter((leader: string | null): leader is string => Boolean(leader?.trim()));

    return NextResponse.json({ leaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch leaders';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
