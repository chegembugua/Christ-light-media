
import { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  type: 'music' | 'podcast' | 'sermon' | 'radio' | 'worship';
  isLive?: boolean;
  listeners?: number;
  duration?: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  audioDuration: number;
  playTrack: (track: Track) => void;
  playLive: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  close: () => void;
  seek: (percent: number) => void;
  togglePlay: () => void;
  isRadioMode: boolean;
  listeners: number;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [listeners, setListeners] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setupAudio = (url: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.pause();
    audio.src = url;
    audio.load();
    audio.play().catch(err => console.error("Playback error:", err));
    setIsPlaying(true);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setProgress(0);
    };
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setProgress(0);
    if (track.listeners) setListeners(track.listeners);
    setupAudio(track.audioUrl);
  };

  const playLive = (track: Track) => {
    const liveTrack = { ...track, isLive: true, type: 'radio' as const };
    setCurrentTrack(liveTrack);
    setIsPlaying(true);
    setProgress(0);
    if (track.listeners) setListeners(track.listeners);
    setupAudio(track.audioUrl);
  };

  const pause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  const resume = () => {
    if (currentTrack) {
      setIsPlaying(true);
      audioRef.current?.play().catch(err => console.error("Playback error:", err));
    }
  };

  const togglePlay = () => {
    if (isPlaying) pause();
    else resume();
  };

  const close = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
    audioRef.current?.pause();
    setProgress(0);
  };

  const seek = (percent: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (percent / 100) * audioRef.current.duration;
      setProgress(percent);
    }
  };

  const isRadioMode = currentTrack?.type === 'radio' || !!currentTrack?.isLive;

  return (
    <PlayerContext.Provider value={{
      currentTrack, 
      isPlaying, 
      progress, 
      audioDuration,
      playTrack, 
      playLive, 
      pause, 
      resume, 
      close, 
      seek, 
      togglePlay,
      isRadioMode,
      listeners
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
