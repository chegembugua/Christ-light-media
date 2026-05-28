
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { authFetch } from '@/lib/api/authFetch';
import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Heart, Share2, Eye, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/animations/ScrollReveal';

interface Testimony {
  id: string;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  photoUrl: string | null;
  authorTitle: string | null;
  location: string | null;
  isFeatured: boolean;
  viewCount: number;
  reactionCount: number;
  publishedAt: string | null;
  user: { fullName: string | null; avatarUrl: string | null };
}

const CATEGORY_COLORS: Record<string, string> = {
  Prayer: 'bg-orange-500/10 text-orange-400',
  Healing: 'bg-green-500/10 text-green-400',
  Family: 'bg-blue-500/10 text-blue-400',
  Ministry: 'bg-purple-500/10 text-purple-400',
  Finances: 'bg-yellow-500/10 text-yellow-400',
  Salvation: 'bg-red-500/10 text-red-400',
  'Personal Growth': 'bg-teal-500/10 text-teal-400',
};

export default function TestimonyDetailPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const id = params?.id as string;

  const [testimony, setTestimony] = useState<Testimony | null>(null);
  const [related, setRelated] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [reacted, setReacted] = useState(false);
  const [reactionCount, setReactionCount] = useState(0);

  const fetchTestimony = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/movement/testimonies/${id}`);
      if (!res.ok) { navigate('/movement/testimonies'); return; }
      const data = await res.json();
      setTestimony(data.testimony);
      setReactionCount(data.testimony.reactionCount ?? 0);
      setRelated(data.related ?? []);
    } catch {
      navigate('/movement/testimonies');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchTestimony(); }, [fetchTestimony]);

  const handleReact = async () => {
    if (reacted) return;
    setReacted(true);
    setReactionCount((c) => c + 1);
    try {
      await authFetch(`/api/movement/testimonies/${id}/react`, { method: 'POST' });
    } catch { /* silent */ }
    toast.success('Blessed by this story! 🙏');
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Read this powerful testimony: "${testimony?.title}"`);
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      email: `mailto:?subject=${text}&body=${url}`,
    };
    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
      return;
    }
    window.open(links[platform], '_blank', 'noopener,noreferrer');
  };

  const getAuthorName = (t: Testimony) =>
    t.isAnonymous ? 'Anonymous' : (t.user.fullName ?? 'Community Member');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!testimony) return null;

  // Split content into paragraphs
  const paragraphs = testimony.content.split('\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto max-w-3xl px-6 pt-24 pb-20">
        {/* Back */}
        <Link href="/movement/testimonies" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold transition-colors text-sm mb-10">
          <ArrowLeft size={16} /> All Testimonies
        </Link>

        {/* Author header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            {testimony.photoUrl || testimony.user.avatarUrl ? (
              <img
                src={(testimony.photoUrl ?? testimony.user.avatarUrl) as string}
                alt={getAuthorName(testimony)}
                className="w-24 h-24 rounded-full object-cover border-2 border-gold/30 flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/30 flex items-center justify-center text-gold text-3xl font-bold flex-shrink-0">
                {getAuthorName(testimony)[0]}
              </div>
            )}
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-white">{getAuthorName(testimony)}</h2>
              {testimony.authorTitle && <p className="text-gold/70 text-sm mt-0.5">{testimony.authorTitle}</p>}
              {testimony.location && (
                <p className="text-gray-500 text-xs mt-1 flex items-center gap-1 justify-center sm:justify-start">
                  <MapPin size={11} /> {testimony.location}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${CATEGORY_COLORS[testimony.category] ?? 'bg-gold/10 text-gold'}`}>
                  {testimony.category}
                </span>
                {testimony.publishedAt && (
                  <span className="text-xs text-gray-600">
                    {new Date(testimony.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-cinzel font-bold mb-8 leading-tight">{testimony.title}</h1>
        </motion.div>

        {/* Content */}
        <ScrollReveal>
          <div className="space-y-5 mb-10">
            {paragraphs.map((para, i) => (
              para.startsWith('"') || para.startsWith('\u201c') ? (
                <blockquote key={i} className="border-l-4 border-gold/50 pl-5 py-1 italic text-gray-200 text-lg leading-relaxed">
                  {para}
                </blockquote>
              ) : (
                <p key={i} className="text-gray-300 leading-relaxed text-base">{para}</p>
              )
            ))}
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div className="flex items-center gap-6 py-5 border-y border-white/5 mb-8 text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><Eye size={14} /> {testimony.viewCount.toLocaleString()} views</span>
          <span className="flex items-center gap-1.5"><Heart size={14} /> {reactionCount.toLocaleString()} blessings</span>
        </div>

        {/* Actions */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Button
              variant={reacted ? 'ghost' : 'gold'}
              size="lg"
              className="flex items-center gap-2 rounded-xl flex-1 sm:flex-none"
              onClick={handleReact}
              disabled={reacted}
            >
              <Heart size={18} className={reacted ? 'fill-gold text-gold' : ''} />
              {reacted ? 'Blessed!' : 'I Was Blessed by This'}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 mr-1">Share:</span>
              {[
                { key: 'whatsapp', label: 'WhatsApp', color: 'hover:text-green-400' },
                { key: 'facebook', label: 'Facebook', color: 'hover:text-blue-400' },
                { key: 'email', label: 'Email', color: 'hover:text-gold' },
                { key: 'copy', label: 'Copy', color: 'hover:text-gray-300' },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleShare(s.key)}
                  className={`flex items-center gap-1 text-gray-500 ${s.color} transition-colors text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10`}
                >
                  <Share2 size={12} /> {s.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Related testimonies */}
        {related.length > 0 && (
          <ScrollReveal>
            <div className="border-t border-white/5 pt-10">
              <h3 className="text-xl font-cinzel font-bold mb-6">More Stories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((t) => (
                  <Link key={t.id} href={`/movement/testimonies/${t.id}`}>
                    <div className="bg-card border border-white/5 rounded-2xl p-5 hover:border-gold/30 transition-all group">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold flex-shrink-0">
                          {(t.isAnonymous ? 'A' : (t.user.fullName?.[0] ?? 'C'))}
                        </div>
                        <p className="text-xs font-semibold text-white truncate">
                          {t.isAnonymous ? 'Anonymous' : (t.user.fullName ?? 'Community Member')}
                        </p>
                      </div>
                      <p className="text-gray-400 text-xs italic line-clamp-2">&ldquo;{t.content}&rdquo;</p>
                      <span className="inline-flex items-center gap-1 text-gold/70 text-xs font-semibold mt-3 group-hover:text-gold transition-colors">
                        Read <ChevronRight size={11} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
