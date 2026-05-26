
import { formatDevotionDate } from '@/lib/utils';

interface DevotionArchiveCardProps {
  date: Date;
  verse: string;
  title: string;
  reflection: string;
  onClick: () => void;
}

export function DevotionArchiveCard({ date, verse, title, reflection, onClick }: DevotionArchiveCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-white/10 bg-[#1A1A1A] p-4 transition-all duration-300 hover:border-[#C8A24A]/20 hover:bg-white/5"
    >
      <p className="mb-2 text-sm text-gray-500">{formatDevotionDate(date)}</p>
      <p className="mb-2 text-xs text-[#C8A24A]">{verse}</p>
      <h3 className="mb-2 font-semibold text-white">{title}</h3>
      <p className="mb-3 text-sm text-gray-400 line-clamp-2">{reflection}</p>
      <span className="text-sm text-[#C8A24A]">Read More →</span>
    </div>
  );
}