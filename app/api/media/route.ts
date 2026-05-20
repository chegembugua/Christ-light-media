/**
 * app/api/media/route.ts
 * GET: list media with filters (type, category, published)
 * POST: create new media (admin only)
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  requireAdmin,
  parsePagination,
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize, skip } = parsePagination(request);
    const type = searchParams.get('type') as string | null;
    const category = searchParams.get('category');
    const published = searchParams.get('published') === 'true';

    // Build filter
    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (published) where.isPublished = true;

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
        include: {
          podcastShow: { select: { id: true, title: true } },
          comments: { select: { id: true } },
        },
      }),
      prisma.media.count({ where }),
    ]);

    return successResponse(media, 200, { page, pageSize, total });
  } catch (error) {
    console.error('GET /api/media error:', error);
    return errorResponse('Failed to fetch media', 500);
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
    const {
      title,
      description,
      coverImage,
      audioUrl,
      videoUrl,
      type,
      category,
      speaker,
      duration,
      podcastShowId,
    } = body;

    if (!title || !type) {
      return errorResponse('Title and type are required', 400);
    }

    const media = await prisma.media.create({
      data: {
        title,
        description: description || null,
        coverImage: coverImage || null,
        audioUrl: audioUrl || null,
        videoUrl: videoUrl || null,
        type,
        category: category || null,
        speaker: speaker || null,
        duration: duration || null,
        podcastShowId: podcastShowId || null,
        isPublished: false,
      },
    });

    return successResponse(media, 201);
  } catch (error) {
    console.error('POST /api/media error:', error);
    return errorResponse('Failed to create media', 500);
  }
}
