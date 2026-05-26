
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import ChatRoomList from '@/components/chat/ChatRoomList';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import { useChat } from '@/lib/hooks/useChat';
import { cn } from '@/lib/utils';

type ChatRoom = {
  id: string;
  name: string;
  description: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
};

const DEFAULT_ROOMS: ChatRoom[] = [
  { id: 'general', name: 'General', description: 'Open fellowship — all are welcome here.', lastMessage: null, lastMessageTime: null, unreadCount: 0 },
  { id: 'prayer-support', name: 'Prayer Support', description: 'Lift your requests and pray with those in need.', lastMessage: null, lastMessageTime: null, unreadCount: 0 },
  { id: 'worship-praise', name: 'Worship & Praise', description: 'Celebrate God! Share testimonies, songs, and worship moments.', lastMessage: null, lastMessageTime: null, unreadCount: 0 },
  { id: 'testimony', name: 'Testimony Sharing', description: 'Share how God is moving in your life.', lastMessage: null, lastMessageTime: null, unreadCount: 0 },
];

export default function CommunityChatPage() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const { user, loading: authLoading } = useAuth();

  const [rooms, setRooms] = useState<ChatRoom[]>(DEFAULT_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string>(
    searchParams.get('room') || 'general'
  );
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Load rooms from API (seed DB rooms first, then fall back to hardcoded)
  useEffect(() => {
    if (authLoading) return;
    fetch('/api/community/chat/rooms')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.rooms?.length) {
          const merged = data.rooms.map((room: ChatRoom) => {
            const fallback = DEFAULT_ROOMS.find((d) => d.name === room.name);
            return { ...fallback, ...room };
          });
          setRooms(merged);
          // Ensure activeRoomId is valid against fetched IDs; if not, use first room
          setActiveRoomId((current) => {
            const ids = new Set(merged.map((r: ChatRoom) => r.id));
            return ids.has(current) ? current : (merged[0]?.id ?? current);
          });
        }
      })
      .catch(() => {});
  }, [authLoading]);

  const activeRoom = useMemo(
    () => rooms.find((r) => r.id === activeRoomId) ?? DEFAULT_ROOMS[0],
    [rooms, activeRoomId]
  );

  // Keep roomId in sync with ?room= query param
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('room');
    if (q && q !== activeRoomId) setActiveRoomId(q);
  }, [activeRoomId]);

  // Close Unread badge for room
  const markRoomRead = useCallback((roomId: string) => {
    setUnreadCounts((prev) => {
      if (!prev[roomId]) return prev;
      const next = { ...prev };
      next[roomId] = 0;
      return next;
    });
  }, []);

  const { messages, sendMessage, deleteMessage } = useChat({ roomId: activeRoomId });

  if (!authLoading && !user) {
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-0 px-4 md:flex-row">
        {/* ── Sidebar ─────────────────────────────────── */}
        <ChatRoomList
          rooms={rooms}
          activeRoomId={activeRoomId}
          onSelectRoom={setActiveRoomId}
          unreadCounts={unreadCounts}
        />

        {/* ── Main chat area ──────────────────────────── */}
        <main className="flex flex-1 flex-col min-h-[70vh] md:min-h-0">
          {activeRoom ? (
            <>
              {/* Header */}
              <header className="sticky top-20 z-10 flex items-center justify-between border-b border-white/5 bg-[#0A0A0A]/90 p-4 backdrop-blur-md">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-white md:text-2xl">
                    {activeRoom.name}
                  </h3>
                  {activeRoom.description && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {activeRoom.description}
                    </p>
                  )}
                </div>
                <button
                  className="rounded-lg p-2 text-gray-500 hover:text-gold transition-colors"
                  title="Room settings (coming soon)"
                >
                  <Settings size={18} />
                </button>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-hidden">
                <MessageList
                  messages={messages}
                  currentUserId={user?.id ?? ''}
                  onDeleteMessage={async (messageId) => {
                    const ok = await deleteMessage(messageId);
                    if (ok) toast.success('Message deleted.');
                    else toast.error('Could not delete message.');
                  }}
                />
              </div>

              {/* Input */}
              {activeRoom && (
                <MessageInput
                  onSendMessage={async (content) => {
                    const ok = await sendMessage(content);
                    if (!ok) {
                      toast.error('Failed to send message.');
                      return;
                    }
                    markRoomRead(activeRoomId);
                  }}
                />
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500">Select a room to start chatting.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
