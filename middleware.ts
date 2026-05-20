/**
 * Root Next.js middleware — refreshes Supabase session and enforces route guards.
 *
 * Protected routes:
 *   /profile/*        → login required
 *   /admin/*          → login + ADMIN role
 *   /school/[courseId]/lesson/[lessonId] → login required
 */
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // updateSession already securely checks for /admin and validates the ADMIN role
  const response = await updateSession(request);
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/school/:path*/lesson/:path*'
  ],
};
