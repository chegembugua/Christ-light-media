import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/** GET /api/profile — fetch current user profile (with relations) */
export async function GET() {
  try {
    const supabase = await (await import('@/lib/supabase/server')).createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionUser.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        bio: true,
        location: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
        movement: {
          select: {
            joinedAt: true,
            challengeDay: true,
            totalChallengesCompleted: true,
          },
        },
        prayerRequests: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        challengeEnrollments: {
          orderBy: { enrolledAt: 'desc' },
          include: {
            challenge: {
              select: {
                id: true,
                title: true,
                slug: true,
                duration: true,
                imageUrl: true,
              },
            },
          },
        },
        testimonies: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Attach derived stats (type-safe)
    const prayerReqList = user.prayerRequests;
    const answeredPrayers = prayerReqList.filter((p: { isAnswered: boolean }) => !p.isAnswered).length;
    const totalEnrolledDays = user.challengeEnrollments.reduce(
      (sum: number, e: { daysCompleted: number[] }) => sum + e.daysCompleted.length,
      0
    );
    const activeEnrollment = user.challengeEnrollments.find(
      (e: { isCompleted: boolean }) => !e.isCompleted
    );

    const userProfile = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      movement: user.movement,
      stats: {
        prayersShared: prayerReqList.length,
        prayersAnswered: answeredPrayers,
        challengeDays: totalEnrolledDays,
      },
      recentPrayers: prayerReqList.map((p: { id: string; title: string; isAnswered: boolean; prayerCount: number; createdAt: Date }) => ({
        id: p.id,
        title: p.title,
        isAnswered: p.isAnswered,
        prayerCount: p.prayerCount,
        createdAt: p.createdAt,
      })),
      activeEnrollment: activeEnrollment
        ? {
            ...activeEnrollment,
          }
        : null,
      recentTestimonies: user.testimonies,
      challengeEnrollments: user.challengeEnrollments,
    };

    return NextResponse.json({ user: userProfile });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** PATCH /api/profile — update user profile */
export async function PATCH(request: Request) {
  try {
    const supabase = await (await import('@/lib/supabase/server')).createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionUser.id;

    const body = (await request.json()) as {
      fullName?: string;
      bio?: string;
      location?: string;
      preferences?: Record<string, unknown>;
    };

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: body.fullName ?? undefined,
        bio: body.bio ?? undefined,
        location: body.location ?? undefined,
        preferences: body.preferences
          ? { ...existingUser.preferences, ...body.preferences }
          : undefined,
        isBioComplete: body.bio ? body.bio.trim().length > 0 : undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        bio: true,
        location: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
