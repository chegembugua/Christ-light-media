/**
 * app/api/community/chat/rooms/route.ts
 * GET — list available chat rooms (public for authenticated users to browse)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/api/helpers';

const HARDCODED_ROOMS = [
  { name: 'General', description: 'Open fellowship — all are welcome here.' },
  { name: 'Prayer Support', description: 'Lift your requests and pray with those in need.' },
  { name: 'Worship & Praise', description: 'Celebrate God! Share testimonies, songs, and worship moments.' },
  { name: 'Testimony Sharing', description: 'Share how God is moving in your life.' },
];

export async function GET(request: NextRequest) {
  try {
    // Require auth to access rooms list
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rooms = await prisma.chatRoom.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { id: true, content: true, createdAt: true, isDeleted: true },
        },
      },
    });

    const formatted = rooms.map((room: typeof rooms[number]) => {
      const last = room.messages[0] ?? null;
      return {
        id: room.id,
        name: room.name,
        description: room.description,
        lastMessage: last && !last.isDeleted ? last.content : null,
        lastMessageTime: last?.createdAt?.toISOString() ?? null,
        unreadCount: 0, // filled in by client-side tracking
      };
    });

    return NextResponse.json({ rooms: formatted });
  } catch (error) {
    console.error('GET /api/community/chat/rooms error:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, description } = body;

    if (!name?.trim())
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });

    const room = await prisma.chatRoom.create({
      data: {
        name: name.trim(),
        description: description?.trim() ?? null,
        isActive: true,
        messages: {
          create: {
            content: `${name.trim()} created`,
            userId: authResult.user.id,
          },
        },
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({
      room: {
        id: room.id,
        name: room.name,
        description: room.description,
        lastMessage: room.messages[0]?.content ?? null,
        lastMessageTime: room.messages[0]?.createdAt?.toISOString() ?? null,
        unreadCount: 0,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/community/chat/rooms error:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
