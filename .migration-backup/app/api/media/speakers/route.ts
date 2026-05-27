import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');

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

    const speakers = (rows as Array<{ speaker: string | null }>)
      .map((row: { speaker: string | null }) => row.speaker)
      .filter((speaker: string | null): speaker is string => Boolean(speaker?.trim()));

    return NextResponse.json({ speakers });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch speakers';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
