/**
 * Supabase session refresh + route protection middleware helper.
 * Called from root middleware.ts on every matched request.
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Role } from '@prisma/client';

/** Routes that require an authenticated session. */
const PROTECTED_PREFIXES = ['/profile', '/school'];

/** Regex: /school/[courseId]/lesson/[lessonId] */
const SCHOOL_LESSON_PATTERN = /^\/school\/[^/]+\/lesson\//;

/** Admin area — requires role ADMIN. */
const ADMIN_PREFIX = '/admin';

function isProtectedRoute(pathname: string): boolean {
  if (pathname.startsWith(ADMIN_PREFIX)) return true;
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (SCHOOL_LESSON_PATTERN.test(pathname)) return true;
  return false;
}

async function fetchUserRole(
  request: NextRequest,
  userId: string
): Promise<Role | null> {
  try {
    const origin = request.nextUrl.origin;
    const res = await fetch(`${origin}/api/auth/profile?id=${userId}`, {
      headers: { cookie: request.headers.get('cookie') ?? '' },
    });
    if (!res.ok) return null;
    const profile = (await res.json()) as { role?: Role };
    return profile.role ?? null;
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return response;
  }

  // Unauthenticated → redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes → require ADMIN role
  if (pathname.startsWith(ADMIN_PREFIX)) {
    const role = await fetchUserRole(request, user.id);
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}
