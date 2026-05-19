'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Clock, Headphones, Share2, Twitter, Facebook, Link as LinkIcon, X } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'react-hot-toast';

const CATEGORIES = ['All', 'Faith', 'Prayer', 'Discipleship', 'Marriage', 'Youth', 'Bible Study', 'Christian Living'];

const podcasts = [
  {
    id: '1', title: 'In for Christ Podcast',
    description: 'Deep conversations about living fully for Christ in every season.',
    coverImage: '/images/podcast-ifc.jpg', episodes: 48, category: 'Faith',
  },
  {
    id: '2', title: 'Talk and Tea',
    description: 'Warm, honest conversations about faith, womanhood, and purpose.',
    coverImage: '/images/podcast-tat.jpg', episodes: 32, category: 'Discipleship',
  },
];

type PodcastEpisode = {
  id: string;
  title: string;
  podcastId: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  duration: string;
  plays: number;
  type: 'podcast';
  date: string;
};

const episodes: PodcastEpisode[] = [
  {
    id: 'ep1', title: 'When God Feels Silent', podcastId: '1',
    artist: 'In for Christ Podcast', coverImage: '/images/podcast-ifc.jpg',
    audioUrl: '/audio/ep1.mp3', duration: '42:18', plays: 3200,
    type: 'podcast' as const, date: 'May 12, 2026',
  },
  {
    id: 'ep2', title: 'The Power of a Praying Woman', podcastId: '2',
    artist: 'Talk and Tea', coverImage: '/images/podcast-tat.jpg',
    audioUrl: '/audio/ep2.mp3', duration: '38:55', plays: 2800,
    type: 'podcast' as const, date: 'May 10, 2026',
  },
  {
    id: 'ep3', title: 'Identity in Christ — Not in Performance', podcastId: '1',
    artist: 'In for Christ Podcast', coverImage: '/images/podcast-ifc.jpg',
    audioUrl: '/audio/ep3.mp3', duration: '51:02', plays: 4100,
    type: 'podcast' as const, date: 'May 5, 2026',
  },
];

export default function PodcastsPage() {
  const { playTrack, pause, currentTrack, isPlaying } = usePlayer();
  const [activeCategory, setActiveCategory] = useState('All');

  const isCurrentlyPlaying = (id: string) =>
    currentTrack?.id === id && isPlaying;

  const handlePlay = (ep: PodcastEpisode) => {
    if (currentTrack?.id === ep.id && isPlaying) {
      pause();
    } else {
      // Use the proper PlayerContext playTrack method (renamed play -> playTrack in context)
      playTrack(ep);
    }
  };

  const shareLink = (platform: 'twitter' | 'facebook' | 'copy', item: Pick<PodcastEpisode, 'id' | 'title'>) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/podcasts/${item.id}` : '';
    const text = `Check out this episode: ${item.title}`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const filtered = activeCategory === 'All'
    ? episodes
    : episodes.filter(ep =>
        podcasts.find(p => p.id === ep.podcastId)?.category === activeCategory
      );

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <ScrollReveal>
          <div className="mb-16">
            <p className="text-[#C8A24A] text-sm tracking-widest mb-3 uppercase font-medium">AUDIO MINISTRY</p>
            <h1 className="text-5xl md:text-6xl font-cinzel font-bold tracking-tighter mb-4 text-shine">Podcasts</h1>
            <p className="text-gray-400 max-w-lg font-inter">
              Faith-filled conversations to grow, heal, and be equipped —
              wherever you are.
            </p>
          </div>
        </ScrollReveal>

        {/* Shows */}
        <ScrollReveal>
          <h2 className="text-2xl font-cinzel font-medium mb-8">Our Shows</h2>
        </ScrollReveal>

        <StaggerContainer staggerDelay={120} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {podcasts.map(show => (
            <div key={show.id} className="flex gap-5 bg-card rounded-2xl p-5 hover:bg-[#222] transition-colors cursor-pointer group relative border border-white/5 hover:border-gold/30">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={show.coverImage || "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070"} alt={show.title} width={80} height={80} className="object-cover" />
              </div>
              <div className="flex-1 min-w-0 pr-10">
                <h3 className="font-semibold font-cinzel text-lg mb-1">{show.title}</h3>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{show.description}</p>
                <p className="text-xs text-[#C8A24A] font-medium">{show.episodes} episodes · {show.category}</p>
              </div>

              {/* Share Button Show */}
              <div className="absolute top-4 right-4">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-2 text-gray-500 hover:text-gold hover:bg-gold/10 rounded-full transition-colors">
                      <Share2 size={18} />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="z-[100] min-w-[160px] bg-card border border-white/10 rounded-xl p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                      <DropdownMenu.Item 
                        onClick={() => shareLink('twitter', show)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold rounded-lg cursor-pointer transition-colors outline-none"
                      >
                        <Twitter size={16} /> Twitter
                      </DropdownMenu.Item>
                      <DropdownMenu.Item 
                        onClick={() => shareLink('facebook', show)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold rounded-lg cursor-pointer transition-colors outline-none"
                      >
                        <Facebook size={16} /> Facebook
                      </DropdownMenu.Item>
                      <DropdownMenu.Item 
                        onClick={() => shareLink('copy', show)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold rounded-lg cursor-pointer transition-colors outline-none"
                      >
                        <LinkIcon size={16} /> Copy Link
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
          ))}
        </StaggerContainer>

        {/* Category Filter */}
        <ScrollReveal>
          <div className="flex gap-3 mb-10 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? 'bg-[#C8A24A] text-black shadow-lg shadow-gold/20'
                    : 'bg-card text-gray-400 hover:text-white border border-white/5 hover:border-gold/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Episode List */}
        <div className="space-y-4">
          {filtered.map((ep, i) => {
            const playing = isCurrentlyPlaying(ep.id);
            return (
              <ScrollReveal key={ep.id} delay={i * 60}>
                <div className={`flex items-center gap-5 p-5 rounded-2xl transition-all group border ${
                  playing 
                    ? 'bg-[#C8A24A]/10 border-[#C8A24A]/30 shadow-[0_0_20px_rgba(200,162,74,0.1)]' 
                    : 'bg-card border-white/5 hover:border-gold/20 hover:bg-[#1E1E1E]'
                }`}>
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <Image src={ep.coverImage || "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070"} alt={ep.title} width={56} height={56} className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <p className={`font-semibold font-cinzel truncate text-lg ${playing ? 'text-[#C8A24A]' : 'text-white'}`}>
                      {ep.title}
                    </p>
                    <p className="text-sm text-gray-500 font-inter">{ep.artist} · {ep.date}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 font-mono">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-gold" /> {ep.duration}</span>
                      <span className="flex items-center gap-1"><Headphones size={12} className="text-gold" /> {ep.plays.toLocaleString()} plays</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Share Button Episode */}
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="p-2 text-gray-500 hover:text-gold hover:bg-gold/10 rounded-full transition-colors">
                          <Share2 size={18} />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content className="z-[100] min-w-[160px] bg-card border border-white/10 rounded-xl p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                          <DropdownMenu.Item 
                            onClick={() => shareLink('twitter', ep)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold rounded-lg cursor-pointer transition-colors outline-none"
                          >
                            <Twitter size={16} /> Twitter
                          </DropdownMenu.Item>
                          <DropdownMenu.Item 
                            onClick={() => shareLink('facebook', ep)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold rounded-lg cursor-pointer transition-colors outline-none"
                          >
                            <Facebook size={16} /> Facebook
                          </DropdownMenu.Item>
                          <DropdownMenu.Item 
                            onClick={() => shareLink('copy', ep)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold rounded-lg cursor-pointer transition-colors outline-none"
                          >
                            <LinkIcon size={16} /> Copy Link
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    <button
                      onClick={() => handlePlay(ep)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0 shadow-lg ${
                        playing
                          ? 'bg-[#C8A24A] text-black shadow-gold/30'
                          : 'bg-white/5 hover:bg-[#C8A24A] hover:text-black text-white hover:shadow-gold/30'
                      }`}
                    >
                      {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} className="ml-1" fill="currentColor" />}
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </div>
  );
}
