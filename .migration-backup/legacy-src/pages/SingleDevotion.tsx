import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Loader2, BookOpen, Twitter, Facebook, Link as LinkIcon, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { devotionService, DevotionItem } from '../services/devotionService';
import { motion, AnimatePresence } from 'framer-motion';
import LikeButton from '../components/engagement/LikeButton';
import CommentSection from '../components/engagement/CommentSection';

export default function SingleDevotion() {
  const { id } = useParams();
  const [devotion, setDevotion] = useState<DevotionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [nextId, setNextId] = useState<string | null>(null);
  const [prevId, setPrevId] = useState<string | null>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDevotion = async () => {
      setLoading(true);
      if (id) {
        const res = await devotionService.getItemById(id);
        if (res.success && res.data) {
          setDevotion(res.data);
          
          // Fetch all to find neighbors
          const allRes = await devotionService.getAllItems();
          if (allRes.success && allRes.data) {
            const sorted = allRes.data.sort((a, b) => b.createdAt - a.createdAt);
            const index = sorted.findIndex(item => item.id === id);
            
            if (index !== -1) {
              setNextId(index > 0 ? sorted[index - 1].id! : null);
              setPrevId(index < sorted.length - 1 ? sorted[index + 1].id! : null);
            }
          }
        }
      }
      setLoading(false);
    };
    fetchDevotion();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this devotion: ${devotion?.title}`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
    if (platform !== 'copy') {
      setShowShareMenu(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-primary-base">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
      </div>
    );
  }

  if (!devotion) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-primary-base px-4 text-center">
        <BookOpen className="w-16 h-16 text-white/10 mb-4" />
        <h2 className="text-2xl font-serif text-white mb-2">Devotion Not Found</h2>
        <p className="text-gray-400 mb-6">The devotion you're looking for doesn't exist or has been removed.</p>
        <Link to="/devotions" className="px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors uppercase tracking-widest text-sm">
          Return to Devotions
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-24 bg-primary-base relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

      {/* Top Banner / Nav */}
      <div className="py-8 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/devotions" className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Devotions
          </Link>
          <div className="relative" ref={shareMenuRef}>
            <button 
              className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-surface-base border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                    >
                      <Twitter className="w-4 h-4" /> Share on X
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                    >
                      <Facebook className="w-4 h-4" /> Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" /> <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                         <>
                           <LinkIcon className="w-4 h-4" /> Copy Link
                         </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        
        {/* Header content */}
        <header className="mb-16 text-center">
          <div className="inline-block px-4 py-1.5 bg-gold/10 text-gold text-xs uppercase tracking-widest font-bold rounded-full mb-6 border border-gold/20">
            {devotion.category || "Faith"}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight drop-shadow-md">
            {devotion.title}
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-mono">
            {new Date(devotion.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Scripture Box */}
        <div className="bg-surface/40 backdrop-blur-sm border border-gold/20 p-8 md:p-12 rounded-2xl mb-16 text-center relative shadow-[0_0_40px_rgba(200,162,74,0.05)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-base px-6 py-1 border border-gold/20 rounded-full shadow-lg">
             <span className="text-gold uppercase tracking-widest text-[10px] font-bold flex items-center gap-2">
               <BookOpen className="w-3 h-3" /> Scripture Focus
             </span>
          </div>
          {devotion.scriptureText && (
            <p className="font-serif text-2xl md:text-3xl text-white/90 italic leading-relaxed mb-6">
              "{devotion.scriptureText}"
            </p>
          )}
          <p className="text-gold font-medium tracking-wide text-lg">— {devotion.scriptureReference}</p>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-loose mb-20 whitespace-pre-wrap font-light tracking-wide bg-surface/20 p-8 md:p-12 rounded-2xl border border-white/5">
          {devotion.content}
        </div>

        {/* Reflection & Prayer Section */}
        {(devotion.reflectionQuestions?.length > 0 || devotion.prayer) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-16">
            {devotion.reflectionQuestions && devotion.reflectionQuestions.length > 0 && (
              <div className="bg-surface/30 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-gold/20 transition-colors">
                <h3 className="text-gold font-serif text-2xl mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-gold/50"></span> Reflection
                </h3>
                <ul className="text-gray-300 space-y-4 text-sm md:text-base leading-relaxed">
                  {devotion.reflectionQuestions.map((q: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-gold/50 font-mono mt-0.5">{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {devotion.prayer && (
              <div className="bg-surface/30 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-gold/20 transition-colors">
                <h3 className="text-gold font-serif text-2xl mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-gold/50"></span> Daily Prayer
                </h3>
                <div className="relative">
                  <span className="text-6xl text-white/5 font-serif absolute -top-8 -left-4">"</span>
                  <p className="text-gray-300 font-serif italic leading-relaxed text-lg relative z-10">
                    {devotion.prayer}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 pt-8 flex items-center justify-between border-t border-white/10">
           <LikeButton contentType="devotion" contentId={devotion.id!} contentTitle={devotion.title} contentOwnerId={devotion.createdBy} />
           
           <div className="flex items-center gap-4">
             {prevId && (
               <Link 
                 to={`/devotions/${prevId}`}
                 className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/5 rounded-xl text-gray-400 hover:text-gold hover:border-gold/30 transition-all text-xs uppercase tracking-widest font-bold"
               >
                 <ChevronLeft className="w-4 h-4" /> Previous
               </Link>
             )}
             {nextId && (
               <Link 
                 to={`/devotions/${nextId}`}
                 className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/5 rounded-xl text-gray-400 hover:text-gold hover:border-gold/30 transition-all text-xs uppercase tracking-widest font-bold"
               >
                 Next <ChevronRight className="w-4 h-4" />
               </Link>
             )}
           </div>
        </div>

        <CommentSection contentType="devotion" contentId={devotion.id!} contentTitle={devotion.title} contentOwnerId={devotion.createdBy} />

      </motion.div>
    </article>
  );
}
