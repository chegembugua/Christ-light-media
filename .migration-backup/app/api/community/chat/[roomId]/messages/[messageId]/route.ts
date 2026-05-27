/**
 * app/api/community/chat/[roomId]/messages/[messageId]/route.ts
 * DELETE — remove a message (owner or admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser, errorResponse } from '@/lib/api/helpers';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { roomId: string; messageId: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const message = await prisma.message.findUnique({
      where: { id: params.messageId },
      include: { user: { select: { role: true } } },
    });

    if (!message)
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    if (message.roomId !== params.roomId)
      return NextResponse.json({ error: 'Message does not belong to this room' }, { status: 400 });

    const isOwner = message.userId === authResult.user.id;
    const isAdmin = message.user?.role === 'ADMIN';

    if (!isOwner && !isAdmin)
      return NextResponse.json({ error: 'You can only delete your own messages' }, { status: 403 });

    await prisma.message.delete({ where: { id: params.messageId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      `DELETE /api/community/chat/[${params.roomId}]/messages/[${params.messageId}] error:`,
      error
    );
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
