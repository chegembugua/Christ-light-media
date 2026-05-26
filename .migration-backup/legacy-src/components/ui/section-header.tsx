import { cn } from "../../lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  category,
  align = 'center',
  className
}: SectionHeaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col mb-12",
        {
          'items-start text-left': align === 'left',
          'items-center text-center': align === 'center',
          'items-end text-right': align === 'right',
        },
        className
      )}
    >
      {category && (
        <span className="text-gold font-mono text-sm tracking-[0.2em] uppercase mb-4">
          {category}
        </span>
      )}
      
      <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-4">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl">
          {subtitle}
        </p>
      )}

      {align === 'center' && (
        <div className="w-16 h-1 bg-gold/50 rounded-full mt-8" />
      )}
    </div>
  );
}
