import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = <Sparkles className="w-8 h-8 text-gold" />,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-12 py-24 rounded-3xl border border-white/5 bg-surface-base relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 relative z-10 border border-white/10 shadow-[0_0_30px_rgba(200,162,74,0.1)]">
        {icon}
      </div>
      
      <h3 className="font-serif text-2xl md:text-3xl text-white mb-4 relative z-10">{title}</h3>
      <p className="text-gray-400 font-light max-w-md mx-auto mb-8 relative z-10">{description}</p>
      
      {actionLabel && (
        <div className="relative z-10">
          {actionLink ? (
            <Link to={actionLink}>
              <Button variant="secondary" className="border-gold/30 text-gold hover:bg-gold/10">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" onClick={onAction} className="border-gold/30 text-gold hover:bg-gold/10">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
