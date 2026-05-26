import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'muted' | 'success' | 'draft';
  className?: string;
}

const variants = {
  gold: 'border-gold/30 bg-gold/10 text-gold',
  muted: 'border-white/10 bg-white/5 text-gray-400',
  success: 'border-green-500/30 bg-green-500/10 text-green-400',
  draft: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
};

export function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
