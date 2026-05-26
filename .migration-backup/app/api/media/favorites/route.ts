import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api/helpers';

async function requireUser() {
  const auth = await getAuthenticatedUser();
  if (!auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauthorized = await requireUser();
  if (unauthorized) return unauthorized;

  return NextResponse.json({ favorites: [], success: true });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireUser();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => ({}))) as { mediaId?: string };
  return NextResponse.json({ success: true, mediaId: body.mediaId ?? null });
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireUser();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => ({}))) as { mediaId?: string };
  return NextResponse.json({ success: true, mediaId: body.mediaId ?? null });
}
