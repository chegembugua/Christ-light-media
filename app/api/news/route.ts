import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper function to get start date for date range
function getDateRangeStart(range: string): Date | null {
  const now = new Date();
  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '365d':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') ?? 'all';
    const search = searchParams.get('search') ?? '';
    const dateRange = searchParams.get('dateRange') ?? 'all';
    const sort = searchParams.get('sort') ?? 'newest';
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(Number(limitParam) || 9, 1), 100);
    const offsetParam = searchParams.get('offset');
    const offset = Math.max(Number(offsetParam) || 0, 0);

    // Build where clause
    const whereConditions: any = {
      isPublished: true
    };

    // Category filter
    if (category !== 'all' && category !== 'featured') {
      whereConditions.category = category;
    }
    // Featured filter would need isFeature field in DB

    // Search filter
    if (search.trim()) {
      whereConditions.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Date range filter
    const dateStart = getDateRangeStart(dateRange);
    if (dateStart) {
      whereConditions.publishedAt = {
        gte: dateStart
      };
    }

    // Get total count for pagination
    const total = await prisma.news.count({ where: whereConditions });

    // Build orderBy clause
    let orderBy: any = { publishedAt: 'desc' };
    if (sort === 'popular' || sort === 'trending') {
      orderBy = { viewCount: 'desc' };
    }

    // Fetch news
    const news = await prisma.news.findMany({
      where: whereConditions,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        author: true,
        publishedAt: true,
        viewCount: true,
        createdAt: true
      }
    });

    // Get categories with counts for filter display
    const categories = await prisma.news.groupBy({
      by: ['category'],
      where: {
        isPublished: true
      },
      _count: {
        _all: true
      }
    }) as Array<{category: string, _count: {_all: number}}>;

    return NextResponse.json({ 
      news, 
      total,
      categories: categories.map((cat: {category: string, _count: {_all: number}}) => ({
        name: cat.category,
        count: cat._count._all
      }))
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}