import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and updates from Christ Light Media.',
};

export default function NewsPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">News</h1>
      <p className="mt-3 text-gray-400">Stories, announcements, and community updates.</p>
    </section>
  );
}
