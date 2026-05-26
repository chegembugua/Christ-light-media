import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: { slug: string };
}

/** GET /api/movement/challenges/[slug] — fetch single challenge with daily prompts */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { slug: params.slug },
      include: {
        _count: { select: { enrollments: true } },
        dailyPrompts: { orderBy: { day: 'asc' } },
      },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // Auto-seed daily prompts if none exist
    if (challenge.dailyPrompts.length === 0) {
      const prompts = generateDefaultPrompts(challenge.slug, challenge.duration);
      await prisma.dailyPrompt.createMany({
        data: prompts.map((p) => ({ ...p, challengeId: challenge.id })),
        skipDuplicates: true,
      });

      const updated = await prisma.challenge.findUnique({
        where: { slug: params.slug },
        include: {
          _count: { select: { enrollments: true } },
          dailyPrompts: { orderBy: { day: 'asc' } },
        },
      });

      return NextResponse.json({
        challenge: updated,
        dailyPrompts: updated?.dailyPrompts ?? [],
      });
    }

    return NextResponse.json({
      challenge,
      dailyPrompts: challenge.dailyPrompts,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function generateDefaultPrompts(
  slug: string,
  duration: number
): Array<{ day: number; title: string; reflection: string; scripture: string; actionStep: string }> {
  const prayerTitles = [
    'Foundation: Starting Strong', 'Adoration: Entering His Presence', 'Confession: Clearing the Way',
    'Thanksgiving: A Grateful Heart', 'Supplication: Bringing Your Needs', 'Intercession: Standing for Others',
    'Listening: The Art of Silence', 'Persistence: Praying Through', 'Faith: Believing Before Seeing',
    'Warfare: Praying with Authority', 'Scripture: Praying the Word', 'Fasting: Intensifying Prayer',
    'Corporate: Agreeing Together', 'Breakthrough: Pressing In', 'Rest: Trusting God\'s Timing',
    'Renewal: Fresh Fire', 'Alignment: Seeking His Will', 'Boldness: Approaching the Throne',
    'Gratitude: Counting Answered Prayers', 'Consecration: Giving It All', 'Completion: A Life of Prayer',
  ];

  const scriptures: Record<string, string[]> = {
    'prayer-21': [
      'Matthew 6:9-13', 'Psalm 100:4', '1 John 1:9', 'Philippians 4:6', 'James 5:16',
      'Ephesians 6:18', 'Psalm 46:10', 'Luke 18:1', 'Mark 11:24', 'Ephesians 6:12',
      'Psalm 119:105', 'Isaiah 58:6', 'Matthew 18:19', 'Luke 11:8', 'Psalm 27:14',
      'Isaiah 40:31', 'Matthew 6:10', 'Hebrews 4:16', '1 Thessalonians 5:18', 'Romans 12:1', 'Colossians 4:2',
    ],
    'scripture-40': Array.from({ length: 40 }, (_, i) =>
      ['Genesis 1:1', 'John 1:1', 'Psalm 119:11', 'Romans 8:28', 'Hebrews 4:12',
       'Isaiah 40:8', '2 Timothy 3:16', 'Joshua 1:8', 'Proverbs 3:5-6', 'Matthew 4:4'][i % 10]
    ),
  };

  return Array.from({ length: duration }, (_, i) => {
    const day = i + 1;
    const title = slug === 'prayer-21' && prayerTitles[i]
      ? prayerTitles[i]
      : `Day ${day}: ${['Seeking', 'Growing', 'Trusting', 'Surrendering', 'Believing'][i % 5]}`;
    const scripture = scriptures[slug]?.[i] ?? 'Psalm 119:105';

    return {
      day,
      title,
      reflection: `Day ${day}: Take time today to focus on this aspect of your spiritual journey. Ask the Holy Spirit to guide you and speak to your heart as you seek God.`,
      scripture,
      actionStep: `Spend at least 20 minutes in focused devotion today. Journal what God reveals to you.`,
    };
  });
}
