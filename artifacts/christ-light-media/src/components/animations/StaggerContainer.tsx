
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
  const observerRef = useRef<IntersectionObserver | null>(null);

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
          observerRef.current?.unobserve(entry.target);
        }
      });
    },
    [staggerDelay]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px',
    });
    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [handleIntersect]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
