import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const dateParam = searchParams.get('date');

    const limit = Math.min(Math.max(Number(limitParam) || 12, 1), 100);
    const offset = Math.max(Number(offsetParam) || 0, 0);

    if (dateParam) {
      const date = new Date(dateParam);
      const devotion = await prisma.devotion.findUnique({
        where: { date, isPublished: true },
      });

      if (!devotion) {
        return NextResponse.json({ devotion: null }, { status: 404 });
      }

      return NextResponse.json({ devotion });
    }

    const devotions = await prisma.devotion.findMany({
      where: { isPublished: true },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ devotions });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}