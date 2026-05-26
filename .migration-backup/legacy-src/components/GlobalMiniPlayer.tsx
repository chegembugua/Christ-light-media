import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Pause, X, Users, Volume2, ListMusic } from 'lucide-react';
import { radioSocketService } from '../services/radioSocketService';

export default function GlobalMiniPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    close,
    isRadioMode, 
    listeners: contextListeners,
    progress,
    audioDuration,
    seek
  } = usePlayer();

  const [localListeners, setLocalListeners] = useState(0);
  const isCountedRef = useRef(false);

  // Handle live radio specifics (socket integration)
  useEffect(() => {
    let unsubscribeCount = () => {};
    if (isRadioMode) {
      unsubscribeCount = radioSocketService.onListenerCountUpdate((count) => {
        setLocalListeners(count);
      });
    }
    return () => unsubscribeCount();
  }, [isRadioMode]);

  useEffect(() => {
    if (isRadioMode && isPlaying && !isCountedRef.current) {
      radioSocketService.joinRadioStream();
      isCountedRef.current = true;
    } else if ((!isRadioMode || !isPlaying) && isCountedRef.current) {
      radioSocketService.leaveRadioStream();
      isCountedRef.current = false;
    }
  }, [isRadioMode, isPlaying]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    seek(percent);
  };

  if (!currentTrack) return null;

  const displayListeners = isRadioMode ? (localListeners || contextListeners) : 0;
  const formatListeners = (count: number) => 
    count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();

  const progressPercent = progress || 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-[#C8A24A]/30 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] animate-fade-up-sacred">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center gap-4">
        
        {/* Cover + Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 ring-1 ring-white/10">
            <img 
              src={currentTrack.coverImage} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            {isRadioMode && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1.5 py-px rounded-bl font-bold shadow-lg">
                LIVE
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-white truncate pr-2">{currentTrack.title}</p>
            <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Live Radio Indicator + Listener Count */}
        {isRadioMode && (
          <div className="hidden sm:flex items-center gap-3 bg-white/5 px-5 py-2 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-emerald-400">
              <Users size={18} />
              <span className="font-medium text-sm">
                {formatListeners(displayListeners)} listening
              </span>
            </div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
        )}

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={togglePlay}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${
              isRadioMode 
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' 
                : 'bg-[#C8A24A] hover:bg-amber-500 text-black'
            }`}
          >
            {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
          </button>
        </div>

        {/* Progress / Status Bar */}
        <div className="hidden md:flex flex-1 mx-6 items-center gap-4">
          {isRadioMode ? (
            <div className="flex-1 text-center">
              <p className="text-xs tracking-[0.2em] text-emerald-400 font-bold flex items-center justify-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CHRIST LIGHT RADIO • LIVE BROADCAST
              </p>
            </div>
          ) : (
            <>
              <span className="text-[10px] text-gray-500 font-mono w-10 text-right">{formatTime((progress / 100) * audioDuration)}</span>
              <div 
                className="flex-1 h-1 bg-white/10 rounded-full relative cursor-pointer group hover:h-1.5 transition-all"
                onClick={handleProgressClick}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-[#C8A24A] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-gold"
                  style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
              <span className="text-[10px] text-gray-500 font-mono w-10">{formatTime(audioDuration)}</span>
            </>
          )}
        </div>

        {/* Extra controls (Right) */}
        <div className="hidden lg:flex items-center gap-3 md:w-48 justify-end mr-4">
          <Volume2 className="w-4 h-4 text-gray-500" />
          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={close}
          className="text-gray-400 hover:text-white p-2 transition-colors hover:bg-white/5 rounded-full"
        >
          <X size={22} />
        </button>
      </div>

      {/* Mobile progress bar */}
      {!isRadioMode && (
        <div className="h-0.5 bg-white/5 w-full sm:hidden">
          <div 
            className="h-full bg-[#C8A24A] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
