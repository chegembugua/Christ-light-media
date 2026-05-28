
import { useEffect, useRef, useState } from 'react';
import { formatCountdown, timeUntilEvent } from '@/lib/utils/countdown';

type WorshipEvent = {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  durationMinutes: number;
  coverImage: string;
  audioUrl: string;
  leaders: string[];
};

type LiveWorshipCountdownProps = {
  event: WorshipEvent;
  onEventStarted?: () => void;
};

export function LiveWorshipCountdown({ event, onEventStarted }: LiveWorshipCountdownProps) {
  const [display, setDisplay] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const onStartedRef = useRef(false);
  const target = useRef(new Date(event.scheduledAt));

  useEffect(() => {
    if (onStartedRef.current) return;

    const tick = () => {
      const remainingMs = timeUntilEvent(target.current);
      const totalSeconds = remainingMs / 1000;
      const isStarted = remainingMs <= 0;

      if (isStarted) {
        setIsLive(true);
        setDisplay('');
        if (!onStartedRef.current) {
          onStartedRef.current = true;
          onEventStarted?.();
        }
        return;
      }

      setIsLive(false);
      setDisplay(formatCountdown(remainingMs));
      setIsUrgent(totalSeconds < 300 && totalSeconds > 0);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [event.scheduledAt, onEventStarted]);

  return (
    <div className="text-center py-4">
      {isLive ? (
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-red-500">
              Live Now
            </span>
          </div>
          <p
            className="font-cinzel font-bold leading-none tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#C8A24A' }}
          >
            WORSHIP IS LIVE NOW
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Worship starts in
          </p>
          <p
            className={`font-cinzel font-bold leading-none tracking-tight tabular-nums transition-all ${
              isUrgent ? 'animate-pulse text-red-400' : ''
            }`}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#C8A24A' }}
          >
            {display || '--:--:--'}
          </p>
        </div>
      )}
    </div>
  );
}
