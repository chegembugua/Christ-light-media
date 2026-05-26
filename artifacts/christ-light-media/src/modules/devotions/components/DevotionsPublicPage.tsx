import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { DevotionCard } from './DevotionCard';

type Devotion = {
  id: string;
  title: string;
  date: string;
  verse?: string | null;
  verseText?: string | null;
  reflection?: string | null;
  isPublished: boolean;
};

export function DevotionsPublicPage() {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/devotions')
      .then(r => r.ok ? r.json() : [])
      .then(data => setDevotions(Array.isArray(data) ? data : []))
      .catch(() => setDevotions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <ScrollReveal>
        <header className="mb-16 text-center">
          <BookOpen className="mx-auto mb-4 text-gold" size={32} />
          <h1 className="font-cinzel text-4xl text-white md:text-5xl">Daily Devotions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Feed your spirit with Scripture, reflection, and prayer.
          </p>
        </header>
      </ScrollReveal>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-bg-tertiary animate-pulse rounded-xl" />)}
        </div>
      ) : devotions.length === 0 ? (
        <p className="text-center text-gray-500">No devotions published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {devotions.map((d) => (
            <DevotionCard key={d.id} devotion={d} />
          ))}
        </div>
      )}
    </section>
  );
}
