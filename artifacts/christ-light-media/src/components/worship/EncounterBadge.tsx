
import { Heart, Hand, Music, Star, Shield, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  Praise: Star,
  Intercession: Hand,
  Soaking: Waves,
  Prophetic: Star,
  Healing: Heart,
  Warfare: Shield,
  Instrumental: Music,
};

const COLOR_MAP: Record<string, string> = {
  Praise: 'text-gold border-gold/30 bg-gold/10',
  Intercession: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  Soaking: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  Prophetic: 'text-white border-white/20 bg-white/10',
  Healing: 'text-green-400 border-green-500/30 bg-green-500/10',
  Warfare: 'text-red-400 border-red-500/30 bg-red-500/10',
  Instrumental: 'text-gray-400 border-gray-500/30 bg-gray-500/10',
};

type EncounterBadgeProps = {
  type: string;
  className?: string;
};

export function EncounterBadge({ type, className }: EncounterBadgeProps) {
  const Icon = ICON_MAP[type] || Music;
  const colors = COLOR_MAP[type] || COLOR_MAP.Instrumental;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm',
        colors,
        className
      )}
    >
      <Icon size={11} />
      {type}
    </span>
  );
}
