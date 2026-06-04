import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="ml-1 text-xs font-bold uppercase tracking-widest text-gray-400">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full rounded-xl border border-white/10 bg-card px-4 py-3.5 text-sm transition-all focus:border-gold/60 focus:outline-none',
          error && 'border-red-500/60',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-card text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="ml-1 text-[10px] font-bold uppercase tracking-tight text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
