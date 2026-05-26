/**
 * app/api/comments/route.ts
 * GET: list comments for a media item
 * POST: create comment (authenticated users)
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
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return errorResponse('mediaId query parameter is required', 400);
    }

    const { page, pageSize, skip } = parsePagination(request);

    // Check media exists
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) return errorResponse('Media not found', 404);

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { mediaId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        include: {
          user: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
        },
      }),
      prisma.comment.count({ where: { mediaId } }),
    ]);

    return successResponse(comments, 200, { page, pageSize, total });
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return errorResponse('Failed to fetch comments', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const { content, mediaId } = body;

    if (!content || !mediaId) {
      return errorResponse('Content and mediaId are required', 400);
    }

    // Check media exists
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) return errorResponse('Media not found', 404);

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: authResult.user.id,
        mediaId,
      },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    return successResponse(comment, 201);
  } catch (error) {
    console.error('POST /api/comments error:', error);
    return errorResponse('Failed to create comment', 500);
  }
}
