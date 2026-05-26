
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
  Heart,
  Clock,
  ArrowLeft,
  Check,
  Link as LinkIcon,
  MessageCircle,
  Facebook,
  Mail,
  Loader2,
} from 'lucide-react';
import PrayerCard from '@/components/prayer/PrayerCard';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

type PrayerDetail = {
  id: string;
  title: string;
  content: string;
  category: string;
  isAnswered: boolean;
  isAnonymous: boolean;
  duration: string | null;
  prayerCount: number;
  viewCount: number;
  createdAt: string;
  author: string;
};

export default function PrayerDetailPage() {
  const [, navigate] = useLocation();
  const params = useParams();
  const { user } = useAuth();
  const id = params.id as string;

  const [prayer, setPrayer] = useState<PrayerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  const loadPrayer = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community/prayers/${id}`);
      const data = await res.json();
      if (!res.ok) return;
      setPrayer(data.prayer);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadPrayer();
  }, [loadPrayer]);

  const handlePray = async () => {
    if (!user) {
      toast.error('Sign in to record your prayer.');
      navigate('/login');
      return;
    }

    try {
      const method = hasVoted ? 'DELETE' : 'POST';
      const res = await fetch(`/api/community/prayers/${id}/pray`, { method });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Something went wrong.');
        return;
      }
      setHasVoted(data.voted ?? !hasVoted);
      setPrayer((prev) =>
        prev ? { ...prev, prayerCount: data.totalVotes } : prev
      );
      toast.success(hasVoted ? 'Prayer removed.' : 'Thank you for praying.');
    } catch {
      toast.error('Something went wrong.');
    }
  };

  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : `/community/prayer/${id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard.');
    } catch {
      toast.error('Could not copy link.');
    }
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${prayer?.title}\n${shareUrl}`)}`,
      '_blank'
    );
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Prayer Request: ${prayer?.title}`);
    const body = encodeURIComponent(
      `${prayer?.title}\n\n${prayer?.content}\n\n${shareUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] pt-28">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (!prayer) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0A0A0A] pt-28">
        <p className="text-gray-500">Prayer request not found.</p>
        <Button variant="ghost" onClick={() => navigate('/community/prayer')}>
          <ArrowLeft size={16} className="mr-2" /> Back to Prayer Wall
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-28">
      <div className="mx-auto max-w-3xl px-6">
        {/* Back */}
        <button
          onClick={() => navigate('/community/prayer')}
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gold transition-colors"
        >
          <ArrowLeft size={14} /> Back to Prayer Wall
        </button>

        {/* Status + category badges */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {prayer.isAnswered && (
            <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-400">
              <Check size={10} /> Answered
            </span>
          )}
          {prayer.category && (
            <span className="rounded-full border border-[#C8A24A]/30 bg-[#C8A24A]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold">
              {prayer.category}
            </span>
          )}
          {prayer.duration && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {prayer.duration}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-cinzel text-3xl font-bold leading-tight text-white md:text-4xl">
          {prayer.title}
        </h1>

        {/* Author + date */}
        <p className="mt-3 text-sm text-gray-500">
          Submitted by{' '}
          <span className="font-medium text-gray-300">{prayer.author}</span>
          {' · '}{formatRelativeTime(new Date(prayer.createdAt))}
          {prayer.viewCount !== undefined && (
            <> · {prayer.viewCount} views</>)}
        </p>

        {/* Body */}
        <div className="mt-8 space-y-4 whitespace-pre-line text-base leading-relaxed text-gray-300">
          {prayer.content}
        </div>

        {/* Divider */}
        <hr className="my-10 border-white/5" />

        {/* Action area */}
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-[#161616] p-8">
          <p className="text-center text-sm text-gray-400">
            <span className="font-bold text-white">{prayer.prayerCount.toLocaleString()}</span> people have prayed for this_request
          </p>
          <Button
            variant={hasVoted ? 'gold' : 'outline'}
            size="lg"
            onClick={handlePray}
            className={cn(
              'flex items-center gap-2 px-8 py-4 text-base',
              hasVoted
                ? 'bg-gradient-to-r from-[#C8A24A] to-[#B38A3D] text-black shadow-lg shadow-[#C8A24A]/30'
                : 'border-[#C8A24A]/40 text-white hover:bg-[#C8A24A]/10'
            )}
          >
            <Heart
              size={18}
              className={hasVoted ? 'fill-black' : ''}
            />
            {hasVoted ? '✓ You prayed for this (click to remove)' : 'I Have Prayed'}
          </Button>
        </div>

        {/* Share */}
        <div className="mt-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">Share this prayer request</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" onClick={handleCopyLink} className="flex items-center gap-2">
              <LinkIcon size={15} /> Copy Link
            </Button>
            <Button variant="ghost" onClick={handleWhatsApp} className="flex items-center gap-2 text-green-400 hover:text-green-300">
              <MessageCircle size={15} /> WhatsApp
            </Button>
            <Button variant="ghost" onClick={handleFacebook} className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <Facebook size={15} /> Facebook
            </Button>
            <Button variant="ghost" onClick={handleEmail} className="flex items-center gap-2 text-red-400 hover:text-red-300">
              <Mail size={15} /> Email
            </Button>
          </div>
        </div>

        {/* Prayer Updates placeholder */}
        <hr className="my-10 border-white/5" />
        <div className="rounded-2xl border border-white/10 bg-[#161616] p-8 text-center">
          <h3 className="font-cinzel text-xl font-semibold text-white">Prayer Updates</h3>
          <p className="mt-3 text-sm text-gray-500">Updates coming soon. Continue to stand with us in prayer!</p>
        </div>
      </div>
    </div>
  );
}
