import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devotions',
  description: 'Daily devotions with Scripture and reflection.',
};

export default function DevotionsPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Devotions</h1>
      <p className="mt-3 text-gray-400">Start each day anchored in God&apos;s Word.</p>
    </section>
  );
}
