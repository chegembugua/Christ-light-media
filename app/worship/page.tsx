import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worship',
  description: 'Worship sessions and live praise.',
};

export default function WorshipPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Worship</h1>
      <p className="mt-3 text-gray-400">Enter His presence through worship.</p>
    </section>
  );
}
