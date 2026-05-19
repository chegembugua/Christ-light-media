import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in-scale' | 'light-reveal';
  delay?: number;
}

export default function ScrollReveal({ 
  children, 
  className = "", 
  animation = 'fade-up',
  delay = 0 
}: ScrollRevealProps) {
  
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.15,
    triggerOnce: true
  });

  return (
    <div
      ref={ref as any}
      className={`animate-on-scroll ${animation} ${isIntersecting ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
