import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

/** POST /api/movement/join — join the In for Christ movement (requires auth) */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as {
      enrollInChallenges?: string[];
      heardFrom?: string;
    };

    // Check if already a member
    const existing = await prisma.movementMember.findUnique({
      where: { userId: user.id },
    });

    if (existing) {
      return NextResponse.json({ member: existing, alreadyMember: true });
    }

    // Create movement member
    const member = await prisma.movementMember.create({
      data: {
        userId: user.id,
        joinedAt: new Date(),
      },
    });

    // Enroll in selected challenges
    if (body.enrollInChallenges && body.enrollInChallenges.length > 0) {
      const challenges = await prisma.challenge.findMany({
        where: { slug: { in: body.enrollInChallenges }, isActive: true },
      });

      for (const challenge of challenges) {
        await prisma.challengeEnrollment.upsert({
          where: { userId_challengeId: { userId: user.id, challengeId: challenge.id } },
          create: {
            userId: user.id,
            challengeId: challenge.id,
            movementMemberId: member.id,
            daysCompleted: [],
          },
          update: {},
        });
      }
    }

    return NextResponse.json({ member });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
