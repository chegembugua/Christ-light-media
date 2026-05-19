import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Give',
  description: 'Support Christ Light Media through giving.',
};

export default function GivePage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Give</h1>
      <p className="mt-3 text-gray-400">Partner with us to spread the Gospel worldwide.</p>
    </section>
  );
}
