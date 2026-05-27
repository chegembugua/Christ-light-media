/**
 * app/api/notifications/[id]/route.ts
 * PATCH: mark notification as read
 * DELETE: delete notification
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    });

    if (!notification) return errorResponse('Notification not found', 404);
    if (notification.userId !== authResult.user.id) {
      return errorResponse('Forbidden', 403);
    }

    const body = await request.json();
    const { isRead } = body;

    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { isRead: isRead !== false },
    });

    return successResponse(updated);
  } catch (error) {
    console.error(`PATCH /api/notifications/[${params.id}] error:`, error);
    return errorResponse('Failed to update notification', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    });

    if (!notification) return errorResponse('Notification not found', 404);
    if (notification.userId !== authResult.user.id) {
      return errorResponse('Forbidden', 403);
    }

    await prisma.notification.delete({ where: { id: params.id } });
    return successResponse({ id: params.id, message: 'Notification deleted' });
  } catch (error) {
    console.error(`DELETE /api/notifications/[${params.id}] error:`, error);
    return errorResponse('Failed to delete notification', 500);
  }
}
