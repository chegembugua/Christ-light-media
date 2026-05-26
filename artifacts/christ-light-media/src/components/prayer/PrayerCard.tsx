
import { useLocation } from 'wouter';
import { Heart, Clock, ArrowRight, Check } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  Health: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  Family: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  Ministry: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  Finances: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
  Personal: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  Nation: 'bg-[#C8A24A]/10 border-[#C8A24A]/30 text-gold',
  Other: 'bg-gray-500/10 border-gray-500/30 text-gray-400',
};

interface PrayerCardProps {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  prayerCount: number;
  isAnswered: boolean;
  timePosted: Date;
  viewCount?: number;
  userHasPrayed?: boolean;
  onClick: () => void;
  onPray?: () => void;
}

export default function PrayerCard({
  id,
  title,
  content,
  category,
  author,
  prayerCount,
  isAnswered,
  timePosted,
  viewCount,
  userHasPrayed,
  onClick,
  onPray,
}: PrayerCardProps) {
  const [, navigate] = useLocation();

  return (
    <article
      className="group/card cursor-pointer rounded-2xl border border-white/10 bg-[#1A1A1A] p-5 transition-all duration-300 hover:border-[#C8A24A]/40 hover:bg-[#1F1F1F]"
      onClick={onClick}
    >
      {/* Top badges row */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest',
            CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
          )}
        >
          {category}
        </span>
        {isAnswered && (
          <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-400">
            <Check size={10} /> Answered
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold leading-snug text-white line-clamp-1 group-hover/card:text-gold transition-colors">
        {title}
      </h3>

      {/* Content preview */}
      <p className="mt-1.5 text-sm leading-relaxed text-gray-400 line-clamp-3">
        {content}
      </p>

      {/* Author */}
      <p className="mt-2 text-xs text-gray-500">
        Submitted by{' '}
        <span className="font-medium text-gray-300">{author}</span>
      </p>

      {/* Divider */}
      <div className="mt-4 border-t border-white/5 pt-4" />

      {/* Meta row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Heart size={13} className={userHasPrayed ? 'fill-gold text-gold' : ''} />
            <span className="font-semibold text-gray-300">{prayerCount.toLocaleString()}</span> prayed
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {formatRelativeTime(timePosted)}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPray?.();
          }}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
            userHasPrayed
              ? 'bg-gold/15 text-gold border border-gold/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:border-gold/40 hover:text-gold'
          )}
        >
          <Heart
            size={12}
            className={userHasPrayed ? 'fill-gold' : ''}
          />
          I Prayed
        </button>
      </div>
    </article>
  );
}
