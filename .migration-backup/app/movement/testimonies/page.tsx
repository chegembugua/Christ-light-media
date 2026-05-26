'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight, Quote, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import { useApi } from '@/hooks/useApi';

interface Testimony {
  id: string;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  photoUrl: string | null;
  authorTitle: string | null;
  location: string | null;
  isFeatured: boolean;
  publishedAt: string | null;
  user: { fullName: string | null; avatarUrl: string | null };
}

const CATEGORIES = ['All', 'Prayer', 'Healing', 'Family', 'Ministry', 'Finances', 'Salvation', 'Personal Growth'];

const CATEGORY_COLORS: Record<string, string> = {
  Prayer: 'bg-orange-500/10 text-orange-400',
  Healing: 'bg-green-500/10 text-green-400',
  Family: 'bg-blue-500/10 text-blue-400',
  Ministry: 'bg-purple-500/10 text-purple-400',
  Finances: 'bg-yellow-500/10 text-yellow-400',
  Salvation: 'bg-red-500/10 text-red-400',
  'Personal Growth': 'bg-teal-500/10 text-teal-400',
};

export default function TestimoniesPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const endpoint = activeCategory === 'All'
    ? '/api/movement/testimonies?limit=12'
    : `/api/movement/testimonies?category=${encodeURIComponent(activeCategory)}&limit=12`;

  const { data, loading } = useApi<{ testimonies: Testimony[] }>(endpoint);
  const testimonies = data?.testimonies ?? [];
  const featured = testimonies.find((t) => t.isFeatured) ?? testimonies[0];
  const grid = testimonies.filter((t) => t.id !== featured?.id);

  const getAuthorName = (t: Testimony) =>
    t.isAnonymous ? 'Anonymous' : (t.user.fullName ?? 'Community Member');

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-gold text-sm tracking-[0.3em] mb-4 uppercase font-bold">IMPACT</p>
            <h1 className="text-5xl md:text-6xl font-cinzel font-bold tracking-tighter mb-5 text-shine leading-tight">
              Stories of Transformation
            </h1>
            <p className="text-gray-400 max-w-xl text-lg font-inter leading-relaxed">
              How Christ Light and In for Christ changed lives — real stories from real people.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-6 pb-24">
        {/* Featured testimony */}
        {loading ? (
          <div className="h-64 rounded-3xl bg-card animate-pulse mb-10" />
        ) : featured ? (
          <ScrollReveal>
            <Link href={`/movement/testimonies/${featured.id}`}>
              <div className="bg-card border border-gold/10 rounded-3xl p-8 md:p-12 mb-10 hover:border-gold/40 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gold/3 rounded-bl-full blur-3xl group-hover:bg-gold/6 transition-all" />
                <div className="flex items-center gap-2 mb-6">
                  <Star size={14} className="text-gold fill-gold" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">Featured Story</span>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    {featured.photoUrl || featured.user.avatarUrl ? (
                      <Image
                        src={(featured.photoUrl ?? featured.user.avatarUrl) as string}
                        alt={getAuthorName(featured)}
                        width={128} height={128}
                        className="w-32 h-32 rounded-full object-cover border-2 border-gold/30"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/30 flex items-center justify-center text-gold text-4xl font-bold">
                        {getAuthorName(featured)[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Quote className="text-gold/20 mb-3" size={36} />
                    <p className="text-white/90 text-xl italic leading-relaxed mb-5 line-clamp-4">
                      {featured.content}
                    </p>
                    <p className="font-semibold text-white text-lg">{getAuthorName(featured)}</p>
                    {featured.authorTitle && <p className="text-gold/70 text-sm">{featured.authorTitle}</p>}
                    {featured.location && <p className="text-gray-600 text-xs mt-1">{featured.location}</p>}
                    <span className="inline-flex items-center gap-1 text-gold text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                      Read Full Story <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ) : null}

        {/* Category filter tabs */}
        <ScrollReveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-gold text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        ) : grid.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grid.map((t) => (
              <Link key={t.id} href={`/movement/testimonies/${t.id}`}>
                <div className="bg-card border border-white/5 rounded-2xl p-6 hover:border-gold/30 transition-all duration-300 group h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    {t.photoUrl || t.user.avatarUrl ? (
                      <Image
                        src={(t.photoUrl ?? t.user.avatarUrl) as string}
                        alt={getAuthorName(t)}
                        width={64} height={64}
                        className="w-16 h-16 rounded-full object-cover border border-gold/20 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xl font-bold flex-shrink-0">
                        {getAuthorName(t)[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-white truncate">{getAuthorName(t)}</p>
                      {t.authorTitle && <p className="text-xs text-gray-500 truncate">{t.authorTitle}</p>}
                    </div>
                  </div>

                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 ${CATEGORY_COLORS[t.category] ?? 'bg-gold/10 text-gold'}`}>
                    {t.category}
                  </span>

                  <p className="text-gray-400 text-sm italic leading-relaxed line-clamp-2 flex-1">
                    &ldquo;{t.content}&rdquo;
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    {t.publishedAt && (
                      <span className="text-xs text-gray-600">
                        {new Date(t.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-gold/70 text-xs font-semibold group-hover:text-gold transition-colors ml-auto">
                      Read Story <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <Quote className="mx-auto mb-4 opacity-20" size={48} />
            <p className="text-lg mb-2">No testimonies yet in this category.</p>
            <p className="text-sm">Be the first to share your story.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center">
          <ScrollReveal>
            <div className="bg-card border border-gold/10 rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gold/5 rounded-full blur-3xl" />
              <p className="text-gold tracking-widest uppercase text-xs mb-4 font-bold">YOUR STORY</p>
              <h2 className="text-3xl font-cinzel font-bold mb-4">Share Your Story</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto font-inter">
                Tell us how God has worked in your life through Christ Light. Your testimony is a gift to the body of Christ.
              </p>
              <Link href="/movement/testimonies/new">
                <Button variant="gold" size="lg" className="px-10 rounded-full shadow-xl shadow-gold/20 inline-flex items-center gap-2">
                  <PlusCircle size={18} /> Share Testimony
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
