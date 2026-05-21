import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/require-admin';
import { deleteFile } from '@/lib/supabase/storage';

type RouteParams = {
  params: {
    id: string;
  };
};

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const media = await prisma.media.findUnique({ where: { id: params.id } });

    if (!media) {
      return errorResponse('Media not found', 404);
    }

    const storageDeletes = await Promise.all([
      deleteFile('media', media.audioUrl ?? ''),
      deleteFile('media', media.coverImage ?? ''),
    ]);
    const failedDelete = storageDeletes.find((result) => !result.success);

    if (failedDelete) {
      return errorResponse('Stored files could not be deleted. Please try again.', 500);
    }

    await prisma.media.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch {
    return errorResponse('Unable to delete media. Please try again.', 500);
  }
}
