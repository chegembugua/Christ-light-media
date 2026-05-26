import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { engagementService, CommentItem } from '../../services/engagementService';
import { notificationService } from '../../services/notificationService';
import { Link } from 'react-router-dom';
import { Send, User as UserIcon, Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentSectionProps {
  contentType: 'devotion' | 'podcast' | 'sermon' | 'news' | 'music' | 'prayer';
  contentId: string;
  contentTitle?: string;
  contentOwnerId?: string;
}

export default function CommentSection({ contentType, contentId, contentTitle, contentOwnerId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const res = await engagementService.getComments(contentType, contentId);
      if (res.success && res.data) {
        setComments(res.data);
      }
      setLoading(false);
    };

    if (contentId) {
      fetchComments();
    }
  }, [contentType, contentId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    setIsSubmitting(true);
    
    const newCommentData = {
      contentType,
      contentId,
      userId: user.uid,
      userName: user.displayName || 'Anonymous User',
      userPhoto: user.photoURL || '',
      comment: commentText.trim(),
      createdAt: Date.now(),
      likes: 0
    };

    const res = await engagementService.addComment(newCommentData);
    
    if (res.success && res.data) {
      setComments([{ ...newCommentData, id: res.data }, ...comments]);
      setCommentText('');
      
      // Notify owner
      if (contentOwnerId && contentOwnerId !== user.uid) {
         if (contentType === 'prayer') {
            const { prayerService } = await import('../../services/prayerService');
            await prayerService.notifyNewCommentOnPrayer(contentId, user.displayName || 'Someone');
         } else {
            await notificationService.sendNotification(contentOwnerId, {
              type: 'comment',
              title: 'New Comment',
              message: `${user.displayName || 'Someone'} commented on your ${contentType}${contentTitle ? ` "${contentTitle}"` : ''}.`,
              contentType,
              contentId
            });
         }
      }
    } else {
      alert('Failed to post comment. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const timeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="mt-16 pt-12 border-t border-white/10">
      <h3 className="font-serif text-3xl text-white mb-8 flex items-center gap-3">
        <MessageSquare className="text-gold w-6 h-6" /> 
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-surface/30 p-6 rounded-2xl border border-white/5 shadow-inner">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0 overflow-hidden">
               {user.photoURL ? (
                 <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
               ) : (
                 <UserIcon className="w-5 h-5 text-gold" />
               )}
            </div>
            <div className="flex-1 space-y-3">
               <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all min-h-[100px] resize-y"
                  required
               />
               <div className="flex justify-end">
                  <button 
                     type="submit" 
                     disabled={isSubmitting || !commentText.trim()}
                     className="px-6 py-2.5 bg-gold hover:bg-gold-light text-primary-base font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm uppercase tracking-widest"
                  >
                     {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                     Post Comment
                  </button>
               </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 bg-surface/30 p-8 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center">
          <MessageSquare className="w-10 h-10 text-gray-500 mb-4 opacity-50" />
          <p className="text-gray-400 mb-4">Please log in to join the conversation.</p>
          <Link to="/admin/login" className="px-6 py-2 border border-gold text-gold rounded-full hover:bg-gold hover:text-primary-base transition-colors font-bold uppercase tracking-widest text-xs">
            Login
          </Link>
        </div>
      )}

      {/* Comment List */}
      {loading ? (
         <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
         </div>
      ) : comments.length === 0 ? (
         <div className="text-center py-12 text-gray-500 font-light">
            No comments yet. Be the first to share your thoughts!
         </div>
      ) : (
         <div className="space-y-6">
            <AnimatePresence>
               {comments.map((comment) => (
                  <motion.div 
                     key={comment.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                     <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                        {comment.userPhoto ? (
                           <img src={comment.userPhoto} alt={comment.userName} className="w-full h-full object-cover" />
                        ) : (
                           <UserIcon className="w-5 h-5 text-gray-400" />
                        )}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                           <span className="font-medium text-white/90">{comment.userName}</span>
                           <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 font-light leading-relaxed whitespace-pre-wrap">
                           {comment.comment}
                        </p>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>
      )}
    </div>
  );
}
