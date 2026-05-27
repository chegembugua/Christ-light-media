/**
 * app/api/community/prayers/route.ts
 * GET  — list public prayer requests with filters
 * POST — create new prayer request (authenticated users only)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  parsePagination,
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

const CATEGORIES = ['Health', 'Family', 'Ministry', 'Finances', 'Personal', 'Nation', 'Other'];

function buildWhere(params: {
  status: string;
  category: string;
  search: string;
}) {
  const where: Record<string, unknown> = { isPublished: true };

  if (params.status === 'answered') {
    where.isAnswered = true;
  } else if (params.status === 'open') {
    where.isAnswered = false;
  }
  // 'all' → no status filter

  if (params.category && params.category !== 'all') {
    where.category = params.category;
  }

  if (params.search) {
    (where as Record<string, unknown>).OR = [
      { title: { contains: params.search, mode: 'insensitive' as const } },
      { content: { contains: params.search, mode: 'insensitive' as const } },
    ];
  }

  return where;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize, skip } = parsePagination(request);
    const status = searchParams.get('status') ?? 'all';
    const category = searchParams.get('category') ?? 'all';
    const sort = searchParams.get('sort') ?? 'recent';
    const search = searchParams.get('search') ?? '';

    const where = buildWhere({ status, category, search });

    let orderBy: Record<string, string>;
    if (sort === 'trending' || sort === 'most-prayed') {
      orderBy = { prayerCount: 'desc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const [prayers, total] = await Promise.all([
      prisma.prayerRequest.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          user: { select: { id: true, fullName: true } },
          prayerVotes: { select: { id: true, userId: true } },
        },
      }),
      prisma.prayerRequest.count({ where }),
    ]);

    const mapped = prayers.map((p: typeof prayers[number]) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      category: p.category ?? 'Other',
      author: p.isAnonymous ? 'Anonymous' : (p.user.fullName ?? 'Anonymous'),
      prayerCount: p.prayerCount,
      isAnswered: p.isAnswered,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      isAnonymous: p.isAnonymous,
      duration: p.duration,
      viewCount: p.viewCount,
    }));

    return successResponse(
      { prayers: mapped, total, categoryOptions: CATEGORIES },
      200
    );
  } catch (error) {
    console.error('GET /api/community/prayers error:', error);
    return errorResponse('Failed to fetch prayer requests', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    if (!authResult.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, content, category, isAnonymous, duration } = body;

    if (!title?.trim())
      return errorResponse('Title is required', 400);
    if (!content?.trim())
      return errorResponse('Description is required', 400);

    const prayer = await prisma.prayerRequest.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category ? category.trim() : null,
        isAnonymous: !!isAnonymous,
        duration: duration ?? null,
        userId: authResult.user.id,
        isPublished: true,
        isAnswered: false,
      },
      include: {
        user: { select: { id: true, fullName: true } },
      },
    });

    return NextResponse.json(
      {
        prayer: {
          id: prayer.id,
          title: prayer.title,
          content: prayer.content,
          category: prayer.category,
          isAnonymous: prayer.isAnonymous,
          isAnswered: prayer.isAnswered,
          prayerCount: prayer.prayerCount,
          createdAt: prayer.createdAt,
          author: prayer.user.fullName ?? 'Anonymous',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/community/prayers error:', error);
    return errorResponse('Failed to create prayer request', 500);
  }
}
