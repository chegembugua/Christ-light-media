/**
 * app/api/prayer-requests/[id]/route.ts
 * GET: fetch single prayer request with votes
 * PUT: update prayer request (owner only)
 * DELETE: delete prayer request (owner or admin)
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
    const request_data = await prisma.prayerRequest.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true, bio: true } },
        votes: { select: { userId: true } },
      },
    });

    if (!request_data) return errorResponse('Prayer request not found', 404);
    if (!request_data.isPublic) {
      const authResult = await getAuthenticatedUser();
      if (authResult.user?.id !== request_data.userId) {
        return errorResponse('Not found', 404);
      }
    }

    return successResponse({
      ...request_data,
      prayerCount: request_data.votes.length,
    });
  } catch (error) {
    console.error(`GET /api/prayer-requests/[${params.id}] error:`, error);
    return errorResponse('Failed to fetch prayer request', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const prayerRequest = await prisma.prayerRequest.findUnique({
      where: { id: params.id },
    });

    if (!prayerRequest) return errorResponse('Prayer request not found', 404);
    if (prayerRequest.userId !== authResult.user.id) {
      return errorResponse('Forbidden', 403);
    }

    const body = await request.json();
    const { title, content, category, isAnswered, isPublic } = body;

    const updated = await prisma.prayerRequest.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(category !== undefined && { category }),
        ...(isAnswered !== undefined && { isAnswered }),
        ...(isPublic !== undefined && { isPublic }),
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
        votes: { select: { id: true } },
      },
    });

    return successResponse(updated);
  } catch (error) {
    console.error(`PUT /api/prayer-requests/[${params.id}] error:`, error);
    return errorResponse('Failed to update prayer request', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const prayerRequest = await prisma.prayerRequest.findUnique({
      where: { id: params.id },
      include: { user: { select: { id: true } } },
    });

    if (!prayerRequest) return errorResponse('Prayer request not found', 404);

    // Check if owner or admin
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: { role: true },
    });

    const isOwner = prayerRequest.userId === authResult.user.id;
    const isAdmin = user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return errorResponse('Forbidden', 403);
    }

    await prisma.prayerRequest.delete({ where: { id: params.id } });
    return successResponse({ id: params.id, message: 'Prayer request deleted' });
  } catch (error) {
    console.error(`DELETE /api/prayer-requests/[${params.id}] error:`, error);
    return errorResponse('Failed to delete prayer request', 500);
  }
}
