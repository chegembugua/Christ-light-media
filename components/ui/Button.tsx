import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'outline' | 'surface' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
}

export function Button({
  variant = 'gold',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg select-none';

  const variants: Record<string, string> = {
    gold:    'text-black hover:scale-[1.02] hover:shadow-gold',
    ghost:   'bg-white/5 text-white hover:bg-white/10 hover:text-gold',
    outline: 'bg-transparent text-white hover:border-gold/50 hover:text-gold hover:bg-gold/5',
    surface: 'bg-[#181818] text-white hover:bg-[#202020]',
    danger:  'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    gold: {
      background: 'linear-gradient(135deg, #C8A24A 0%, #B38A3D 100%)',
      boxShadow: '0 0 16px rgba(200,162,74,0.2)',
    },
    outline: { border: '1px solid rgba(255,255,255,0.12)' },
    surface: { border: '1px solid rgba(255,255,255,0.06)' },
  };

  const sizes: Record<string, string> = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-sm',
    xl: 'px-9 py-4 text-base',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
}
