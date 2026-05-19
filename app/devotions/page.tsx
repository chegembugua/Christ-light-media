export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { DevotionsPublicPage } from '@/modules/devotions';

export const metadata: Metadata = {
  title: 'Devotions',
  description: 'Daily devotions and Scripture reflections from Christ Light Media.',
};

export default function DevotionsPage() {
  return <DevotionsPublicPage />;
}
