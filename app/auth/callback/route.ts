import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma/client';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Upsert profile on successful OAuth login
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {
          email: data.user.email!,
          fullName: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          fullName: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
          role: 'USER',
        },
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
