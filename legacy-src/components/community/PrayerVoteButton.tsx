import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { prayerService } from '../../services/prayerService';
import { useAuth } from '../../contexts/AuthContext';

interface PrayerVoteButtonProps {
  prayerRequestId: string;
  prayerCount: number;
  prayedBy?: string[];
  className?: string;
  onVoteClick?: (prayed: boolean) => void;
}

export default function PrayerVoteButton({
  prayerRequestId,
  prayerCount,
  prayedBy = [],
  className = '',
  onVoteClick,
}: PrayerVoteButtonProps) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialHasPrayed = user ? prayedBy.includes(user.uid) : false;
  const [localHasPrayed, setLocalHasPrayed] = useState(initialHasPrayed);
  const [localCount, setLocalCount] = useState(prayerCount);

  useEffect(() => {
     setLocalHasPrayed(user ? prayedBy.includes(user.uid) : false);
     setLocalCount(prayerCount);
  }, [prayerCount, prayedBy, user]);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    
    // Optimistic update
    const prevHasPrayed = localHasPrayed;
    const prevCount = localCount;
    setLocalHasPrayed(!prevHasPrayed);
    setLocalCount(prev => prevHasPrayed ? prev - 1 : prev + 1);

    let success = false;
    
    if (prevHasPrayed) {
      const res = await prayerService.unprayForRequest(prayerRequestId, user.uid);
      success = res.success;
    } else {
      const res = await prayerService.prayForRequest(prayerRequestId, user.uid, user.displayName || 'Anonymous Believer');
      success = res.success;
    }

    if (!success) {
      // Revert on failure
      setLocalHasPrayed(prevHasPrayed);
      setLocalCount(prevCount);
    } else if (onVoteClick) {
      onVoteClick(!prevHasPrayed);
    }
    
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <button 
        className={`flex items-center gap-2 px-4 py-2 bg-surface-hover text-gray-500 rounded-full font-bold text-sm cursor-not-allowed ${className}`}
        title="Log in to pray"
        disabled
      >
        <Heart className="w-4 h-4" />
        <span>{localCount} Praying</span>
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleVote}
      disabled={isSubmitting}
      className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md overflow-hidden ${
        localHasPrayed
          ? 'bg-gold text-primary-base shadow-[0_0_15px_rgba(200,162,74,0.4)]'
          : 'bg-surface-hover text-gray-300 hover:text-white border border-white/10'
      } ${className}`}
    >
      <motion.div
        animate={isSubmitting ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: isSubmitting ? Infinity : 0, duration: 0.6 }}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            localHasPrayed ? 'fill-primary-base text-primary-base' : 'text-gray-400'
          } ${isHovered && !localHasPrayed ? 'text-rose-500' : ''}`}
        />
      </motion.div>
      <span>
        {localHasPrayed ? "I Prayed" : "I'm Praying"}
      </span>
      <span className={`ml-2 pl-2 border-l ${localHasPrayed ? 'border-primary-base/20' : 'border-white/10'}`}>
        {localCount} 
      </span>
    </motion.button>
  );
}
