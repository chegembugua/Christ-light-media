import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

/** GET /api/movement/membership — check if current user is a movement member */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isMember: false });
    }

    const member = await prisma.movementMember.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ isMember: !!member, member: member ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
