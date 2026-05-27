import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/** GET /api/movement/challenges — fetch all active challenges */
export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { enrollments: true } },
      },
    });

    // Seed default challenges if none exist
    if (challenges.length === 0) {
      const seeds = [
        {
          slug: 'prayer-21',
          title: '21 Days of Prayer',
          description: 'Join thousands in 21 days of deepening your prayer life through structured daily intercession and worship.',
          duration: 21,
          category: 'Prayer',
          difficulty: 3,
          isActive: true,
        },
        {
          slug: 'scripture-40',
          title: '40 Days of Scripture',
          description: 'Read and meditate on Scripture daily, allowing the Word to transform your mind and renew your heart.',
          duration: 40,
          category: 'Scripture',
          difficulty: 2,
          isActive: true,
        },
        {
          slug: 'fasting',
          title: 'Fasting Challenge',
          description: 'A guided journey through biblical fasting — learning to deny the flesh and seek God with greater intensity.',
          duration: 7,
          category: 'Fasting',
          difficulty: 4,
          isActive: true,
        },
        {
          slug: 'witness',
          title: 'Witness Challenge',
          description: 'Step out in faith and share the gospel with at least one person each day for 14 days.',
          duration: 14,
          category: 'Witness',
          difficulty: 5,
          isActive: true,
        },
      ];

      const created = await Promise.all(
        seeds.map((s) =>
          prisma.challenge.upsert({
            where: { slug: s.slug },
            create: s,
            update: {},
            include: { _count: { select: { enrollments: true } } },
          })
        )
      );

      return NextResponse.json({ challenges: created });
    }

    return NextResponse.json({ challenges });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
