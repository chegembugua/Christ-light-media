'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Clock, Headphones, Heart, Disc3, Shuffle, ListMusic } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';

const GENRES = ['All', 'Worship', 'Gospel', 'Contemporary', 'Hymns', 'Afro-Gospel', 'Instrumental'];

const FEATURED_ARTISTS = [
  { name: 'Grace Melody', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', tracks: 12 },
  { name: 'The Lighthouse Band', avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=200', tracks: 24 },
  { name: 'David Kimani', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', tracks: 18 },
  { name: 'Mercy & Truth', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', tracks: 9 },
];

const ALBUMS = [
  {
    id: 'alb1', title: 'Throne Room', artist: 'Grace Melody', genre: 'Worship',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070', trackCount: 10,
  },
  {
    id: 'alb2', title: 'Arise', artist: 'The Lighthouse Band', genre: 'Gospel',
    coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070', trackCount: 8,
  },
  {
    id: 'alb3', title: 'Psalm 23', artist: 'David Kimani', genre: 'Contemporary',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070', trackCount: 12,
  },
];

const TRACKS = [
  { id: 'tr1', title: 'Holy Ground', artist: 'Grace Melody', genre: 'Worship', duration: '4:32', plays: 45200, coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070', audioUrl: '/audio/track1.mp3', type: 'music' as const },
  { id: 'tr2', title: 'Your Name Is Higher', artist: 'The Lighthouse Band', genre: 'Gospel', duration: '5:18', plays: 38900, coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070', audioUrl: '/audio/track2.mp3', type: 'music' as const },
  { id: 'tr3', title: 'Shepherd of My Soul', artist: 'David Kimani', genre: 'Contemporary', duration: '3:55', plays: 52400, coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070', audioUrl: '/audio/track3.mp3', type: 'music' as const },
  { id: 'tr4', title: 'Hallelujah (Live)', artist: 'Mercy & Truth', genre: 'Worship', duration: '6:12', plays: 28100, coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070', audioUrl: '/audio/track4.mp3', type: 'music' as const },
  { id: 'tr5', title: 'Grace Abounds', artist: 'Grace Melody', genre: 'Hymns', duration: '4:05', plays: 33700, coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070', audioUrl: '/audio/track5.mp3', type: 'music' as const },
  { id: 'tr6', title: 'Draw Me Close', artist: 'The Lighthouse Band', genre: 'Contemporary', duration: '4:48', plays: 41300, coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070', audioUrl: '/audio/track6.mp3', type: 'music' as const },
  { id: 'tr7', title: 'Milele (Forever)', artist: 'David Kimani', genre: 'Afro-Gospel', duration: '5:30', plays: 67800, coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070', audioUrl: '/audio/track7.mp3', type: 'music' as const },
  { id: 'tr8', title: 'Be Still My Soul', artist: 'Mercy & Truth', genre: 'Instrumental', duration: '7:15', plays: 19400, coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070', audioUrl: '/audio/track8.mp3', type: 'music' as const },
];

export default function MusicPage() {
  const { playTrack, pause, currentTrack, isPlaying } = usePlayer();
  const [activeGenre, setActiveGenre] = useState('All');

  const isCurrentlyPlaying = (id: string) => currentTrack?.id === id && isPlaying;

  const handlePlay = (track: typeof TRACKS[0]) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pause();
    } else {
      playTrack({ id: track.id, title: track.title, artist: track.artist, coverImage: track.coverImage, audioUrl: track.audioUrl, type: track.type });
    }
  };

  const filtered = activeGenre === 'All' ? TRACKS : TRACKS.filter(t => t.genre === activeGenre);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader label="LISTEN" title="Music" description="Worship and gospel music to uplift your spirit and draw you closer to God." />

      {/* ── Featured Albums ─────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-10">
              <Disc3 size={20} className="text-gold" />
              <h2 className="text-2xl font-cinzel font-medium">Featured Albums</h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ALBUMS.map((album) => (
              <Card key={album.id} className="p-0 overflow-hidden cursor-pointer">
                <div className="relative aspect-square">
                  <Image src={album.coverImage} alt={album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(200,162,74,0.4)] transform scale-75 group-hover:scale-100 transition-transform">
                      <Play size={28} className="text-black ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-cinzel font-bold mb-1">{album.title}</h3>
                    <p className="text-sm text-gray-400 font-inter">{album.artist} · {album.trackCount} tracks</p>
                  </div>
                </div>
              </Card>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Featured Artists ────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-cinzel font-medium mb-10">Featured Artists</h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURED_ARTISTS.map((artist) => (
              <div key={artist.name} className="group text-center cursor-pointer">
                <div className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-2 border-white/5 group-hover:border-gold/40 transition-all duration-500 mb-4 shadow-lg shadow-black/50">
                  <Image src={artist.avatar} alt={artist.name} width={128} height={128} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-cinzel font-semibold text-sm group-hover:text-gold transition-colors">{artist.name}</h3>
                <p className="text-xs text-gray-500 mt-1 font-inter">{artist.tracks} tracks</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── All Tracks ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
              <div className="flex items-center gap-3">
                <ListMusic size={20} className="text-gold" />
                <h2 className="text-3xl font-cinzel font-medium">All Tracks</h2>
              </div>
              <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors">
                <Shuffle size={16} /> Shuffle All
              </button>
            </div>
          </ScrollReveal>

          {/* Genre Pills */}
          <ScrollReveal>
            <div className="flex gap-3 mb-10 flex-wrap">
              {GENRES.map((genre) => (
                <button key={genre} onClick={() => setActiveGenre(genre)} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeGenre === genre ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'bg-card text-gray-400 hover:text-white border border-white/5 hover:border-gold/30'}`}>
                  {genre}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Track List */}
          <div className="space-y-3">
            {filtered.map((track, i) => {
              const playing = isCurrentlyPlaying(track.id);
              return (
                <ScrollReveal key={track.id} delay={i * 50}>
                  <div className={`flex items-center gap-4 p-4 rounded-xl transition-all group border ${playing ? 'bg-gold/10 border-gold/30' : 'bg-card/50 border-white/5 hover:border-gold/20 hover:bg-card'}`}>
                    {/* Number / Play */}
                    <div className="w-8 text-center flex-shrink-0">
                      <span className={`text-sm font-mono group-hover:hidden ${playing ? 'text-gold' : 'text-gray-600'}`}>{i + 1}</span>
                      <button onClick={() => handlePlay(track)} className="hidden group-hover:block text-gold">
                        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                      </button>
                    </div>

                    {/* Cover */}
                    <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={track.coverImage} alt={track.title} width={44} height={44} className="object-cover w-full h-full" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${playing ? 'text-gold' : 'text-white'}`}>{track.title}</p>
                      <p className="text-xs text-gray-500 truncate font-inter">{track.artist}</p>
                    </div>

                    {/* Genre badge */}
                    <span className="hidden md:inline-flex text-[10px] text-gray-500 bg-white/5 px-3 py-1 rounded-full">{track.genre}</span>

                    {/* Like */}
                    <button className="p-1.5 text-gray-600 hover:text-gold transition-colors hidden md:block">
                      <Heart size={16} />
                    </button>

                    {/* Plays */}
                    <span className="hidden md:flex items-center gap-1 text-xs text-gray-600 font-mono w-20 justify-end">
                      <Headphones size={12} /> {(track.plays / 1000).toFixed(1)}k
                    </span>

                    {/* Duration */}
                    <span className="flex items-center gap-1 text-xs text-gray-600 font-mono w-12 justify-end">
                      <Clock size={12} /> {track.duration}
                    </span>
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
