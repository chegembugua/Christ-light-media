import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prayer Requests',
  description: 'Share and pray for one another in the community.',
};

export default function PrayerPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Prayer Wall</h1>
      <p className="mt-3 text-gray-400">Lift each other up in prayer.</p>
    </section>
  );
}
