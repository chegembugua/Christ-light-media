'use client';

import Image from 'next/image';
import { Clock, Headphones, Pause, Play, Star } from 'lucide-react';

type MusicCardProps = {
  title: string;
  artist: string;
  coverImage: string;
  genre: string;
  duration: string;
  playCount: number;
  onPlay: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  isPlaying?: boolean;
};

export function MusicCard({
  title,
  artist,
  coverImage,
  genre,
  duration,
  playCount,
  onPlay,
  onFavorite,
  isFavorite = false,
  isPlaying = false,
}: MusicCardProps) {
  return (
    <article
      className={`group relative rounded-2xl border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-[#1E1E1E] hover:shadow-2xl hover:shadow-gold/10 ${
        isPlaying ? 'border-gold/40 shadow-lg shadow-gold/10' : 'border-white/10'
      } ${isFavorite ? 'shadow-gold/10' : ''}`}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onFavorite?.();
        }}
        className={`absolute right-5 top-5 z-20 rounded-full bg-black/55 p-2 backdrop-blur transition ${
          isFavorite ? 'text-gold' : 'text-gray-400 hover:text-gold'
        }`}
        aria-label={isFavorite ? `Unfavorite ${title}` : `Favorite ${title}`}
      >
        <Star size={17} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={coverImage || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070'}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-75"
        />
        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />
        <button
          type="button"
          onClick={onPlay}
          className={`absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-black shadow-[0_0_35px_rgba(200,162,74,0.45)] transition active:scale-95 ${
            isPlaying ? 'scale-100 opacity-100' : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
          }`}
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
        >
          {isPlaying ? (
            <Pause size={26} fill="currentColor" />
          ) : (
            <Play size={26} className="ml-1" fill="currentColor" />
          )}
        </button>
      </div>

      <div className="space-y-2 px-1 pt-4">
        <h3 className={`line-clamp-1 font-semibold ${isPlaying ? 'text-gold' : 'text-white'}`}>
          {title}
        </h3>
        <p className="line-clamp-1 text-sm text-gray-400">{artist}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="rounded-full bg-gold/10 px-2 py-0.5 font-semibold text-gold">
            {genre}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {duration}
          </span>
          <span className="flex items-center gap-1">
            <Headphones size={12} /> {playCount.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}
