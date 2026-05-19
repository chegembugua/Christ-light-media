import { useState } from 'react';
import { Heart, MessageSquare, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface PrayerRequestCardProps {
  id: string;
  title: string;
  content: string;
  authorName: string;
  category: string;
  createdAt: Date;
  prayerCount: number;
  commentCount: number;
  hasPrayed?: boolean;
  onPray?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export function PrayerRequestCard({
  id,
  title,
  content,
  authorName,
  category,
  createdAt,
  prayerCount,
  commentCount,
  hasPrayed = false,
  onPray,
  onClick,
  className
}: PrayerRequestCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePrayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPray && !hasPrayed) {
      setIsAnimating(true);
      onPray(id);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <Card 
      className={cn("group cursor-pointer hover:border-gold/30 transition-all duration-500", className)}
      onClick={() => onClick?.(id)}
    >
      <CardContent className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-6 gap-4">
          <Badge variant="outline" className="border-white/10 text-gray-400 group-hover:border-gold/20 group-hover:text-gold/80 transition-colors">
            {category}
          </Badge>
          <span className="text-xs font-mono text-gray-500">{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
        </div>

        <h3 className="font-serif text-2xl text-white mb-3 group-hover:text-gold transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-300 font-light leading-relaxed mb-6 line-clamp-3">
          {content}
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/40 to-primary-base border border-white/5 flex items-center justify-center text-xs font-medium text-white shadow-inner">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-white font-medium">{authorName}</p>
            <p className="text-xs text-gray-500 font-mono tracking-wider">MEMBER</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 md:px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePrayClick}
            className={cn(
              "gap-2 h-9 px-3 transition-all relative",
              hasPrayed 
                ? "text-gold bg-gold/10 hover:bg-gold/20" 
                : "text-gray-400 hover:text-white"
            )}
            disabled={hasPrayed}
          >
            {isAnimating && (
              <Heart className="absolute text-gold w-6 h-6 prayer-particle -top-4 pointer-events-none fill-current" />
            )}
            <Heart className={cn("w-4 h-4", hasPrayed && "fill-current")} />
            <span className="font-mono text-xs">{hasPrayed ? "Prayed" : "I'm Praying"} ({prayerCount})</span>
          </Button>

          <div className="flex items-center gap-2 text-gray-400">
            <MessageSquare className="w-4 h-4" />
            <span className="font-mono text-xs">{commentCount}</span>
          </div>
        </div>

        <button className="text-gray-500 hover:text-white transition-colors p-2" title="Report">
          <AlertCircle className="w-4 h-4" />
        </button>
      </CardFooter>
    </Card>
  );
}
