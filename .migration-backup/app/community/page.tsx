import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Prayer wall, fellowship chat, and community at In For Christ Media.',
};

const hubs = [
  {
    title: 'Prayer Wall',
    description: 'Share requests and pray for one another.',
    href: '/community/prayer',
    icon: Heart,
  },
  {
    title: 'Community Chat',
    description: 'Fellowship and encouragement in real time.',
    href: '/community/chat',
    icon: MessageSquare,
  },
];

export default function CommunityPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <header className="mb-12">
        <h1 className="font-cinzel text-4xl text-white md:text-5xl">Community</h1>
        <p className="mt-3 max-w-2xl text-gray-400">
          Connect, pray, and grow together as the body of Christ.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {hubs.map((hub) => (
          <Link
            key={hub.href}
            href={hub.href}
            className="glass group rounded-2xl p-8 transition-colors hover:border-gold/30"
          >
            <hub.icon className="mb-4 text-gold" size={28} />
            <h2 className="font-cinzel text-2xl text-white group-hover:text-gold">{hub.title}</h2>
            <p className="mt-2 text-sm text-gray-500">{hub.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
