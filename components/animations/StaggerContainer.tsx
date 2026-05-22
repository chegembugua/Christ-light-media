'use client';

/* ── Lightweight StaggerContainer (no external dependency) ───────────── */
import { useEffect, useRef, useCallback, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export default function StaggerContainer({
  children,
  staggerDelay = 80,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const children = Array.from(el.children) as HTMLElement[];
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * staggerDelay}ms`;
            child.classList.add('stagger-visible');
          });
          observer.unobserve(entry.target);
        }
      });
    },
    [staggerDelay]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
