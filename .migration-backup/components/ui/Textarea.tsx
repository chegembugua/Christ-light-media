import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="ml-1 text-xs font-bold uppercase tracking-widest text-gray-400">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'min-h-[120px] w-full resize-y rounded-xl border border-white/10 bg-card px-4 py-3.5 text-sm transition-all placeholder:text-gray-600 focus:border-gold/60 focus:outline-none',
          error && 'border-red-500/60 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="ml-1 text-[10px] font-bold uppercase tracking-tight text-red-500">
          {error}
        </p>
      )}
    </div>
  )
);

Textarea.displayName = 'Textarea';
