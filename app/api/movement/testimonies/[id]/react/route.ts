import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/** POST /api/movement/testimonies/[id]/react — increment reaction count */
export async function POST(_req: NextRequest, { params }: RouteParams) {
  try {
    await prisma.testimony.update({
      where: { id: params.id },
      data: { reactionCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
