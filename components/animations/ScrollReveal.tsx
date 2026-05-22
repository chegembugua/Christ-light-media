'use client';

/* ── Lightweight, no-dependency ScrollReveal ─────────────────────────── */
import { useEffect, useRef, useCallback, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  animation?: 'fade-up' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale-in';
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

const ANIMATION_MAP: Record<string, { base: string; visible: string }> = {
  'fade-up':    { base: 'translate-y-7 opacity-0', visible: 'translate-y-0  opacity-100' },
  'slide-up':   { base: 'translate-y-7 opacity-0', visible: 'translate-y-0  opacity-100' },
  'slide-down': { base: '-translate-y-7 opacity-0', visible: 'translate-y-0  opacity-100' },
  'slide-left': { base: 'translate-x-7 opacity-0', visible: 'translate-x-0  opacity-100' },
  'slide-right':{ base: '-translate-x-7 opacity-0', visible: 'translate-x-0  opacity-100' },
  'scale-in':   { base: 'scale-95 opacity-0', visible: 'scale-100 opacity-100' },
};

export default function ScrollReveal({
  children,
  animation,
  direction = 'up',
  delay = 0,
  threshold = 0.15,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
          (entry.target as HTMLElement).classList.add('sr-visible');
          observerRef.current?.unobserve(entry.target);
        }
      });
    },
    [delay]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin: '0px 0px -40px 0px',
    });
    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [handleIntersect, threshold]);

  const anim = animation ? ANIMATION_MAP[animation] : DIRECTION_MAP[direction];

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
        ${anim.base}
        sr-visible:${anim.visible}
        ${className ?? ''}
      `}
    >
      {children}
    </div>
  );
}