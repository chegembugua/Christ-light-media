/**
 * Upload files to Supabase Storage (service role).
 * Create a public bucket named `media` in Supabase Dashboard.
 */
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const BUCKET = 'media';

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY for uploads.');
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function uploadToStorage(
  folder: 'covers' | 'audio' | 'video',
  file: File
): Promise<string> {
  const supabase = getStorageClient();
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
  const path = `${folder}/${randomUUID()}.${ext ?? 'bin'}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
