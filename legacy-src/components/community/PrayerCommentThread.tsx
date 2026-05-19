import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { prayerService } from '../../services/prayerService';
import { Heart, Reply, MoreVertical, Trash2, Edit2, Send, CornerDownRight, X, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ReportModal from './ReportModal';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  comment: string;
  createdAt: number;
  likes: number;
  parentId?: string | null;
  isEdited?: boolean;
}

interface ThreadProps {
  prayerRequestId: string;
}

export default function PrayerCommentThread({ prayerRequestId }: ThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [reportCommentId, setReportCommentId] = useState<string | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = prayerService.subscribeToPrayerComments(prayerRequestId, (data) => {
      setComments(data as Comment[]);
    });
    return () => unsubscribe();
  }, [prayerRequestId]);

  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId).sort((a,b) => a.createdAt - b.createdAt); // Replies chronologically

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    const res = await prayerService.addPrayerComment(
       prayerRequestId,
       user.uid,
       user.displayName || 'Anonymous Believer',
       user.photoURL || '',
       newComment.trim()
    );
    if (res.success) {
       setNewComment('');
       await prayerService.notifyNewCommentOnPrayer(prayerRequestId, user.displayName || 'Anonymous Believer');
    } else if (res.error) {
       alert(res.error);
    }
    setIsSubmitting(false);
  };

  const handleReply = async (parentId: string) => {
    if (!user || !replyContent.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const res = await prayerService.addPrayerComment(
       prayerRequestId,
       user.uid,
       user.displayName || 'Anonymous Believer',
       user.photoURL || '',
       replyContent.trim(),
       parentId
    );
    if (res.success) {
       setReplyingTo(null);
       setReplyContent('');
       await prayerService.notifyNewCommentOnPrayer(prayerRequestId, user.displayName || 'Anonymous Believer');
    } else if (res.error) {
       alert(res.error);
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (commentId: string) => {
     if (!editContent.trim() || isSubmitting) return;
     setIsSubmitting(true);
     const res = await prayerService.editPrayerComment(commentId, editContent.trim());
     if (res.success) {
        setEditingId(null);
     } else if (res.error) {
        alert(res.error);
     }
     setIsSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
     if (!window.confirm("Are you sure you want to delete this comment?")) return;
     await prayerService.deletePrayerComment(commentId, prayerRequestId);
  };

  const handleLike = async (commentId: string) => {
     if (!user) return;
     await prayerService.likePrayerComment(commentId, user.uid);
  };

  const renderComment = (comment: Comment, isReply = false) => {
     const isOwner = user?.uid === comment.userId;
     const replies = !isReply ? getReplies(comment.id) : [];

     return (
        <div key={comment.id} className={`${isReply ? 'ml-12 mt-4' : 'mt-6 bg-surface-base p-6 rounded-2xl border border-surface-hover shadow-lg'}`}>
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold uppercase shrink-0 overflow-hidden">
                 {comment.userPhoto ? (
                    <img src={comment.userPhoto} alt={comment.userName} className="w-full h-full object-cover" />
                 ) : (
                    comment.userName.charAt(0)
                 )}
              </div>
              <div className="flex-1">
                 <div className="flex items-center justify-between mb-1 relative">
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-white">{comment.userName}</span>
                       <span className="text-xs text-gray-500 font-light">
                          {formatDistanceToNow(comment.createdAt)} ago {comment.isEdited && '(edited)'}
                       </span>
                    </div>
                    
                    <div className="relative">
                       <button onClick={() => setOpenDropdown(openDropdown === comment.id ? null : comment.id)} className="text-gray-500 hover:text-white p-1">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                       {openDropdown === comment.id && (
                          <div className="absolute right-0 top-6 bg-surface-hover border border-white/10 rounded-lg shadow-xl overflow-hidden z-20 w-32">
                             {isOwner ? (
                                <>
                                   <button 
                                     onClick={() => { setEditingId(comment.id); setEditContent(comment.comment); setOpenDropdown(null); }}
                                     className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                   >
                                      <Edit2 className="w-3.5 h-3.5" /> Edit
                                   </button>
                                   <button 
                                     onClick={() => { handleDelete(comment.id); setOpenDropdown(null); }}
                                     className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 flex items-center gap-2"
                                   >
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                   </button>
                                </>
                             ) : (
                                user && (
                                   <button 
                                     onClick={() => { setReportCommentId(comment.id); setOpenDropdown(null); }}
                                     className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                   >
                                      <Flag className="w-3.5 h-3.5" /> Report
                                   </button>
                                )
                             )}
                          </div>
                       )}
                    </div>
                 </div>

                 {editingId === comment.id ? (
                    <div className="mt-2">
                       <textarea
                         value={editContent}
                         onChange={e => setEditContent(e.target.value)}
                         className="w-full bg-primary-base border border-gold/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold"
                         rows={3}
                       />
                       <div className="flex items-center justify-end gap-2 mt-2">
                          <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 text-gray-400 hover:text-white">Cancel</button>
                          <button onClick={() => handleEdit(comment.id)} disabled={isSubmitting} className="text-xs px-4 py-1.5 bg-gold text-primary-base rounded-full font-bold">Save</button>
                       </div>
                    </div>
                 ) : (
                    <p className="text-gray-300 text-sm leading-relaxed mt-1 font-light">{comment.comment}</p>
                 )}

                 {!editingId && (
                    <div className="flex items-center gap-4 mt-3">
                       <button onClick={() => handleLike(comment.id)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-rose-500 transition-colors group">
                          <Heart className="w-3.5 h-3.5 group-hover:fill-current" />
                          <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
                       </button>
                       {!isReply && (
                          <button onClick={() => { setReplyingTo(comment.id); setReplyContent(''); }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gold transition-colors">
                             <Reply className="w-3.5 h-3.5" />
                             <span>Reply</span>
                          </button>
                       )}
                    </div>
                 )}

                 {replyingTo === comment.id && !isReply && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold uppercase shrink-0">
                          {user?.displayName?.charAt(0) || 'U'}
                       </div>
                       <div className="flex-1 relative">
                          <textarea
                             value={replyContent}
                             onChange={e => setReplyContent(e.target.value)}
                             placeholder={`Reply to ${comment.userName}...`}
                             className="w-full bg-primary-base border border-white/10 rounded-xl p-3 pt-3 pr-12 text-sm text-white focus:outline-none focus:border-gold/50 resize-y min-h-[80px]"
                          />
                          <button 
                             onClick={() => handleReply(comment.id)}
                             disabled={!replyContent.trim() || isSubmitting}
                             className="absolute right-2 bottom-3 p-1.5 bg-gold text-primary-base rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
                          >
                             <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                             onClick={() => setReplyingTo(null)}
                             className="absolute right-2 top-2 p-1 text-gray-500 hover:text-white"
                          >
                             <X className="w-4 h-4" />
                          </button>
                       </div>
                    </motion.div>
                 )}

                 {/* Render nested replies */}
                 {replies.length > 0 && (
                    <div className="mt-4 relative before:absolute before:left-[-1.4rem] before:top-4 before:bottom-4 before:w-[2px] before:bg-white/5">
                       {replies.map(reply => (
                          <div key={reply.id} className="relative">
                             <CornerDownRight className="w-4 h-4 absolute -left-[1.5rem] top-6 text-white/20" />
                             {renderComment(reply, true)}
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>
     );
  };

  return (
    <div className="mt-12 mb-12">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
        <h3 className="text-xl font-bold font-serif">Encouraging Words</h3>
        <span className="bg-gold/10 text-gold text-xs font-bold px-2 py-0.5 rounded-full">{comments.length}</span>
      </div>
      
      {!user ? (
        <div className="bg-primary-base border border-white/5 p-6 rounded-2xl text-center">
           <p className="text-gray-400 mb-4">You must be logged in to share an encouraging word.</p>
           <button className="bg-gold/10 text-gold px-6 py-2 rounded-full text-sm font-bold border border-gold/30 hover:bg-gold hover:text-primary-base transition-colors">
              Login to Comment
           </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitComment} className="flex gap-4 bg-surface-base p-6 rounded-2xl border border-surface-hover shadow-lg">
           <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold uppercase shrink-0 overflow-hidden">
             {user.photoURL ? (
                <img src={user.photoURL} alt="You" className="w-full h-full object-cover" />
             ) : (
                user.displayName?.charAt(0) || 'U'
             )}
           </div>
           <div className="flex-1 relative">
             <textarea 
               value={newComment}
               onChange={e => setNewComment(e.target.value)}
               placeholder="Share a word of encouragement or prayer..."
               className="w-full bg-primary-base border border-white/10 rounded-xl p-4 pr-12 text-sm text-white focus:outline-none focus:border-gold/50 resize-y min-h-[100px] placeholder:text-gray-600"
               disabled={isSubmitting}
             />
             <button 
               type="submit"
               disabled={!newComment.trim() || isSubmitting}
               className="absolute right-3 bottom-3 p-2 bg-gold text-primary-base rounded-xl disabled:opacity-50 hover:bg-white transition-all shadow-[0_0_15px_rgba(200,162,74,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
             >
                <Send className="w-4 h-4" />
             </button>
           </div>
        </form>
      )}

      <div className="space-y-6">
         {topLevelComments.length === 0 ? (
            <div className="text-center py-12">
               <p className="text-gray-500 font-light italic">Be the first to share an encouraging word.</p>
            </div>
         ) : (
            topLevelComments.map(comment => renderComment(comment))
         )}
      </div>

      <ReportModal 
        isOpen={reportCommentId !== null} 
        onClose={() => setReportCommentId(null)} 
        contentType="comment" 
        contentId={reportCommentId || ''} 
      />
    </div>
  );
}
