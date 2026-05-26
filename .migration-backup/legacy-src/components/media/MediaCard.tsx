import { Play } from 'lucide-react';

interface MediaCardProps {
  title: string;
  speaker?: string;
  coverImage: string;
  category: string;
  duration?: string;
  playCount?: number;
  onPlay: () => void;
  isPlaying?: boolean;
}

export function MediaCard({
  title,
  speaker,
  coverImage,
  category,
  duration,
  playCount,
  onPlay,
  isPlaying = false
}: MediaCardProps) {
  return (
    <div className="group relative bg-[#1A1A1A] rounded-3xl overflow-hidden transition-all duration-500 glass hover:border-gold/30 hover:shadow-[0_0_20px_rgba(200,162,74,0.15)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={coverImage} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
        
        <button 
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-sacred-float"
        >
          <div className={`w-16 h-16 rounded-full bg-[#C8A24A] flex items-center justify-center accent-glow ${isPlaying ? 'animate-spirit-spin' : ''}`}>
            <Play className={`text-black w-8 h-8 ml-1 fill-current ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
          </div>
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C8A24A]">{category}</span>
          {duration && <span className="text-xs text-gray-400 font-mono">{duration}</span>}
        </div>

        <h3 className="font-serif text-xl leading-tight mb-2 line-clamp-2 text-white">{title}</h3>
        {speaker && <p className="text-sm text-gray-400 font-light">{speaker}</p>}

        {playCount !== undefined && (
          <p className="text-xs text-gray-500 mt-4 font-mono tracking-wider">{playCount.toLocaleString()} PLAYS</p>
        )}
      </div>
    </div>
  );
}

export default MediaCard;
