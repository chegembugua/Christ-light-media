import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'outline' | 'surface';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ 
  variant = 'gold', 
  size = 'md', 
  children, 
  className,
  ...props 
}: ButtonProps) {
  const variants = {
    gold: 'bg-gradient-to-r from-gold to-gold-dark text-black hover:from-gold-dark hover:to-gold transition-all shadow-lg shadow-gold/20',
    ghost: 'bg-white/5 text-white hover:bg-white/10 hover:text-gold transition-colors',
    outline: 'bg-transparent border border-white/10 text-white hover:border-gold/50 hover:text-gold transition-colors',
    surface: 'bg-surface border border-white/10 text-white hover:bg-[#1E1E1E] transition-colors',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      className={cn(
        "rounded-lg font-semibold tracking-wide transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
