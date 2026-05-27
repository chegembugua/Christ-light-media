import { BookOpen } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { listPublishedDevotions } from '../server/devotion.server';
import { DevotionCard } from './DevotionCard';

export async function DevotionsPublicPage() {
  const devotions = await listPublishedDevotions();

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

      {devotions.length === 0 ? (
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
