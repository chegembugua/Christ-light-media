
import { useState } from 'react';
import { Share2, Bookmark, Check } from 'lucide-react';
import { formatDevotionDate } from '@/lib/utils';
import type { DevotionDTO } from '@/modules/devotions/types';

interface DevotionFeaturedProps {
  devotion: DevotionDTO;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export function DevotionFeatured({ devotion, onBookmark, isBookmarked }: DevotionFeaturedProps) {
  const [copied, setCopied] = useState(false);
  const date = new Date(devotion.date);

  const handleShare = async () => {
    const url = `${window.location.origin}/devotions/${devotion.date}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="absolute inset-0 -z-10 rounded-3xl bg-[#C8A24A]/10 blur-3xl" />
      <div className="rounded-3xl border border-[#C8A24A]/20 bg-[#121212] p-6 md:p-10">
        <p className="mb-4 text-sm text-[#C8A24A]">
          {formatDevotionDate(date)}
        </p>
        
        <p className="mb-6 text-xs uppercase text-gray-500">{devotion.verse}</p>
        
        {devotion.verseText && (
          <p className="mb-6 text-lg italic leading-relaxed text-white">
            {devotion.verseText}
          </p>
        )}
        
        <div className="my-6 border-t border-[#C8A24A]/20" />
        
        <h2 className="font-cinzel text-2xl font-bold text-white mb-4 mt-6">{devotion.title}</h2>
        
        <p className="text-base leading-relaxed text-gray-300 whitespace-pre-line">
          {devotion.reflection}
        </p>
        
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleShare}
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-gray-400 transition hover:border-[#C8A24A]/30 hover:text-[#C8A24A]"
          >
            {copied ? (
              <>
                <Check size={16} className="mr-2 inline" />
                Copied!
              </>
            ) : (
              <>
                <Share2 size={16} className="mr-2 inline" />
                Share
              </>
            )}
          </button>
          
          <button
            onClick={onBookmark}
            className={`flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm transition ${
              isBookmarked ? 'text-[#C8A24A] border-[#C8A24A]/30' : 'text-gray-400 hover:border-[#C8A24A]/30 hover:text-[#C8A24A]'
            }`}
          >
            <Bookmark size={16} className="mr-2 inline" fill={isBookmarked ? 'currentColor' : 'none'} />
            Bookmark
          </button>
        </div>
      </div>
    </div>
  );
}