import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightElement, className, type, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3.5 text-sm transition-all focus:border-gold/60 focus:outline-none ring-0 placeholder:text-gray-600",
              error && "border-red-500/60 focus:border-red-500",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tight">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
