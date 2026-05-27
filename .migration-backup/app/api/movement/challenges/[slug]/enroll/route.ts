import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: { slug: string };
}

/** POST /api/movement/challenges/[slug]/enroll — enroll in a challenge */
export async function POST(_req: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const challenge = await prisma.challenge.findUnique({
      where: { slug: params.slug },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // Ensure user is a movement member first
    const member = await prisma.movementMember.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    const enrollment = await prisma.challengeEnrollment.upsert({
      where: { userId_challengeId: { userId: user.id, challengeId: challenge.id } },
      create: {
        userId: user.id,
        challengeId: challenge.id,
        movementMemberId: member.id,
        daysCompleted: [],
      },
      update: {},
    });

    return NextResponse.json({ enrollment });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
