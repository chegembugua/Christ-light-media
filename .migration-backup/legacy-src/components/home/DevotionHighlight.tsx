import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { DevotionItem } from '../../services/devotionService';

interface DevotionHighlightProps {
  devotion: DevotionItem | null;
  loading: boolean;
}

export default function DevotionHighlight({ devotion, loading }: DevotionHighlightProps) {
  if (loading) {
    return (
      <section className="py-32 relative animate-pulse flex justify-center">
        <div className="w-[600px] h-[300px] bg-white/5 rounded-2xl"></div>
      </section>
    );
  }

  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-base to-surface opacity-90 z-0" />
      <div className="max-w-4xl mx-auto px-4 z-10 relative">
        <div className="flex flex-col items-center text-center">
          <BookOpen className="w-12 h-12 text-gold/50 mb-8" />
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-8 leading-tight">
            {devotion?.title || 'Daily Spiritual Nourishment'}
          </h2>
          <div className="w-24 h-[1px] bg-gold mb-8"></div>
          <p className="text-xl md:text-2xl text-gold font-serif italic mb-8">
            {devotion?.scriptureReference || '"Your word is a lamp for my feet, a light on my path." - Psalm 119:105'}
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-2xl font-light">
            {devotion?.content?.slice(0, 200) || 'Take a moment to pause and reflect on the goodness of God. Our daily devotions are crafted to bring peace to your mind and strength to your spirit.'}...
          </p>
          <Link to={devotion ? `/devotions/${devotion.id}` : '/devotions'} className="border border-gold text-gold hover:bg-gold hover:text-primary-base transition-all duration-300 px-10 py-4 rounded-full font-bold tracking-widest uppercase text-sm">
            Read Full Devotion
          </Link>
        </div>
      </div>
    </section>
  );
}
