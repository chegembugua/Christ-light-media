import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const dateParam = req.nextUrl.pathname.split('/').pop();
    
    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });
    }

    const date = new Date(dateParam);
    
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
    }

    const devotion = await prisma.devotion.findUnique({
      where: { date },
    });

    if (!devotion) {
      return NextResponse.json({ error: 'Devotion not found' }, { status: 404 });
    }

    if (!devotion.isPublished) {
      return NextResponse.json({ error: 'Devotion not published' }, { status: 404 });
    }

    return NextResponse.json({ devotion });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}