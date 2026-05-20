/**
 * app/api/news/[id]/route.ts
 * GET: fetch single news article by ID or slug
 * PUT: update news (admin only)
 * DELETE: delete news (admin only)
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to find by ID first, then by slug
    let news = await prisma.news.findUnique({
      where: { id: params.id },
    });

    if (!news) {
      news = await prisma.news.findUnique({
        where: { slug: params.id },
      });
    }

    if (!news) return errorResponse('News not found', 404);
    if (!news.isPublished) {
      const authResult = await getAuthenticatedUser();
      const user = authResult.user
        ? await prisma.user.findUnique({
            where: { id: authResult.user.id },
            select: { role: true },
          })
        : null;

      if (!user || user.role !== 'ADMIN') {
        return errorResponse('Not found', 404);
      }
    }

    return successResponse(news);
  } catch (error) {
    console.error(`GET /api/news/[${params.id}] error:`, error);
    return errorResponse('Failed to fetch news', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Forbidden', 403);
    }

    const news = await prisma.news.findUnique({
      where: { id: params.id },
    });

    if (!news) return errorResponse('News not found', 404);

    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      category,
      isPublished,
      publishedAt,
    } = body;

    // Check slug uniqueness if changed
    if (slug && slug !== news.slug) {
      const existing = await prisma.news.findUnique({ where: { slug } });
      if (existing) {
        return errorResponse('Slug must be unique', 400);
      }
    }

    const updated = await prisma.news.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverImage !== undefined && { coverImage }),
        ...(category !== undefined && { category }),
        ...(isPublished !== undefined && { isPublished }),
        ...(publishedAt !== undefined && { publishedAt }),
      },
    });

    return successResponse(updated);
  } catch (error) {
    console.error(`PUT /api/news/[${params.id}] error:`, error);
    return errorResponse('Failed to update news', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Forbidden', 403);
    }

    const news = await prisma.news.findUnique({
      where: { id: params.id },
    });

    if (!news) return errorResponse('News not found', 404);

    await prisma.news.delete({ where: { id: params.id } });
    return successResponse({ id: params.id, message: 'News deleted' });
  } catch (error) {
    console.error(`DELETE /api/news/[${params.id}] error:`, error);
    return errorResponse('Failed to delete news', 500);
  }
}
