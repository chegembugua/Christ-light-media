import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, Radio as RadioIcon, Info, MessageCircle, Heart, Video, Headphones, Newspaper } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { notificationService, NotificationItem } from '../services/notificationService';
import { radioSocketService } from '../services/radioSocketService';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Initial fetch
    const fetchNotifications = async () => {
      const res = await notificationService.getUserNotifications(user.uid, 20);
      if (res.success && res.data) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.isRead).length);
      }
    };

    fetchNotifications();

    // Listen for real-time socket events
    const socket = radioSocketService.getSocket();
    
    const handleNewNotification = (data: Partial<NotificationItem>) => {
      if (data.userId === user.uid || data.userId === 'all') {
        // Fetch to ensure we get the correct doc ID and sync state
        fetchNotifications();
        
        // Show subtle toast for prayer intercession
        if (data.type === 'prayer_intercession') {
           setToastMessage(`${data.intercessorName || 'Someone'} just prayed for you`);
           setTimeout(() => setToastMessage(null), 5000); // 5 seconds
        }
      }
    };

    if (socket) {
      socket.on('new_notification', handleNewNotification);
    }
    
    // We should also check when the socket connects if we didn't have it
    // But since the socket usually connects early on, we will just rely on it directly
    // If not, a firestore listener would be technically more robust, but requirements say to use Socket.io

    return () => {
      if (socket) {
         socket.off('new_notification', handleNewNotification);
      }
    };
  }, [user]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const res = await notificationService.markAsRead(id);
    if (res.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    const res = await notificationService.markAllAsRead(user!.uid);
    if (res.success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead && notification.id) {
       handleMarkAsRead(notification.id);
    }
    setIsOpen(false);

    // Navigate logic based on content
    if (notification.type === 'radio_alert') {
      navigate('/radio');
    } else if (notification.contentType && notification.contentId) {
      if (notification.contentType === 'prayer') {
         navigate(`/community/prayer-requests/${notification.contentId}`);
      } else {
        const typePlurals: Record<string, string> = {
          'podcast': 'podcasts',
          'sermon': 'sermons',
          'news': 'news',
          'devotion': 'devotions',
          'music': 'music'
        };
        const pathSegment = typePlurals[notification.contentType] || notification.contentType;
        navigate(`/${pathSegment}/${notification.contentId}`);
      }
    } else if (notification.prayerRequestId) {
       navigate(`/community/prayer-requests/${notification.prayerRequestId}`);
    }
  };

  const getIcon = (type: string, contentType?: string) => {
    if (type === 'prayer_intercession') return <Heart className="w-4 h-4 text-rose-500" fill="currentColor" />;
    if (type === 'prayer_comment') return <MessageCircle className="w-4 h-4 text-gold" />;
    if (type === 'prayer_answered') return <Check className="w-4 h-4 text-emerald-500" />;
    if (type === 'like') return <Heart className="w-4 h-4 text-gold" fill="currentColor" />;
    if (type === 'comment') return <MessageCircle className="w-4 h-4 text-gold" />;
    if (type === 'radio_alert') return <RadioIcon className="w-4 h-4 text-gold" />;
    
    if (type === 'new_content') {
       if (contentType === 'sermon') return <Video className="w-4 h-4 text-gold" />;
       if (contentType === 'podcast') return <Headphones className="w-4 h-4 text-gold" />;
       if (contentType === 'news') return <Newspaper className="w-4 h-4 text-gold" />;
    }
    return <Info className="w-4 h-4 text-gold" />;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-300 hover:text-white transition-colors p-2"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-gold border border-primary-base"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[80vh] flex flex-col bg-surface-base border border-surface-hover rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden transform origin-top-right transition-all animate-fade-in-holy">
          <div className="p-4 border-b border-surface-hover flex items-center justify-between bg-primary-base">
            <h3 className="text-white font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-gold hover:text-white transition-colors uppercase tracking-widest font-medium"
              >
                Mark All Read
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                You have no notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 rounded-lg flex items-start gap-4 cursor-pointer transition-colors ${
                    notification.isRead 
                      ? 'hover:bg-white/5 opacity-75' 
                      : 'bg-gold/5 border border-gold/20 hover:bg-gold/10'
                  }`}
                >
                  <div className="mt-1 shrink-0 bg-surface-hover p-2 rounded-full hidden sm:block">
                    {getIcon(notification.type, notification.contentType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className={`text-sm truncate ${!notification.isRead ? 'text-white font-medium' : 'text-gray-300'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[10px] text-gray-500 shrink-0 whitespace-nowrap">
                        {formatDistanceToNow(notification.createdAt)} ago
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button 
                      onClick={(e) => handleMarkAsRead(notification.id!, e)}
                      className="shrink-0 text-gray-500 hover:text-gold transition-colors mt-2"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Gentle Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-surface-base border border-gold/30 p-4 rounded-2xl shadow-[0_10px_30px_rgba(200,162,74,0.15)] flex items-center gap-3 backdrop-blur-md"
          >
            <div className="bg-rose-500/10 p-2 rounded-full text-rose-500 flex items-center justify-center shrink-0">
               <Heart className="w-5 h-5 fill-current animate-pulse" />
            </div>
            <div>
               <p className="text-white text-sm font-medium">{toastMessage}</p>
               <p className="text-gray-400 text-xs mt-0.5">Community is lifting you up</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
