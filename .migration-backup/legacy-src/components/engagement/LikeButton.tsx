import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { engagementService } from '../../services/engagementService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface LikeButtonProps {
  contentType: 'devotion' | 'podcast' | 'sermon' | 'news' | 'music' | 'prayer';
  contentId: string;
  contentTitle?: string;
  contentOwnerId?: string;
}

export default function LikeButton({ contentType, contentId, contentTitle, contentOwnerId }: LikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animatedHeart, setAnimatedHeart] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      setLoading(true);
      const countRes = await engagementService.getLikesCount(contentType, contentId);
      if (countRes.success && countRes.data !== undefined) {
        setCount(countRes.data);
      }
      
      if (user) {
        const likedRes = await engagementService.checkUserLiked(contentType, contentId, user.uid);
        if (likedRes.success && likedRes.data !== undefined) {
          setLiked(likedRes.data);
        }
      } else {
        setLiked(false);
      }
      setLoading(false);
    };

    if (contentId) {
      fetchLikes();
    }
  }, [contentType, contentId, user]);

  const handleToggleLike = async () => {
    if (!user) {
      alert('Please log in to like this content.');
      return;
    }
    
    // Optimistic UI updates
    setLiked(!liked);
    setCount(prev => liked ? prev - 1 : prev + 1);
    
    if (!liked) {
      setAnimatedHeart(true);
      setTimeout(() => setAnimatedHeart(false), 1000);
      await engagementService.likeContent(contentType, contentId, user.uid);
      
      // Notify owner
      if (contentOwnerId && contentOwnerId !== user.uid) {
        await notificationService.sendNotification(contentOwnerId, {
          type: 'like',
          title: 'New Like',
          message: `${user.displayName || 'Someone'} liked your ${contentType}${contentTitle ? ` "${contentTitle}"` : ''}.`,
          contentType,
          contentId
        });
      }
    } else {
      await engagementService.unlikeContent(contentType, contentId, user.uid);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 min-w-[60px]">
        <Heart className="w-5 h-5 opacity-50" />
        <span className="text-sm">...</span>
      </div>
    );
  }

  return (
    <button 
      onClick={handleToggleLike}
      className={`flex items-center gap-2 transition-colors relative group ${liked ? 'text-gold' : 'text-gray-400 hover:text-white'}`}
      title={liked ? "Unlike" : "Like"}
    >
      {animatedHeart && (
        <motion.div 
          initial={{ scale: 1, opacity: 1, y: 0 }}
          animate={{ scale: 2, opacity: 0, y: -20 }}
          className="absolute -top-1 left-0 pointer-events-none text-gold"
        >
          <Heart className="w-5 h-5 fill-current" />
        </motion.div>
      )}
      
      <motion.div whileTap={{ scale: 0.8 }}>
        <Heart className={`w-5 h-5 transition-transform ${liked ? 'fill-current' : 'group-hover:scale-110'}`} />
      </motion.div>
      <span className="text-sm font-medium">{count > 0 ? count : ''}</span>
    </button>
  );
}
