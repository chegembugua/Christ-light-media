import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getSafeFileName, uploadFile } from '@/lib/supabase/storage';

const allowedTypes = ['SERMON', 'PODCAST', 'MUSIC', 'WORSHIP'] as const;
const allowedAudioExtensions = ['mp3', 'wav', 'm4a'];
const allowedAudioMimeTypes = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/mp4a-latm',
  'audio/m4a',
  'audio/x-m4a',
  'audio/vnd.wave',
  'application/octet-stream',
];
const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const audioMaxBytes = 100 * 1024 * 1024;
const imageMaxBytes = 10 * 1024 * 1024;

function getExtension(file: File) {
  return file.name.split('.').pop()?.toLowerCase() ?? '';
}

function isAllowedFile(file: File, extensions: string[], mimeTypes: string[]) {
  return extensions.includes(getExtension(file)) && mimeTypes.includes(file.type || 'application/octet-stream');
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ media });
  } catch {
    return errorResponse('Unable to load media. Please try again.', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  try {
    const formData = await req.formData();
    const title = String(formData.get('title') ?? '').trim();
    const speaker = String(formData.get('speaker') ?? '').trim();
    const type = String(formData.get('type') ?? '').trim();
    const category = String(formData.get('category') ?? '').trim();
    const duration = String(formData.get('duration') ?? '').trim();
    const file = formData.get('file');
    const image = formData.get('image');

    if (title.length < 3) return errorResponse('Title must be at least 3 characters');
    if (!speaker) return errorResponse('Speaker or artist is required');
    if (!allowedTypes.includes(type as (typeof allowedTypes)[number])) {
      return errorResponse('Choose a valid media type');
    }
    if (!category) return errorResponse('Category is required');

    if (!(file instanceof File) || file.size === 0) {
      return errorResponse('Audio file is required');
    }
    if (file.size > audioMaxBytes) {
      return errorResponse('Audio file must be under 100MB', 413);
    }
    if (!isAllowedFile(file, allowedAudioExtensions, allowedAudioMimeTypes)) {
      return errorResponse('Only MP3, WAV, M4A audio files are supported');
    }

    if (!(image instanceof File) || image.size === 0) {
      return errorResponse('Cover image is required');
    }
    if (image.size > imageMaxBytes) {
      return errorResponse('Cover image must be under 10MB', 413);
    }
    if (!isAllowedFile(image, allowedImageExtensions, allowedImageMimeTypes)) {
      return errorResponse('Only JPG, PNG, WebP images are supported');
    }

    const timestamp = Date.now();
    const audioPath = `${type}/${timestamp}-${getSafeFileName(file.name)}`;
    const imagePath = `covers/${timestamp}-${getSafeFileName(image.name)}`;

    const audioUpload = await uploadFile('media', audioPath, file);
    if (audioUpload.error) {
      return errorResponse('Upload failed. Please try again.', 500);
    }

    const imageUpload = await uploadFile('media', imagePath, image);
    if (imageUpload.error) {
      return errorResponse('Upload failed. Please try again.', 500);
    }

    const media = await prisma.media.create({
      data: {
        title,
        speaker,
        type,
        category,
        duration: duration || null,
        audioUrl: audioUpload.url,
        coverImage: imageUpload.url,
        isPublished: false,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';

    if (message.includes('body exceeded') || message.includes('too large')) {
      return errorResponse('Audio file must be under 100MB', 413);
    }

    return errorResponse('Upload failed. Please try again.', 500);
  }
}
