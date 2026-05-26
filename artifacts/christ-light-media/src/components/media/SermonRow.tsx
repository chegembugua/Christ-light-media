
;
import { Calendar, Clock, Headphones, Pause, Play } from 'lucide-react';

type SermonRowProps = {
  title: string;
  speaker: string;
  category: string;
  duration: string;
  playCount: number;
  date: Date;
  coverImage: string;
  isPlaying?: boolean;
  onPlay: () => void;
};

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SermonRow({
  title,
  speaker,
  category,
  duration,
  playCount,
  date,
  coverImage,
  isPlaying = false,
  onPlay,
}: SermonRowProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
        isPlaying
          ? 'border-gold/40 bg-gold/10 shadow-[0_0_20px_rgba(200,162,74,0.1)]'
          : 'border-white/10 bg-card hover:border-gold/20 hover:bg-white/5'
      }`}
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={coverImage || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070'}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`truncate font-semibold ${isPlaying ? 'text-gold' : 'text-white'}`}>
            {title}
          </h3>
          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">
            {category}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-400">{speaker}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-gold/70" /> {duration}
          </span>
          <span className="flex items-center gap-1">
            <Headphones size={12} className="text-gold/70" /> {playCount.toLocaleString()} plays
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-gold/70" /> {formatDate(date)}
          </span>
        </div>
      </div>

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
