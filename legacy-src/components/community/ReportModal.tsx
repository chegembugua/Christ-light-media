import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, X, AlertTriangle, AlertCircle } from 'lucide-react';
import { moderationService } from '../../services/moderationService';
import { useAuth } from '../../contexts/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'prayerRequest' | 'comment';
  contentId: string;
}

const REASONS = [
  "Inappropriate content",
  "Spam or self-promotion",
  "False Teaching / Doctrinal error",
  "Harassment or bullying",
  "Other"
];

export default function ReportModal({ isOpen, onClose, contentType, contentId }: ReportModalProps) {
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    const res = await moderationService.reportContent(
      contentType,
      contentId,
      user.uid,
      user.displayName || 'Anonymous Believer',
      reason,
      description
    );

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setDescription('');
        setReason(REASONS[0]);
      }, 2000);
    } else {
      alert(res.error || "Failed to submit report. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-base/80 backdrop-blur-sm"
        />
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="relative w-full max-w-md bg-surface-base border border-surface-hover rounded-3xl p-6 md:p-8 shadow-2xl"
        >
           <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-white p-2">
             <X className="w-5 h-5" />
           </button>

           {success ? (
              <div className="text-center py-8">
                 <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-emerald-500" />
                 </div>
                 <h3 className="text-xl font-bold font-serif mb-2">Report Submitted</h3>
                 <p className="text-gray-400 text-sm">Thank you for helping keep our community safe and respectful.</p>
              </div>
           ) : (
             <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                   <div className="bg-rose-500/10 p-2 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                   </div>
                   <h2 className="text-xl font-bold font-serif">Report Content</h2>
                </div>

                <div className="space-y-4 mb-8">
                   <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Report Reason</label>
                      <select 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-primary-base border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold"
                      >
                         {REASONS.map(r => (
                           <option key={r} value={r}>{r}</option>
                         ))}
                      </select>
                   </div>
                   
                   <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Additional Details (Optional)</label>
                      <textarea
                         value={description}
                         onChange={(e) => setDescription(e.target.value)}
                         placeholder="Please provide any extra context..."
                         className="w-full bg-primary-base border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold resize-none h-24"
                      />
                   </div>
                </div>

                <div className="flex gap-3">
                   <button 
                     type="button" 
                     onClick={onClose} 
                     className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 font-bold hover:bg-white/5 transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="flex-1 bg-rose-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                     {isSubmitting ? 'Submitting...' : <><Flag className="w-4 h-4" /> Submit Report</>}
                   </button>
                </div>
             </form>
           )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
