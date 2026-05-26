
import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { 
  Bell, 
  BookOpen, 
  MessageSquare, 
  Flame, 
  Heart, 
  Music, 
  CheckCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Notification } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function NotificationBell() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch notifications from the server
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user, fetchNotifications]);

  // Click outside and escape key handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        bellButtonRef.current &&
        !bellButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
      });
      if (!res.ok) {
        // Revert on failure
        fetchNotifications();
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    setIsOpen(false);
    
    if (!notification.isRead) {
      // Optimistic update
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
      
      try {
        const res = await fetch(`/api/notifications/${notification.id}/read`, {
          method: 'PATCH',
        });
        if (!res.ok) {
          fetchNotifications();
        }
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
        fetchNotifications();
      }
    }

    // Navigate based on type
    switch (notification.type) {
      case 'prayer':
        navigate('/community');
        break;
      case 'course':
        navigate('/courses');
        break;
      case 'comment':
        navigate('/sermons');
        break;
      case 'movement':
        navigate('/community');
        break;
      case 'donation':
        navigate('/profile');
        break;
      case 'worship':
        navigate('/music');
        break;
      case 'sermon':
        navigate('/sermons');
        break;
      default:
        navigate('/profile/notifications');
        break;
    }
  };

  const handleSeeAll = () => {
    setIsOpen(false);
    navigate('/profile/notifications');
  };

  const getNotificationIcon = (type?: string | null) => {
    switch (type) {
      case 'prayer':
        return <Flame size={16} className="text-[#C8A24A]" />;
      case 'course':
        return <BookOpen size={16} className="text-[#C8A24A]" />;
      case 'comment':
        return <MessageSquare size={16} className="text-[#C8A24A]" />;
      case 'movement':
        return <Flame size={16} className="text-[#C8A24A]" />;
      case 'donation':
        return <Heart size={16} className="text-[#C8A24A]" />;
      case 'worship':
        return <Music size={16} className="text-[#C8A24A]" />;
      case 'sermon':
        return <BookOpen size={16} className="text-[#C8A24A]" />;
      default:
        return <Bell size={16} className="text-[#C8A24A]" />;
    }
  };

  // Only show the notification bell to logged-in users
  if (!user) return null;

  return (
    <div className="relative">
      {/* Bell Toggle Button */}
      <button
        ref={bellButtonRef}
        onClick={handleToggle}
        className="relative p-2 text-gray-400 hover:text-gold transition-colors focus:outline-none"
        aria-label="Toggle notifications"
      >
        <Bell size={20} className={isOpen ? 'text-[#C8A24A]' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 border border-[#0A0A0A]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-3 z-50 w-80 max-h-[480px] bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#121212]/40 backdrop-blur-md">
            <span className="text-sm font-semibold text-white tracking-wide">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#C8A24A] hover:text-[#e0b759] transition-colors flex items-center gap-1 font-medium"
              >
                <CheckCheck size={14} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="overflow-y-auto max-h-72 divide-y divide-white/5">
            {loading && notifications.length === 0 ? (
              // Loading Skeleton
              <div className="p-3 space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/10 rounded w-2/3" />
                      <div className="h-2 bg-white/5 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              // Empty State
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-3">
                  <Bell size={20} />
                </div>
                <p className="text-sm font-medium text-gray-300">All caught up!</p>
                <p className="text-xs text-gray-500 mt-1">No new notifications</p>
              </div>
            ) : (
              // Notifications List
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors relative items-start ${
                    !notification.isRead ? 'bg-white/[0.01]' : ''
                  }`}
                >
                  {/* Left Avatar Icon Placeholder */}
                  <div className="bg-[#C8A24A]/10 border border-[#C8A24A]/20 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Center Content */}
                  <div className="flex flex-col flex-1 min-w-0 pr-2">
                    <span className="text-xs font-semibold text-white tracking-wide leading-tight">
                      {notification.title}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                      {notification.message}
                    </span>
                    <span className="text-[9px] text-gray-500 mt-1 font-medium">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </div>

                  {/* Right Blue Indicator */}
                  {!notification.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <button
            onClick={handleSeeAll}
            className="w-full p-3 border-t border-white/10 text-center text-xs font-semibold text-[#C8A24A] bg-[#121212]/40 hover:bg-[#1A1A1A] hover:text-[#e0b759] transition-all tracking-wider"
          >
            See all notifications →
          </button>
        </div>
      )}
    </div>
  );
}
