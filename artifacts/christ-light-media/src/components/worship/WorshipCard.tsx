
;
import { Clock, Headphones, Pause, Play } from 'lucide-react';
import { EncounterBadge } from './EncounterBadge';

type WorshipCardProps = {
  title: string;
  leaders: string;
  coverImage: string;
  category: string;
  duration: string;
  encounterType?: string;
  playCount: number;
  onPlay: () => void;
  isPlaying?: boolean;
};

export function WorshipCard({
  title,
  leaders,
  coverImage,
  category,
  duration,
  encounterType,
  playCount,
  onPlay,
  isPlaying = false,
}: WorshipCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-[#1E1E1E] hover:shadow-2xl hover:shadow-gold/10 ${
        isPlaying ? 'border-gold/40 shadow-lg shadow-gold/10' : 'border-white/10'
      }`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={coverImage || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
            {category}
          </span>
        </div>

        {encounterType && (
          <div className="absolute bottom-4 left-4">
            <EncounterBadge type={encounterType} />
          </div>
        )}

        <button
          type="button"
          onClick={onPlay}
          className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-black shadow-[0_0_30px_rgba(200,162,74,0.45)] transition-all active:scale-95 ${
            isPlaying ? 'scale-100 opacity-100' : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
          }`}
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
        >
          {isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} className="ml-1" fill="currentColor" />
          )}
        </button>
      </div>

      <div className="space-y-2 p-5">
        <h3 className={`line-clamp-2 font-semibold leading-snug transition-colors ${
          isPlaying ? 'text-gold' : 'text-white group-hover:text-gold'
        }`}>
          {title}
        </h3>
        <p className="text-sm text-gray-400">{leaders}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-gold/70" /> {duration}
          </span>
          <span className="flex items-center gap-1">
            <Headphones size={12} className="text-gold/70" /> {playCount.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}
