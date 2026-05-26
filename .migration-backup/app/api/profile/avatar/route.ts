import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/** POST /api/profile/avatar — upload profile photo to Supabase Storage */
export async function POST(request: Request) {
  try {
    const supabase = await (await import('@/lib/supabase/server')).createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionUser.id;
    const formData = await request.formData();
    const avatarFile = formData.get('avatar') as File | null;

    if (!avatarFile) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (avatarFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File must be under 5 MB' },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(avatarFile.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, and WebP images are allowed' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL in your environment.' },
        { status: 500 }
      );
    }

    const ext = avatarFile.name.split('.').pop() ?? 'jpg';
    const path = `avatars/${userId}-${Date.now()}.${ext}`;

    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage bucket "avatars"
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${path}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': avatarFile.type,
        'x-upsert': 'true',
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return NextResponse.json(
        { error: 'Failed to upload avatar', detail: errText },
        { status: uploadRes.status }
      );
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${userId}-${Date.now()}.${ext}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: publicUrl },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        bio: true,
        location: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE /api/profile/avatar — remove profile photo */
export async function DELETE() {
  try {
    const supabase = await (await import('@/lib/supabase/server')).createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = sessionUser.id;

    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });

    if (!existing?.avatarUrl) {
      return NextResponse.json(
        { error: 'No avatar set' },
        { status: 404 }
      );
    }

    const match = existing.avatarUrl.match(/\/([^/]+\.(jpg|jpeg|png|webp))$/);
    if (match) {
      const filePath = match[1];
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseKey && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/avatars/${encodeURIComponent(filePath as string)}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        bio: true,
        location: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
