import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Christian music and worship tracks.',
};

export default function MusicPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Music</h1>
      <p className="mt-3 text-gray-400">Worship and gospel music to uplift your spirit.</p>
    </section>
  );
}
