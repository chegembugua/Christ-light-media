import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/** GET /api/movement/testimonies/[id] — fetch single testimony + increment view count */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const testimony = await prisma.testimony.findUnique({
      where: { id: params.id, isPublished: true },
      include: {
        user: { select: { fullName: true, avatarUrl: true } },
      },
    });

    if (!testimony) {
      return NextResponse.json({ error: 'Testimony not found' }, { status: 404 });
    }

    // Increment view count (fire-and-forget)
    prisma.testimony.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    // Fetch related testimonies from same category
    const related = await prisma.testimony.findMany({
      where: {
        isPublished: true,
        category: testimony.category,
        id: { not: testimony.id },
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: {
        user: { select: { fullName: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ testimony, related });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
