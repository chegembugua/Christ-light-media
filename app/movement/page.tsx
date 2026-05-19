import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movement',
  description: 'Join the Christ Light 40-day challenge.',
};

export default function MovementPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">The Movement</h1>
      <p className="mt-3 text-gray-400">40 days of prayer, fasting, and transformation.</p>
    </section>
  );
}
