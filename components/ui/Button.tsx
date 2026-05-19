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
    gold: 'bg-gold text-black hover:bg-gold-dark shadow-lg shadow-gold/20',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
    outline: 'bg-transparent border border-white/10 text-white hover:border-gold/50',
    surface: 'bg-surface border border-white/5 text-white hover:bg-[#1A1A1A]',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button 
      className={cn(
        "rounded-full font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
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
