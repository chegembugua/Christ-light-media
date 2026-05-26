import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

/**
 * PATCH /api/notifications/[id]/read
 * Marks a specific notification as read after verifying ownership.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    }

    // Retrieve notification to verify existence and check ownership
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    if (notification.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update notification
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ notification: updatedNotification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
