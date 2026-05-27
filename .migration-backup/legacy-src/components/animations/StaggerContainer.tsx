import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { ReactNode } from 'react';
import React from 'react';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  animation?: 'fade-up' | 'fade-in-scale' | 'light-reveal';
}

export default function StaggerContainer({
  children,
  className = "",
  staggerDelay = 100,
  initialDelay = 0,
  animation = 'fade-up'
}: StaggerContainerProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.15,
    triggerOnce: true
  });

  return (
    <div ref={ref as any} className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        return (
          <div
            className={`animate-on-scroll ${animation} ${isIntersecting ? 'visible' : ''}`}
            style={{ transitionDelay: `${initialDelay + index * staggerDelay}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
