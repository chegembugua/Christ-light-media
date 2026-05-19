export const dynamic = 'force-dynamic';

import { MediaAdminList } from '@/modules/media';
import { listAllMedia } from '@/modules/media/server/media.server';

export default async function AdminMediaPage() {
  const items = await listAllMedia();
  return <MediaAdminList items={items} />;
}
