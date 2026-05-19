import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sermons',
  description: 'Watch and listen to powerful sermons.',
};

export default function SermonsPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Sermons</h1>
      <p className="mt-3 text-gray-400">Powerful messages for every season of life.</p>
    </section>
  );
}
