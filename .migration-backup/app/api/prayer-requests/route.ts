/**
 * app/api/prayer-requests/route.ts
 * GET: list public prayer requests with pagination
 * POST: create new prayer request (authenticated users)
 */

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  parsePagination,
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize, skip } = parsePagination(request);
    const category = searchParams.get('category');
    const answered = searchParams.get('answered');

    const where: any = { isPublic: true };
    if (category) where.category = category;
    if (answered === 'true') where.isAnswered = true;
    if (answered === 'false') where.isAnswered = false;

    const [requests, total] = await Promise.all([
      prisma.prayerRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        include: {
          user: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
          votes: { select: { id: true } },
        },
      }),
      prisma.prayerRequest.count({ where }),
    ]);

    return successResponse(requests, 200, { page, pageSize, total });
  } catch (error) {
    console.error('GET /api/prayer-requests error:', error);
    return errorResponse('Failed to fetch prayer requests', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user) return errorResponse('Unauthorized', 401);

    const body = await request.json();
    const { title, content, category, isPublic } = body;

    if (!title || !content) {
      return errorResponse('Title and content are required', 400);
    }

    const prayerRequest = await prisma.prayerRequest.create({
      data: {
        title,
        content,
        category: category || null,
        isPublic: isPublic !== false,
        userId: authResult.user.id,
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    return successResponse(prayerRequest, 201);
  } catch (error) {
    console.error('POST /api/prayer-requests error:', error);
    return errorResponse('Failed to create prayer request', 500);
  }
}
