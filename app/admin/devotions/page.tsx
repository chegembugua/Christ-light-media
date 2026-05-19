export const dynamic = 'force-dynamic';

import { DevotionsAdminList } from '@/modules/devotions';
import { listAllDevotions } from '@/modules/devotions/server/devotion.server';

export default async function AdminDevotionsPage() {
  const devotions = await listAllDevotions();
  return <DevotionsAdminList devotions={devotions} />;
}
