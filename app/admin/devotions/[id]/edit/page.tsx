export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { DevotionForm } from '@/modules/devotions';
import { getDevotionById } from '@/modules/devotions/server/devotion.server';

interface EditDevotionPageProps {
  params: { id: string };
}

export default async function EditDevotionPage({ params }: EditDevotionPageProps) {
  const devotion = await getDevotionById(params.id);
  if (!devotion) notFound();

  return (
    <section className="space-y-6">
      <h1 className="font-cinzel text-3xl text-white">Edit devotion</h1>
      <DevotionForm initial={devotion} />
    </section>
  );
}
