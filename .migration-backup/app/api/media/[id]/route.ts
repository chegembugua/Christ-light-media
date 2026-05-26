/**
 * app/api/media/[id]/route.ts
 * GET: fetch single media
 * PUT: update media (admin only)
 * DELETE: delete media (admin only)
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
    const media = await prisma.media.findUnique({
      where: { id: params.id },
      include: {
        podcastShow: true,
        comments: {
          include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!media) return errorResponse('Media not found', 404);
    return successResponse(media);
  } catch (error) {
    console.error(`GET /api/media/[${params.id}] error:`, error);
    return errorResponse('Failed to fetch media', 500);
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

    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) return errorResponse('Media not found', 404);

    const body = await request.json();
    const {
      title,
      description,
      coverImage,
      audioUrl,
      videoUrl,
      category,
      speaker,
      duration,
      isPublished,
      publishedAt,
    } = body;

    const updated = await prisma.media.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(coverImage !== undefined && { coverImage }),
        ...(audioUrl !== undefined && { audioUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(category !== undefined && { category }),
        ...(speaker !== undefined && { speaker }),
        ...(duration !== undefined && { duration }),
        ...(isPublished !== undefined && { isPublished }),
        ...(publishedAt !== undefined && { publishedAt }),
      },
    });

    return successResponse(updated);
  } catch (error) {
    console.error(`PUT /api/media/[${params.id}] error:`, error);
    return errorResponse('Failed to update media', 500);
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

    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) return errorResponse('Media not found', 404);

    await prisma.media.delete({ where: { id: params.id } });
    return successResponse({ id: params.id, message: 'Media deleted' });
  } catch (error) {
    console.error(`DELETE /api/media/[${params.id}] error:`, error);
    return errorResponse('Failed to delete media', 500);
  }
}
