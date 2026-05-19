export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { DevotionDetailPage } from '@/modules/devotions';
import { getDevotionById } from '@/modules/devotions/server/devotion.server';

interface DevotionPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: DevotionPageProps): Promise<Metadata> {
  const devotion = await getDevotionById(params.id);
  return {
    title: devotion?.title ?? 'Devotion',
    description: devotion?.verse ?? 'Daily devotion',
  };
}

export default function DevotionPage({ params }: DevotionPageProps) {
  return <DevotionDetailPage id={params.id} />;
}
