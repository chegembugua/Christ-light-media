'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Mic2, Heart, SkipForward, SkipBack, Share2 } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import ScrollReveal from '@/components/animations/ScrollReveal';
import PageHeader from '@/components/layout/PageHeader';

const WORSHIP_SESSIONS = [
  {
    id: 'w1', title: 'Throne Room Encounter (Live)', artist: 'Christ Light Worship',
    duration: '1:12:45', coverImage: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2000', audioUrl: '/audio/worship1.mp3', type: 'worship' as const
  },
  {
    id: 'w2', title: 'Atmosphere of Glory', artist: 'Grace Melody',
    duration: '45:20', coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070', audioUrl: '/audio/worship2.mp3', type: 'worship' as const
  },
  {
    id: 'w3', title: 'Deep Calls to Deep', artist: 'The Lighthouse Band',
    duration: '58:10', coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070', audioUrl: '/audio/worship3.mp3', type: 'worship' as const
  },
  {
    id: 'w4', title: 'Prophetic Worship Vol. 1', artist: 'David Kimani',
    duration: '1:05:30', coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070', audioUrl: '/audio/worship4.mp3', type: 'worship' as const
  },
];

export default function WorshipPage() {
  const { playTrack, pause, currentTrack, isPlaying } = usePlayer();
  const featured = WORSHIP_SESSIONS[0];

  const isCurrentlyPlaying = (id: string) => currentTrack?.id === id && isPlaying;

  const handlePlay = (track: typeof WORSHIP_SESSIONS[0]) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pause();
    } else {
      playTrack({ id: track.id, title: track.title, artist: track.artist, coverImage: track.coverImage, audioUrl: track.audioUrl, type: track.type });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader 
        label="SPIRIT & TRUTH" 
        title="Worship" 
        description="Enter His presence through extended worship sessions, live recordings, and prophetic praise." 
      />

      {/* ── Featured Session Player ───────────────────────────────────── */}
      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group shadow-2xl shadow-gold/5">
              <Image 
                src={featured.coverImage} 
                alt={featured.title} 
                fill 
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              
              <div className="relative z-10 text-center px-6">
                <Mic2 size={32} className="text-gold mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl md:text-5xl font-cinzel font-bold mb-4">{featured.title}</h2>
                <p className="text-gray-300 font-inter mb-8 tracking-wide uppercase text-sm font-bold">{featured.artist}</p>
                
                <div className="flex flex-col items-center gap-8">
                  <div className="flex items-center gap-8">
                    <button className="text-white/60 hover:text-white transition-colors">
                      <SkipBack size={24} fill="currentColor" />
                    </button>
                    <button 
                      onClick={() => handlePlay(featured)}
                      className="w-20 h-20 bg-gold rounded-full flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(200,162,74,0.4)] text-black"
                    >
                      {isCurrentlyPlaying(featured.id) ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-2" fill="currentColor" />}
                    </button>
                    <button className="text-white/60 hover:text-white transition-colors">
                      <SkipForward size={24} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Playlist ─────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <ScrollReveal>
            <h3 className="text-2xl font-cinzel font-medium mb-10">Extended Sessions</h3>
          </ScrollReveal>

          <div className="space-y-2">
            {WORSHIP_SESSIONS.map((session, i) => {
              const playing = isCurrentlyPlaying(session.id);
              return (
                <ScrollReveal key={session.id} delay={i * 50}>
                  <div className={`flex items-center gap-4 p-4 rounded-xl transition-all group border ${playing ? 'bg-gold/10 border-gold/30' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'}`}>
                    
                    {/* Play Button Overlay on Image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 cursor-pointer" onClick={() => handlePlay(session)}>
                      <Image src={session.coverImage} alt={session.title} fill className="object-cover" />
                      <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {playing ? <Pause size={20} fill="currentColor" className="text-gold" /> : <Play size={20} fill="currentColor" className="text-white ml-0.5" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <p className={`font-semibold font-cinzel text-lg truncate mb-1 ${playing ? 'text-gold' : 'text-white'}`}>{session.title}</p>
                      <p className="text-sm text-gray-500 font-inter">{session.artist}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <button className="text-gray-600 hover:text-white transition-colors hidden sm:block">
                        <Share2 size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gold transition-colors hidden sm:block">
                        <Heart size={18} />
                      </button>
                      <span className="text-sm font-mono text-gray-500 w-16 text-right">
                        {session.duration}
                      </span>
                    </div>
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
