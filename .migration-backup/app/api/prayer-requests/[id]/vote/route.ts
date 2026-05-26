/**
 * app/api/prayer-requests/[id]/vote/route.ts
 * POST: add prayer vote (authenticated users)
 * DELETE: remove prayer vote (user who voted)
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    // Check prayer request exists
    const prayerRequest = await prisma.prayerRequest.findUnique({
      where: { id: params.id },
    });

    if (!prayerRequest) return errorResponse('Prayer request not found', 404);

    // Check if user already voted
    const existingVote = await prisma.prayerVote.findUnique({
      where: {
        userId_prayerRequestId: {
          userId: authResult.user.id,
          prayerRequestId: params.id,
        },
      },
    });

    if (existingVote) {
      return errorResponse('You have already voted for this prayer request', 400);
    }

    // Create vote
    const vote = await prisma.prayerVote.create({
      data: {
        userId: authResult.user.id,
        prayerRequestId: params.id,
      },
    });

    // Increment prayerCount
    await prisma.prayerRequest.update({
      where: { id: params.id },
      data: { prayerCount: { increment: 1 } },
    });

    return successResponse(
      { vote, message: 'Prayer vote added' },
      201
    );
  } catch (error) {
    console.error(`POST /api/prayer-requests/[${params.id}]/vote error:`, error);
    return errorResponse('Failed to add prayer vote', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    // Check if user has voted
    const vote = await prisma.prayerVote.findUnique({
      where: {
        userId_prayerRequestId: {
          userId: authResult.user.id,
          prayerRequestId: params.id,
        },
      },
    });

    if (!vote) {
      return errorResponse('You have not voted for this prayer request', 404);
    }

    // Delete vote
    await prisma.prayerVote.delete({
      where: {
        userId_prayerRequestId: {
          userId: authResult.user.id,
          prayerRequestId: params.id,
        },
      },
    });

    // Decrement prayerCount
    await prisma.prayerRequest.update({
      where: { id: params.id },
      data: { prayerCount: { decrement: 1 } },
    });

    return successResponse({ message: 'Prayer vote removed' });
  } catch (error) {
    console.error(
      `DELETE /api/prayer-requests/[${params.id}]/vote error:`,
      error
    );
    return errorResponse('Failed to remove prayer vote', 500);
  }
}
