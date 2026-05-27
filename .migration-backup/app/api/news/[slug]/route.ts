import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: { slug: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const article = await prisma.news.findUnique({ where: { slug: params.slug } });

    if (!article || !article.isPublished) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Increment view count
    await prisma.news.update({
      where: { slug: params.slug },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({ article });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
