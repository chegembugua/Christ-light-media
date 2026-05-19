/**
 * Root Next.js middleware — refreshes Supabase session and enforces route guards.
 *
 * Protected routes:
 *   /profile/*        → login required
 *   /admin/*          → login + ADMIN role
 *   /school/*/lesson/* → login required
 */
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
