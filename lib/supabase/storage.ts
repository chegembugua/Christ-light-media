import { createClient } from '@/lib/supabase/server';

/**
 * Uploads a file to a Supabase storage bucket.
 * Uses the server-side client to perform authenticated uploads.
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

    if (error) {
      return { url: '', error: error.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown upload error';
    return { url: '', error: message };
  }
}

/**
 * Extracts the storage object path from a Supabase public URL.
 */
export function getStoragePathFromUrl(url: string, bucket: string): string {
  if (!url) return '';
  const parts = url.split(`/public/${bucket}/`);
  return parts.length > 1 ? parts[1] : url;
}

/**
 * Deletes one or multiple files from a Supabase storage bucket.
 * Accepts full public URLs and automatically extracts the necessary internal paths.
 */
export async function deleteFile(
  bucket: string,
  paths: string | string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const urls = Array.isArray(paths) ? paths : [paths];
    const extractedPaths = urls
      .map(url => getStoragePathFromUrl(url, bucket))
      .filter(Boolean);
    
    if (extractedPaths.length === 0) return { success: true };
    
    const { error } = await supabase.storage.from(bucket).remove(extractedPaths);
    
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown delete error';
    return { success: false, error: message };
  }
}

/**
 * Sanitizes a filename, replacing all characters except alphanumeric, dashes, and dots with underscores.
 */
export function getSafeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
}
