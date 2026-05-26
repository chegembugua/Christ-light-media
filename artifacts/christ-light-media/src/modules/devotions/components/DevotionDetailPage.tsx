import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, BookOpen } from 'lucide-react';

type Devotion = {
  id: string;
  title: string;
  date: string;
  verse?: string | null;
  verseText?: string | null;
  reflection?: string | null;
  isPublished: boolean;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DevotionDetailPage({ id }: { id: string }) {
  const [devotion, setDevotion] = useState<Devotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/devotions/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data || !data.isPublished) setNotFound(true);
        else setDevotion(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-6 pt-28 pb-16">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-bg-tertiary rounded w-1/4" />
          <div className="h-8 bg-bg-tertiary rounded w-3/4" />
          <div className="h-32 bg-bg-tertiary rounded" />
        </div>
      </div>
    );
  }

  if (notFound || !devotion) {
    return (
      <div className="container mx-auto max-w-3xl px-6 pt-28 pb-16 text-center">
        <h1 className="font-cinzel text-2xl text-white mb-4">Devotion Not Found</h1>
        <Link href="/devotions" className="text-gold hover:underline">← All devotions</Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto max-w-3xl px-6 pt-28 pb-16">
      <Link href="/devotions" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold">
        <ArrowLeft size={16} /> All devotions
      </Link>

      <header className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gold">
          {formatDate(devotion.date)}
        </p>
        <h1 className="mt-3 font-cinzel text-4xl text-white">{devotion.title}</h1>
      </header>

      {devotion.verse && (
        <section className="glass mb-8 rounded-2xl p-8">
          <BookOpen className="mb-4 text-gold" size={24} />
          <p className="font-cinzel text-lg text-gold">{devotion.verse}</p>
          {devotion.verseText && (
            <p className="mt-4 font-inter text-lg leading-relaxed text-gray-300 italic">
              &ldquo;{devotion.verseText}&rdquo;
            </p>
          )}
        </section>
      )}

      {devotion.reflection && (
        <section className="prose prose-invert max-w-none">
          <h2 className="font-cinzel text-xl text-white">Reflection</h2>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed text-gray-300">
            {devotion.reflection}
          </p>
        </section>
      )}
    </article>
  );
}
