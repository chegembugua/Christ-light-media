import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const limitParam = req.nextUrl.searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(Number(limitParam), 1), 10) : 3;

    // 1. Fetch current article
    const article = await prisma.news.findUnique({
      where: { slug },
      select: { id: true, category: true }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // 2. Find other articles in same category
    let relatedArticles = await prisma.news.findMany({
      where: {
        category: article.category,
        slug: { not: slug },
        isPublished: true
      },
      orderBy: { publishedAt: 'desc' },
      take: limit
    });

    // 3. If fewer than limit found, add most recent articles from other categories
    if (relatedArticles.length < limit) {
      const additionalNeeded = limit - relatedArticles.length;
      const additionalArticles = await prisma.news.findMany({
        where: {
          category: { not: article.category },
          isPublished: true
        },
        orderBy: { publishedAt: 'desc' },
        take: additionalNeeded
      });
      relatedArticles = [...relatedArticles, ...additionalArticles];
    }

    return NextResponse.json({ articles: relatedArticles });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}