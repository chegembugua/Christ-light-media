import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureProfileForAuthUser } from '@/modules/auth/server/ensure-profile.server';

/** POST /api/auth/create-profile — creates platform profile after Supabase signup. */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      id?: string;
      email?: string;
      fullName?: string;
    };

    const { id, email, fullName } = body;

    if (!id || !email) {
      return NextResponse.json({ error: 'id and email are required' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const result = await ensureProfileForAuthUser(
      { id, email, fullName: fullName ?? null },
      user?.id ?? null
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error ?? 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
