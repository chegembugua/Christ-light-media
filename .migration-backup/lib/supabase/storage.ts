import { createClient } from '@supabase/supabase-js';

function createStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Storage is not configured. Add Supabase URL and service role key.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSafeFileName(fileName: string): string {
  const extension = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
  const baseName = extension ? fileName.slice(0, -extension.length) : fileName;

  return `${baseName
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')}${extension.replace(/[^a-zA-Z0-9.]/g, '')}`;
}

export function getStoragePathFromUrl(urlOrPath: string, bucket: string): string {
  if (!urlOrPath) return '';
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = urlOrPath.indexOf(marker);

  if (markerIndex === -1) {
    return urlOrPath;
  }

  return decodeURIComponent(urlOrPath.slice(markerIndex + marker.length));
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string; error?: string }> {
  try {
    const supabase = createStorageClient();
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

    if (error) {
      return { url: '', error: error.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed. Please try again.';
    return { url: '', error: message };
  }
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const safePath = getStoragePathFromUrl(path, bucket);
    if (!safePath) return { success: true };

    const supabase = createStorageClient();
    const { error } = await supabase.storage.from(bucket).remove([safePath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete stored file.';
    return { success: false, error: message };
  }
}
