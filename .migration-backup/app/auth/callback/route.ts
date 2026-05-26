import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { upsertProfile } from '@/modules/auth';

/** OAuth callback — exchange code for session and sync Prisma profile. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=Missing+auth+code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate+user`);
  }

  const meta = data.user.user_metadata;
  const fullName =
    (typeof meta?.full_name === 'string' && meta.full_name) ||
    (typeof meta?.name === 'string' && meta.name) ||
    null;

  await upsertProfile({
    id: data.user.id,
    email: data.user.email,
    fullName,
    avatarUrl: typeof meta?.avatar_url === 'string' ? meta.avatar_url : null,
  });

  return NextResponse.redirect(`${origin}${next}`);
}
