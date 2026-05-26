import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/notifications
 * Fetches the 5 most recent notifications for the authenticated user, ordered by creation date descending.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications
 * Marks all notifications as read for the authenticated user.
 */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updated = await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true, count: updated.count });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
