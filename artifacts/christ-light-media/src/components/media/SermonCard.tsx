
;
import { Calendar, Clock, Headphones, Pause, Play } from 'lucide-react';

type SermonCardProps = {
  title: string;
  speaker: string;
  coverImage: string;
  category: string;
  duration: string;
  playCount: number;
  date: string | Date;
  onPlay: () => void;
  isPlaying?: boolean;
};

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SermonCard({
  title,
  speaker,
  coverImage,
  category,
  duration,
  playCount,
  date,
  onPlay,
  isPlaying = false,
}: SermonCardProps) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:bg-[#1E1E1E] hover:shadow-2xl hover:shadow-gold/10 ${
        isPlaying ? 'border-gold/40 shadow-lg shadow-gold/10' : 'border-white/10 hover:border-gold/30'
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={coverImage || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070'}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
          {category}
        </div>
        <div className="absolute bottom-4 left-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {duration}
        </div>
        <button
          type="button"
          onClick={onPlay}
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-black shadow-lg shadow-gold/30 transition hover:scale-105 active:scale-95"
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
        >
          {isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} className="ml-0.5" fill="currentColor" />
          )}
        </button>
      </div>

      <div className="space-y-3 p-5">
        <h3 className="line-clamp-2 font-cinzel text-xl font-semibold leading-tight text-white transition group-hover:text-gold">
          {title}
        </h3>
        <p className="text-sm text-gray-400">{speaker}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-gold/70" /> {duration}
          </span>
          <span className="flex items-center gap-1">
            <Headphones size={12} className="text-gold/70" /> {playCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-gold/70" /> {formatDate(date)}
          </span>
        </div>
      </div>
    </article>
  );
}
