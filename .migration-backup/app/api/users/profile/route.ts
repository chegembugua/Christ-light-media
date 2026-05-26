/**
 * app/api/users/profile/route.ts
 * GET: fetch authenticated user's profile
 * PUT: update authenticated user's profile
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) return errorResponse('User not found', 404);
    return successResponse(user);
  } catch (error) {
    console.error('GET /api/users/profile error:', error);
    return errorResponse('Failed to fetch profile', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const { fullName, bio, avatarUrl } = body;

    const user = await prisma.user.update({
      where: { id: authResult.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    return successResponse(user);
  } catch (error) {
    console.error('PUT /api/users/profile error:', error);
    return errorResponse('Failed to update profile', 500);
  }
}
