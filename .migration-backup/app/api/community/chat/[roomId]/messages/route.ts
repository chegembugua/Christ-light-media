/**
 * app/api/community/chat/[roomId]/messages/route.ts
 * GET  — fetch messages from a room (authenticated users only)
 * POST — send a new message (authenticated users only)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser, errorResponse } from '@/lib/api/helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const room = await prisma.chatRoom.findUnique({
      where: { id: params.roomId },
    });
    if (!room)
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(
      Math.max(Number(searchParams.get('limit')) || 50, 1),
      200
    );
    const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { roomId: params.roomId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          user: { select: { id: true, fullName: true } },
        },
      }),
      prisma.message.count({
        where: { roomId: params.roomId, isDeleted: false },
      }),
    ]);

    // Reverse so oldest → newest
    const ordered = messages.reverse();

    return NextResponse.json({
      messages: ordered.map((m: any) => ({
        id: m.id,
        content: m.content,
        userId: m.userId,
        roomId: m.roomId,
        isDeleted: m.isDeleted,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
        user: m.user,
      })),
      total,
    });
  } catch (error) {
    console.error(
      `GET /api/community/chat/[${params.roomId}]/messages error:`,
      error
    );
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const room = await prisma.chatRoom.findUnique({
      where: { id: params.roomId },
    });
    if (!room)
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    const body = await request.json();
    const { content } = body;

    if (!content?.trim())
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    if (content.trim().length > 500)
      return NextResponse.json({ error: 'Message must be 500 characters or less' }, { status: 400 });

    const message = await prisma.message.create({
      data: { content: content.trim(), roomId: params.roomId, userId: authResult.user.id },
      include: {
        user: { select: { id: true, fullName: true } },
      },
    });

    return NextResponse.json(
      {
        message: {
          id: message.id,
          content: message.content,
          userId: message.userId,
          roomId: message.roomId,
          isDeleted: message.isDeleted,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString(),
          user: message.user,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      `POST /api/community/chat/[${params.roomId}]/messages error:`,
      error
    );
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
