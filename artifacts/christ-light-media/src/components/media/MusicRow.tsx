
;
import { Clock, Headphones, Pause, Play, Star } from 'lucide-react';

type MusicRowProps = {
  title: string;
  artist: string;
  genre: string;
  duration: string;
  playCount: number;
  coverImage: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
  onPlay: () => void;
  onFavorite?: () => void;
};

export function MusicRow({
  title,
  artist,
  genre,
  duration,
  playCount,
  coverImage,
  isPlaying = false,
  isFavorite = false,
  onPlay,
  onFavorite,
}: MusicRowProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-3 transition-all ${
        isPlaying
          ? 'border-gold/40 bg-gold/10 shadow-[0_0_20px_rgba(200,162,74,0.1)]'
          : 'border-white/10 bg-card hover:border-gold/20 hover:bg-white/5'
      }`}
    >
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={coverImage || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`truncate font-semibold ${isPlaying ? 'text-gold' : 'text-white'}`}>
            {title}
          </h3>
          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">
            {genre}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-400">{artist}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-gold/70" /> {duration}
          </span>
          <span className="flex items-center gap-1">
            <Headphones size={12} className="text-gold/70" /> {playCount.toLocaleString()} plays
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onFavorite}
        className={`hidden rounded-full p-2 transition sm:inline-flex ${
          isFavorite ? 'text-gold' : 'text-gray-500 hover:text-gold'
        }`}
        aria-label={isFavorite ? `Unfavorite ${title}` : `Favorite ${title}`}
      >
        <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      <button
        type="button"
        onClick={onPlay}
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition active:scale-95 ${
          isPlaying
            ? 'bg-gold text-black shadow-lg shadow-gold/30'
            : 'bg-white/5 text-white hover:bg-gold hover:text-black'
        }`}
        aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
      >
        {isPlaying ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} className="ml-0.5" fill="currentColor" />
        )}
      </button>
    </div>
  );
}
