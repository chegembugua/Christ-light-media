export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Image from 'next/image';
import { listPublishedMedia } from '@/modules/media/server/media.server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Sermons',
  description: 'Watch and listen to powerful sermons from Christ Light Media.',
};

export default async function SermonsPage() {
  const sermons = await listPublishedMedia('SERMON');

  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <header className="mb-12">
        <h1 className="font-cinzel text-4xl text-white md:text-5xl">Sermons</h1>
        <p className="mt-3 text-gray-400">Powerful messages for every season of life.</p>
      </header>

      {sermons.length === 0 ? (
        <p className="text-gray-500">No sermons published yet.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sermons.map((item) => (
            <Card key={item.id} hover className="overflow-hidden p-0">
              <div className="relative aspect-video bg-surface">
                {item.coverImage && (
                  <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
                )}
              </div>
              <div className="p-6">
                <Badge variant="gold" className="mb-2">
                  Sermon
                </Badge>
                <h3 className="font-cinzel text-xl text-white">{item.title}</h3>
                {item.speaker && <p className="mt-1 text-sm text-gold/80">{item.speaker}</p>}
                {item.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">{item.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
