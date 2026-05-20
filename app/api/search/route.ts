/**
 * app/api/search/route.ts
 * GET: search across media, news, devotions
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));

    if (!q || q.trim().length < 2) {
      return errorResponse('Search query must be at least 2 characters', 400);
    }

    const search = q.toLowerCase().trim();
    const results: any = {};

    // Search media
    if (!type || type === 'media') {
      results.media = await prisma.media.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { speaker: { contains: search, mode: 'insensitive' } },
          ],
        },
        take: limit,
        orderBy: { publishedAt: 'desc' },
      });
    }

    // Search news
    if (!type || type === 'news') {
      results.news = await prisma.news.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { excerpt: { contains: search, mode: 'insensitive' } },
          ],
        },
        take: limit,
        orderBy: { publishedAt: 'desc' },
      });
    }

    // Search devotions
    if (!type || type === 'devotion') {
      results.devotions = await prisma.devotion.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { reflection: { contains: search, mode: 'insensitive' } },
            { verse: { contains: search, mode: 'insensitive' } },
          ],
        },
        take: limit,
        orderBy: { date: 'desc' },
      });
    }

    return successResponse(results);
  } catch (error) {
    console.error('GET /api/search error:', error);
    return errorResponse('Failed to search', 500);
  }
}
