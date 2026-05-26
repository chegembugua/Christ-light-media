
import { useLocation } from 'wouter';

type ChatRoom = {
  id: string;
  name: string;
  description: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
};

interface ChatRoomListProps {
  rooms: ChatRoom[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  unreadCounts?: Record<string, number>;
}

const DOT_COLORS: Record<string, string> = {
  'General': 'bg-blue-500',
  'Prayer Support': 'bg-green-500',
  'Worship & Praise': 'bg-[#C8A24A]',
  'Testimony Sharing': 'bg-pink-500',
};

function fmtTime(input: string | null) {
  if (!input) return '';
  const d = new Date(input);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ChatRoomList({
  rooms,
  activeRoomId,
  onSelectRoom,
  unreadCounts,
}: ChatRoomListProps) {
  const [, navigate] = useLocation();

  return (
    <aside className="flex w-full flex-col border-r border-white/5 bg-[#0F0F0F] md:w-64 md:min-h-0 md:pb-24">
      {/* Sidebar header */}
      <div className="border-b border-white/5 p-4">
        <h2 className="font-cinzel text-xl font-bold text-white">Chat Rooms</h2>
      </div>

      {/* Room list */}
      <nav className="flex-1 overflow-y-auto p-2">
        {rooms.map((room) => {
          const isActive = room.id === activeRoomId;
          const unread = unreadCounts?.[room.id] ?? 0;
          const dotColor = DOT_COLORS[room.name] || 'bg-gray-500';

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => {
                onSelectRoom(room.id);
                navigate(`/community/chat?room=${room.id}`);
              }}
              className={`
                group relative w-full rounded-xl border border-transparent px-4 py-3 text-left transition-all
                ${isActive
                  ? 'border-l-[3px] border-l-[#C8A24A] bg-[#C8A24A]/5'
                  : 'hover:bg-white/5'
                }
              `}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* Unread dot */}
                  <span
                    className={`block h-2.5 w-2.5 shrink-0 rounded-full ${dotColor} ${
                      unread > 0 ? 'opacity-100' : 'opacity-30'
                    }`}
                  />

                  <span
                    className={`text-sm font-semibold ${
                      isActive ? 'text-[#C8A24A]' : 'text-gray-300'
                    } group-hover:text-white transition-colors`}
                  >
                    {room.name}
                  </span>
                </div>

                {/* Unread badge */}
                {unread > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </div>

              {/* Last message preview */}
              {room.lastMessage && (
                <>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                    {room.lastMessage}
                  </p>
                  {room.lastMessageTime && (
                    <span className="mt-0.5 text-[10px] text-gray-600">
                      {fmtTime(room.lastMessageTime)}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
