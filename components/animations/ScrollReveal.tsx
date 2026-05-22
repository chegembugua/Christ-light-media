'use client';

/* ── Lightweight, no-dependency ScrollReveal ─────────────────────────── */
import { useEffect, useRef, useCallback, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  threshold?: number;
  className?: string;
}

const DIRECTION_MAP: Record<string, { base: string; visible: string }> = {
  up:    { base: 'translate-y-7 opacity-0', visible: 'translate-y-0  opacity-100' },
  down:  { base: '-translate-y-7 opacity-0', visible: 'translate-y-0  opacity-100' },
  left:  { base: 'translate-x-7 opacity-0', visible: 'translate-x-0  opacity-100' },
  right: { base: '-translate-x-7 opacity-0', visible: 'translate-x-0  opacity-100' },
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  threshold = 0.15,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
          (entry.target as HTMLElement).classList.add('sr-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    [delay]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin: '0px 0px -40px 0px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect, threshold]);

  const dir = DIRECTION_MAP[direction];

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
        ${dir.base}
        sr-visible:${dir.visible}
        ${className ?? ''}
      `}
    >
      {children}
    </div>
  );
}

/* Re-export as named export for compatibility */
export { default as ScrollRevealComponent } from './ScrollReveal';
