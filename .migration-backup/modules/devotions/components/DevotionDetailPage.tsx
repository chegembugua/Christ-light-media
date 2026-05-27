import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getDevotionById } from '../server/devotion.server';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function DevotionDetailPage({ id }: { id: string }) {
  const devotion = await getDevotionById(id);

  if (!devotion || !devotion.isPublished) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl px-6 pt-28 pb-16">
      <Link
        href="/devotions"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold"
      >
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
