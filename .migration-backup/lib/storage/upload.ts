import { createClient } from '@supabase/supabase-js';
import { getSafeFileName } from '@/lib/supabase/storage';

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

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(?<contentType>[\w/+.-]+);base64,(?<data>.+)$/);
  if (!match?.groups?.data) {
    throw new Error('Invalid devotion image.');
  }

  return {
    contentType: match.groups.contentType || 'image/jpeg',
    buffer: Buffer.from(match.groups.data, 'base64'),
  };
}

function extensionForContentType(contentType: string) {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  return 'jpg';
}

export async function uploadDevotionImage(imageUrl: string, date: string, title: string) {
  if (!imageUrl.startsWith('data:')) return imageUrl;

  const { contentType, buffer } = parseDataUrl(imageUrl);
  const extension = extensionForContentType(contentType);
  const datePart = new Date(`${date}T00:00:00.000Z`).toISOString().split('T')[0];
  const safeTitle = getSafeFileName(title).replace(/\.[a-zA-Z0-9]+$/, '') || 'devotion';
  const path = `${datePart}-${safeTitle}.${extension}`;
  const supabase = createStorageClient();

  const { error } = await supabase.storage.from('devotions').upload(path, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from('devotions').getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadNewsImage(featuredImage: string, slug: string) {
  if (!featuredImage.startsWith('data:')) return featuredImage;

  const { contentType, buffer } = parseDataUrl(featuredImage);
  const extension = extensionForContentType(contentType);
  const safeSlug = getSafeFileName(slug).replace(/\.[a-zA-Z0-9]+$/, '') || 'article';
  const path = `${safeSlug}-${Date.now()}.${extension}`;
  const supabase = createStorageClient();

  const { error } = await supabase.storage.from('news').upload(path, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from('news').getPublicUrl(path);
  return data.publicUrl;
}
