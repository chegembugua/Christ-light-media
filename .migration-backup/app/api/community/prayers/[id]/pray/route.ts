/**
 * app/api/community/prayers/[id]/pray/route.ts
 * POST   — add or toggle "I Prayed" vote (authenticated users)
 * DELETE — remove "I Prayed" vote (authenticated users)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser, errorResponse } from '@/lib/api/helpers';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const prayer = await prisma.prayerRequest.findUnique({
      where: { id: params.id },
    });
    if (!prayer)
      return NextResponse.json({ error: 'Prayer request not found' }, { status: 404 });

    const existing = await prisma.prayerVote.findUnique({
      where: {
        userId_prayerRequestId: {
          userId: authResult.user.id,
          prayerRequestId: params.id,
        },
      },
    });

    if (existing) {
      // Toggle off — remove the vote
      await prisma.prayerVote.delete({
        where: {
          userId_prayerRequestId: {
            userId: authResult.user.id,
            prayerRequestId: params.id,
          },
        },
      });
      await prisma.prayerRequest.update({
        where: { id: params.id },
        data: { prayerCount: { decrement: 1 } },
      });

      const updated = await prisma.prayerRequest.findUnique({
        where: { id: params.id },
        select: { prayerCount: true },
      });

      return NextResponse.json({
        voted: false,
        totalVotes: updated?.prayerCount ?? 0,
      });
    }

    // Toggle on — create the vote
    await prisma.prayerVote.create({
      data: {
        userId: authResult.user.id,
        prayerRequestId: params.id,
      },
    });
    await prisma.prayerRequest.update({
      where: { id: params.id },
      data: { prayerCount: { increment: 1 } },
    });

    const updated = await prisma.prayerRequest.findUnique({
      where: { id: params.id },
      select: { prayerCount: true },
    });

    return NextResponse.json(
      {
        voted: true,
        totalVotes: updated?.prayerCount ?? 1,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`POST /api/community/prayers/[${params.id}]/pray error:`, error);
    return NextResponse.json(
      { error: 'Failed to update prayer vote' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.prayerVote.findUnique({
      where: {
        userId_prayerRequestId: {
          userId: authResult.user.id,
          prayerRequestId: params.id,
        },
      },
    });

    if (!existing)
      return NextResponse.json({ error: 'Vote not found' }, { status: 404 });

    await prisma.prayerVote.delete({
      where: {
        userId_prayerRequestId: {
          userId: authResult.user.id,
          prayerRequestId: params.id,
        },
      },
    });
    await prisma.prayerRequest.update({
      where: { id: params.id },
      data: { prayerCount: { decrement: 1 } },
    });

    const updated = await prisma.prayerRequest.findUnique({
      where: { id: params.id },
      select: { prayerCount: true },
    });

    return NextResponse.json({
      voted: false,
      totalVotes: updated?.prayerCount ?? 0,
    });
  } catch (error) {
    console.error(`DELETE /api/community/prayers/[${params.id}]/pray error:`, error);
    return NextResponse.json(
      { error: 'Failed to remove prayer vote' },
      { status: 500 }
    );
  }
}
