import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
  hover?: boolean;
}

const variants = {
  default: 'bg-card p-6 md:p-8 rounded-2xl border border-white/5',
  featured: 'bg-card p-8 md:p-10 rounded-3xl border border-gold/10 shadow-xl shadow-gold/5',
  compact: 'bg-card p-4 md:p-5 rounded-xl border border-white/5',
};

export function Card({
  children,
  className,
  variant = 'default',
  hover = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        variants[variant],
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/10 hover:bg-[#1E1E1E]',
        'group relative overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
      {hover && (
        <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-gold/0 rounded-tl-full blur-2xl group-hover:bg-gold/5 transition-all duration-500 pointer-events-none" />
      )}
    </div>
  );
}
