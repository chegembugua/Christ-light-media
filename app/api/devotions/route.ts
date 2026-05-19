import { NextResponse } from 'next/server';
import { listPublishedDevotions } from '@/modules/devotions/server/devotion.server';

/** GET /api/devotions — public published list */
export async function GET() {
  try {
    const devotions = await listPublishedDevotions();
    return NextResponse.json(devotions);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
