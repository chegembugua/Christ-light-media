'use client';

import { useRouter } from 'next/navigation';
import { DevotionForm } from '@/components/admin/DevotionForm';

export default function NewDevotionPage() {
  const router = useRouter();

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-black/20 p-5">
      <DevotionForm mode="create" onSubmit={() => router.push('/admin/devotions')} />
    </section>
  );
}
