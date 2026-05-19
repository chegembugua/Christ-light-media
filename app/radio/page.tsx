import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Radio',
  description: 'Live Christian radio streaming 24/7.',
};

export default function RadioPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Radio</h1>
      <p className="mt-3 text-gray-400">Tune in to Christ Light Radio — live and on demand.</p>
    </section>
  );
}
