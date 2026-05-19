import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage = "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=2000",
  children,
  align = 'center',
  className
}: HeroSectionProps) {
  return (
    <div className={cn("relative min-h-[60vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden", className)}>
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-base via-primary-base/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-base/50 to-transparent" />
      </div>

      <div className={cn(
        "relative z-10 max-w-5xl mx-auto w-full",
        align === 'center' ? 'text-center' : 'text-left'
      )}>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white tracking-tight mb-6 drop-shadow-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-2xl text-gray-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>
        )}
        
        {children && (
          <div className={cn("flex flex-wrap gap-4", align === 'center' ? 'justify-center' : 'justify-start')}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
