'use client';

import { useState } from 'react';
import { Share2, Link, MessageCircle, Facebook, Mail } from 'lucide-react';
import { formatDevotionDate } from '@/lib/utils';

interface DevotionShareProps {
  date: Date;
  title: string;
  verse: string;
}

export function DevotionShare({ date, title, verse }: DevotionShareProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/devotions/${formatDevotionDate(date).split(', ')[1] || date.toISOString().split('T')[0]}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${title} - ${verse}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Daily Devotion: ${title}`);
    const body = encodeURIComponent(`${title}\n${verse}\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopyLink}
        className="rounded-full border border-white/10 bg-white/5 p-2.5 text-gray-400 transition hover:border-[#C8A24A]/30 hover:text-[#C8A24A]"
        title="Copy link"
      >
        {copied ? <Link size={18} /> : <Share2 size={18} />}
      </button>
      
      <button
        onClick={handleWhatsApp}
        className="rounded-full border border-white/10 bg-white/5 p-2.5 text-gray-400 transition hover:border-green-500 hover:text-green-400"
        title="Share on WhatsApp"
      >
        <MessageCircle size={18} />
      </button>
      
      <button
        onClick={handleFacebook}
        className="rounded-full border border-white/10 bg-white/5 p-2.5 text-gray-400 transition hover:border-blue-500 hover:text-blue-400"
        title="Share on Facebook"
      >
        <Facebook size={18} />
      </button>
      
      <button
        onClick={handleEmail}
        className="rounded-full border border-white/10 bg-white/5 p-2.5 text-gray-400 transition hover:border-red-500 hover:text-red-400"
        title="Share via Email"
      >
        <Mail size={18} />
      </button>
    </div>
  );
}