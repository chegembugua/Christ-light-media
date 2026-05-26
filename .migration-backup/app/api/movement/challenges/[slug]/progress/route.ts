import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: { slug: string };
}

/** GET /api/movement/challenges/[slug]/progress — get user's enrollment & progress */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ enrollment: null });
    }

    const challenge = await prisma.challenge.findUnique({
      where: { slug: params.slug },
    });

    if (!challenge) {
      return NextResponse.json({ enrollment: null });
    }

    const enrollment = await prisma.challengeEnrollment.findUnique({
      where: { userId_challengeId: { userId: user.id, challengeId: challenge.id } },
    });

    return NextResponse.json({ enrollment: enrollment ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/movement/challenges/[slug]/progress — mark a day as complete */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as { day: number };
    const { day } = body;

    if (!day || typeof day !== 'number') {
      return NextResponse.json({ error: 'Day number required' }, { status: 400 });
    }

    const challenge = await prisma.challenge.findUnique({
      where: { slug: params.slug },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    const existing = await prisma.challengeEnrollment.findUnique({
      where: { userId_challengeId: { userId: user.id, challengeId: challenge.id } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not enrolled in this challenge' }, { status: 400 });
    }

    // Add day to completed list (avoid duplicates)
    const daysCompleted = Array.from(new Set([...existing.daysCompleted, day])).sort((a, b) => a - b);
    const isCompleted = daysCompleted.length >= challenge.duration;

    const enrollment = await prisma.challengeEnrollment.update({
      where: { userId_challengeId: { userId: user.id, challengeId: challenge.id } },
      data: {
        daysCompleted,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Update member's total completed count if challenge just finished
    if (isCompleted && !existing.isCompleted) {
      await prisma.movementMember.updateMany({
        where: { userId: user.id },
        data: { totalChallengesCompleted: { increment: 1 } },
      });
    }

    return NextResponse.json({ enrollment });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
