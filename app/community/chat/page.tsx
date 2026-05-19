import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Chat',
  description: 'Connect with believers in real-time.',
};

export default function ChatPage() {
  return (
    <section className="container mx-auto px-6 pt-28 pb-16">
      <h1 className="font-cinzel text-4xl text-white">Community Chat</h1>
      <p className="mt-3 text-gray-400">Fellowship and encouragement in real time.</p>
    </section>
  );
}
