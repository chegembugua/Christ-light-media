'use client';

import { useRouter } from 'next/navigation';
import { NewsForm } from '@/components/admin/NewsForm';

export default function NewArticlePage() {
  const router = useRouter();

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-black/20 p-5">
      <NewsForm mode="create" onSubmit={() => router.push('/admin/news')} />
    </section>
  );
}
