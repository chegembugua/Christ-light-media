/**
 * lib/api/helpers.ts
 * Shared API utilities: error responses, auth checks, pagination.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Role } from '@prisma/client';

export interface ApiError {
  error: string;
  code?: string;
  status: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

/**
 * Get authenticated user from Supabase session.
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

/**
 * Require authenticated user, return error if not.
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ userId: string } | NextResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return { userId: data.user.id };
}

/**
 * Require admin role.
 */
export async function requireAdmin(
  prisma: any,
  userId: string
): Promise<true | NextResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden: Admin access required' },
      { status: 403 }
    );
  }

  return true;
}

/**
 * Parse query parameters for pagination.
 */
export function parsePagination(
  request: NextRequest
): { page: number; pageSize: number; skip: number } {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '10')));
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip };
}

/**
 * Success response.
 */
export function successResponse<T>(
  data: T,
  status = 200,
  pagination?: { page: number; pageSize: number; total: number }
) {
  const response: ApiResponse<T> = { data };
  if (pagination) response.pagination = pagination;
  return NextResponse.json(response, { status });
}

/**
 * Error response.
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}
