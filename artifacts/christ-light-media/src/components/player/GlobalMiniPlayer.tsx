
import { Play, Pause, X, Volume2, Maximize2, SkipForward, SkipBack, Share2 } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
;
import { cn } from '@/lib/utils';

export default function GlobalMiniPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    close,
    progress,
    audioDuration,
    seek,
    isRadioMode,
    listeners
  } = usePlayer();

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    seek(percent);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] animate-fadeUp">
      {/* Progress Bar Top */}
      {!isRadioMode && (
        <div 
          className="h-1 bg-white/5 cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gold relative group-hover:h-1.5 transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(200,162,74,0.5)]" />
          </div>
        </div>
      )}

      <div className="bg-[#0A0A0A]/95 backdrop-blur-2xl border-t border-white/5 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between gap-8">
          
          {/* Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xl shrink-0 group relative">
               <img 
                src={currentTrack.coverImage || "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070"} 
                alt={currentTrack.title} 
                width={56} 
                height={56} 
                className="object-cover"
               />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Share2 size={16} className="text-white" />
               </div>
            </div>
            <div className="min-w-0">
               <h4 className="text-white font-cinzel font-semibold truncate group-hover:text-gold transition-colors">
                 {currentTrack.title}
               </h4>
               <p className="text-xs text-gray-500 font-inter truncate">
                 {currentTrack.artist} 
                 {isRadioMode && <span className="ml-2 text-gold font-bold">● LIVE</span>}
               </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-6">
              <button className="text-gray-500 hover:text-white transition-colors">
                <SkipBack size={20} />
              </button>
              <button 
                onClick={togglePlay}
                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
              </button>
              <button className="text-gray-500 hover:text-white transition-colors">
                <SkipForward size={20} />
              </button>
            </div>
            {!isRadioMode && (
              <div className="flex justify-between w-full max-w-[240px] text-[10px] font-mono text-gray-600">
                <span>{formatTime((progress / 100) * audioDuration)}</span>
                <span>{formatTime(audioDuration)}</span>
              </div>
            )}
          </div>

          {/* Volume & Close */}
          <div className="flex items-center gap-6 flex-1 justify-end">
            <div className="hidden md:flex items-center gap-3 w-32">
              <Volume2 size={18} className="text-gray-500" />
              <div className="flex-1 h-1 bg-white/5 rounded-full">
                <div className="w-[70%] h-full bg-gray-400 rounded-full" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:text-white transition-colors">
                 <Maximize2 size={18} />
              </button>
              <button 
                onClick={close}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
