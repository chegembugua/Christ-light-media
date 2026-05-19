import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bible School',
  description: 'Structured courses to grow in faith and knowledge.',
};

export default function SchoolPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Bible School</h1>
      <p className="mt-3 text-gray-400">Learn, grow, and be equipped for ministry.</p>
    </section>
  );
}
