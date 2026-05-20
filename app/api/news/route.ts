/**
 * app/api/news/route.ts
 * GET: list published news with pagination
 * POST: create news (admin only)
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  parsePagination,
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize, skip } = parsePagination(request);
    const category = searchParams.get('category');
    const published = searchParams.get('published') === 'true';

    const where: any = {};
    if (published) where.isPublished = true;
    if (category) where.category = category;

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.news.count({ where }),
    ]);

    return successResponse(news, 200, { page, pageSize, total });
  } catch (error) {
    console.error('GET /api/news error:', error);
    return errorResponse('Failed to fetch news', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Forbidden: Admin access required', 403);
    }

    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, category } = body;

    if (!title || !slug || !content) {
      return errorResponse('Title, slug, and content are required', 400);
    }

    // Check if slug is unique
    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) {
      return errorResponse('Slug must be unique', 400);
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        category: category || null,
        isPublished: false,
      },
    });

    return successResponse(news, 201);
  } catch (error) {
    console.error('POST /api/news error:', error);
    return errorResponse('Failed to create news', 500);
  }
}
