'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Clock, Eye, ChevronRight, Filter, Calendar, User } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const CATEGORIES = ['All', 'Grace', 'Faith', 'Prayer', 'Healing', 'Prophecy', 'Discipleship', 'Family'];

const SERIES = [
  {
    id: 's1',
    title: 'Unfailing Light',
    coverImage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070',
    sermonCount: 6,
  },
  {
    id: 's2',
    title: 'Rooted in Grace',
    coverImage: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2070',
    sermonCount: 4,
  },
  {
    id: 's3',
    title: 'Kingdom Builders',
    coverImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073',
    sermonCount: 8,
  },
  {
    id: 's4',
    title: 'Walk by Faith',
    coverImage: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070',
    sermonCount: 5,
  },
];

const SERMONS = [
  {
    id: 'ser1',
    title: 'The Unfailing Light in a Dark World',
    speaker: 'Pastor David Chen',
    category: 'Faith',
    date: 'May 18, 2026',
    duration: '45:22',
    views: 12400,
    coverImage: 'https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2070',
    audioUrl: '/audio/sermon1.mp3',
    type: 'sermon' as const,
    artist: 'Pastor David Chen',
  },
  {
    id: 'ser2',
    title: 'Grace That Transforms',
    speaker: 'Pastor Sarah Okafor',
    category: 'Grace',
    date: 'May 15, 2026',
    duration: '38:10',
    views: 8700,
    coverImage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070',
    audioUrl: '/audio/sermon2.mp3',
    type: 'sermon' as const,
    artist: 'Pastor Sarah Okafor',
  },
  {
    id: 'ser3',
    title: 'Healing in His Wings',
    speaker: 'Pastor James Mwangi',
    category: 'Healing',
    date: 'May 12, 2026',
    duration: '52:05',
    views: 15200,
    coverImage: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2070',
    audioUrl: '/audio/sermon3.mp3',
    type: 'sermon' as const,
    artist: 'Pastor James Mwangi',
  },
  {
    id: 'ser4',
    title: 'The Power of Persistent Prayer',
    speaker: 'Pastor Ruth Wambui',
    category: 'Prayer',
    date: 'May 9, 2026',
    duration: '41:30',
    views: 9500,
    coverImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073',
    audioUrl: '/audio/sermon4.mp3',
    type: 'sermon' as const,
    artist: 'Pastor Ruth Wambui',
  },
  {
    id: 'ser5',
    title: 'Walking in Kingdom Authority',
    speaker: 'Pastor David Chen',
    category: 'Discipleship',
    date: 'May 5, 2026',
    duration: '47:18',
    views: 11300,
    coverImage: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070',
    audioUrl: '/audio/sermon5.mp3',
    type: 'sermon' as const,
    artist: 'Pastor David Chen',
  },
  {
    id: 'ser6',
    title: 'Family — God\'s First Institution',
    speaker: 'Pastor Sarah Okafor',
    category: 'Family',
    date: 'May 1, 2026',
    duration: '35:42',
    views: 7800,
    coverImage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070',
    audioUrl: '/audio/sermon6.mp3',
    type: 'sermon' as const,
    artist: 'Pastor Sarah Okafor',
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function SermonsPage() {
  const { playTrack, pause, currentTrack, isPlaying } = usePlayer();
  const [activeCategory, setActiveCategory] = useState('All');

  const featured = SERMONS[0];

  const filtered =
    activeCategory === 'All'
      ? SERMONS.slice(1)
      : SERMONS.filter((s) => s.category === activeCategory);

  const isCurrentlyPlaying = (id: string) => currentTrack?.id === id && isPlaying;

  const handlePlay = (sermon: (typeof SERMONS)[0]) => {
    if (currentTrack?.id === sermon.id && isPlaying) {
      pause();
    } else {
      playTrack({
        id: sermon.id,
        title: sermon.title,
        artist: sermon.artist,
        coverImage: sermon.coverImage,
        audioUrl: sermon.audioUrl,
        type: sermon.type,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader
        label="THE WORD"
        title="Sermons"
        description="Powerful messages for every season of life. Watch, listen, and be transformed by the living Word."
      />

      {/* ── Featured Sermon ────────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <Card variant="featured" className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Thumbnail */}
                <div className="relative aspect-video lg:aspect-auto lg:min-h-[400px] rounded-2xl overflow-hidden">
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <button
                    onClick={() => handlePlay(featured)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center transform hover:scale-110 transition-all shadow-[0_0_40px_rgba(200,162,74,0.5)] active:scale-95">
                      {isCurrentlyPlaying(featured.id) ? (
                        <Pause size={32} className="text-black" fill="currentColor" />
                      ) : (
                        <Play size={32} className="text-black ml-1" fill="currentColor" />
                      )}
                    </div>
                  </button>
                  {/* Badge */}
                  <div className="absolute top-5 left-5">
                    <span className="bg-gold text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <p className="text-gold tracking-widest uppercase text-xs mb-4 font-bold">LATEST SERMON</p>
                  <h2 className="text-3xl lg:text-4xl font-cinzel font-bold mb-4 leading-tight group-hover:text-gold transition-colors">
                    {featured.title}
                  </h2>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex items-center gap-2 text-sm text-gray-400">
                      <User size={14} className="text-gold" /> {featured.speaker}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={14} className="text-gold" /> {featured.date}
                    </span>
                  </div>
                  <p className="text-gray-400 font-inter leading-relaxed mb-8">
                    An exploration of Christ as the Light of the World — hope, truth, 
                    and the transformation that comes when we follow the Light.
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gold/60" /> {featured.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye size={14} className="text-gold/60" /> {featured.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Series Carousel ────────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-gold tracking-widest uppercase text-xs mb-2 font-bold">COLLECTIONS</p>
                <h2 className="text-3xl font-cinzel font-medium">Sermon Series</h2>
              </div>
              <button className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2 text-sm font-medium">
                View All <ChevronRight size={16} />
              </button>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {SERIES.map((series) => (
              <div
                key={series.id}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={series.coverImage}
                    alt={series.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-cinzel font-semibold mb-1 group-hover:text-gold transition-colors">
                      {series.title}
                    </h3>
                    <p className="text-xs text-gray-400">{series.sermonCount} sermons</p>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/0 group-hover:bg-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-300 shadow-xl">
                      <Play size={22} className="text-black ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── All Sermons ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-gold tracking-widest uppercase text-xs mb-2 font-bold">ARCHIVE</p>
                <h2 className="text-3xl font-cinzel font-medium">All Sermons</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter size={14} /> {filtered.length} sermons
              </div>
            </div>
          </ScrollReveal>

          {/* Category Pills */}
          <ScrollReveal>
            <div className="flex gap-3 mb-10 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat
                      ? 'bg-gold text-black shadow-lg shadow-gold/20'
                      : 'bg-card text-gray-400 hover:text-white border border-white/5 hover:border-gold/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Sermon List */}
          <div className="space-y-4">
            {filtered.map((sermon, i) => {
              const playing = isCurrentlyPlaying(sermon.id);
              return (
                <ScrollReveal key={sermon.id} delay={i * 60}>
                  <div
                    className={`flex items-center gap-5 p-5 rounded-2xl transition-all group border ${
                      playing
                        ? 'bg-gold/10 border-gold/30 shadow-[0_0_20px_rgba(200,162,74,0.1)]'
                        : 'bg-card border-white/5 hover:border-gold/20 hover:bg-[#1E1E1E]'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={sermon.coverImage}
                        alt={sermon.title}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pr-4">
                      <p className={`font-semibold font-cinzel truncate text-lg ${playing ? 'text-gold' : 'text-white'}`}>
                        {sermon.title}
                      </p>
                      <p className="text-sm text-gray-500 font-inter">{sermon.speaker} · {sermon.date}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-gold/60" /> {sermon.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} className="text-gold/60" /> {sermon.views.toLocaleString()}
                        </span>
                        <span className="hidden md:inline-flex items-center gap-1 bg-white/5 px-2.5 py-0.5 rounded-full text-gray-500">
                          {sermon.category}
                        </span>
                      </div>
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => handlePlay(sermon)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0 shadow-lg ${
                        playing
                          ? 'bg-gold text-black shadow-gold/30'
                          : 'bg-white/5 hover:bg-gold hover:text-black text-white hover:shadow-gold/30'
                      }`}
                    >
                      {playing ? (
                        <Pause size={22} fill="currentColor" />
                      ) : (
                        <Play size={22} className="ml-1" fill="currentColor" />
                      )}
                    </button>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
