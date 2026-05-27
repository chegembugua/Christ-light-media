import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { DevotionDTO } from '../types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DevotionCard({ devotion }: { devotion: DevotionDTO }) {
  return (
    <Link href={`/devotions/${devotion.id}`}>
      <Card className="h-full">
        <BookOpen className="mb-4 text-gold" size={22} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {formatDate(devotion.date)}
        </p>
        <h3 className="mt-2 font-cinzel text-xl text-white group-hover:text-gold">{devotion.title}</h3>
        {devotion.verse && (
          <p className="mt-2 text-sm font-medium text-gold/80">{devotion.verse}</p>
        )}
        {devotion.reflection && (
          <p className="mt-3 line-clamp-3 text-sm text-gray-500">{devotion.reflection}</p>
        )}
      </Card>
    </Link>
  );
}
