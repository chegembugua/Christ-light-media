'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { NewsForm, type News } from '@/components/admin/NewsForm';

export default function EditArticlePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/admin/news/${params.slug}`);
        const result = (await response.json()) as { article?: News; error?: string };

        if (response.status === 404) {
          toast.error('Article not found.');
          router.push('/admin/news');
          return;
        }

        if (!response.ok || !result.article) {
          throw new Error(result.error ?? 'Unable to load article.');
        }

        setArticle(result.article);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load article.');
      } finally {
        setLoading(false);
      }
    }

    void fetchArticle();
  }, [params.slug, router]);

  if (loading) {
    return (
      <section className="max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="h-8 w-56 animate-pulse rounded bg-white/10" />
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-xl bg-white/10" />
        ))}
      </section>
    );
  }

  if (!article) {
    return <p className="text-sm text-gray-500">Unable to load this article.</p>;
  }

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-black/20 p-5">
      <NewsForm mode="edit" article={article} onSubmit={() => router.push('/admin/news')} />
    </section>
  );
}
