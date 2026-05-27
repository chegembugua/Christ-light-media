/**
 * app/api/comments/[id]/route.ts
 * GET: fetch single comment
 * DELETE: delete comment (owner only)
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
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    if (!comment) return errorResponse('Comment not found', 404);
    return successResponse(comment);
  } catch (error) {
    console.error(`GET /api/comments/[${params.id}] error:`, error);
    return errorResponse('Failed to fetch comment', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
    });

    if (!comment) return errorResponse('Comment not found', 404);

    // Check if owner or admin
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: { role: true },
    });

    const isOwner = comment.userId === authResult.user.id;
    const isAdmin = user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return errorResponse('Forbidden', 403);
    }

    await prisma.comment.delete({ where: { id: params.id } });
    return successResponse({ id: params.id, message: 'Comment deleted' });
  } catch (error) {
    console.error(`DELETE /api/comments/[${params.id}] error:`, error);
    return errorResponse('Failed to delete comment', 500);
  }
}
