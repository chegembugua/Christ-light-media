'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Trash2, Flag, MoreVertical } from 'lucide-react';
import type { ChatMessage } from '@/lib/hooks/useChat';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  loading?: boolean;
  onDeleteMessage?: (messageId: string) => void;
}

type MessageGroup = {
  userId: string;
  messageIds: string[];
};

function getUserDisplayName(message: ChatMessage) {
  if (!message.user?.fullName) return 'Anonymous';
  return message.user.fullName;
}

function getInitials(name: string | null | undefined) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function groupMessages(messages: ChatMessage[]): { groups: MessageGroup[]; separators: Set<string> } {
  const groups: MessageGroup[] = [];
  const separators = new Set<string>();
  const FIVE_MINUTES = 5 * 60 * 1000;

  let currentGroup: MessageGroup | null = null;

  for (const msg of messages) {
    if (!currentGroup || currentGroup.userId !== msg.userId) {
      currentGroup = { userId: msg.userId, messageIds: [msg.id] };
      groups.push(currentGroup);
      // Time separator for new sender
      const ms = new Date(msg.createdAt);
      const h = ms.getHours() % 12 || 12;
      const ampm = ms.getHours() >= 12 ? 'PM' : 'AM';
      separators.add(`${h}:${String(ms.getMinutes()).padStart(2, '0')} ${ampm}`);
    } else if (currentGroup) {
      const firstMsgOfGroup = messages.find((m) => m.id === currentGroup!.messageIds[0]);
      const timeDiff = new Date(msg.createdAt).getTime() - new Date(firstMsgOfGroup?.createdAt ?? 0).getTime();
      if (timeDiff > FIVE_MINUTES) {
        // Same user but too far apart — start new group
        currentGroup = { userId: msg.userId, messageIds: [msg.id] };
        groups.push(currentGroup);
        const ms = new Date(msg.createdAt);
        const h = ms.getHours() % 12 || 12;
        const ampm = ms.getHours() >= 12 ? 'PM' : 'AM';
        separators.add(`${h}:${String(ms.getMinutes()).padStart(2, '0')} ${ampm}`);
      } else {
        currentGroup.messageIds.push(msg.id);
      }
    }
  }

  return { groups, separators };
}

export default function MessageList({
  messages,
  currentUserId,
  loading,
  onDeleteMessage,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showAtBottom, setShowAtBottom] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Auto-scroll when new messages arrive at bottom
  useEffect(() => {
    if (showAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showAtBottom]);

  // Detect if user is scrolled to bottom
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 80;
    setShowAtBottom(nearBottom);
  }, []);

  const scrollToBottom = () => {
    setShowAtBottom(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-28 animate-pulse rounded bg-white/5" />
              <div className="h-4 w-full animate-pulse rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-center text-sm text-gray-500">
          Be the first to share in this room!
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1">
      {!showAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute right-4 bottom-4 z-10 rounded-full border border-[#C8A24A]/30 bg-[#C8A24A]/10 px-3 py-1.5 text-xs font-semibold text-[#C8A24A] hover:bg-[#C8A24A]/20 transition-colors"
        >
          ↓ New messages
        </button>
      )}

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex h-full flex-col gap-1 overflow-y-auto p-4"
      >
        {messages.map((msg) => {
          const isOwn = msg.userId === currentUserId;
          const isDeleted = msg.isDeleted;
          const displayName = getUserDisplayName(msg);

          return (
            <div
              key={msg.id}
              className={cn(
                'group relative flex gap-3',
                isOwn && 'flex-row-reverse'
              )}
            >
              {/* Avatar — only show for first message in group or standalone */}
              {(!msg.user || true) && (
                <div
                  className={cn(
                    'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    isOwn
                      ? 'bg-[#C8A24A]/20 text-[#C8A24A]'
                      : 'bg-white/[0.07] text-gray-400'
                  )}
                >
                  {getInitials(displayName)}
                </div>
              )}

              <div className={cn('flex max-w-[75%] flex-col', isOwn && 'items-end')}>
                {/* Name + timestamp — show only on first message from user */}
                <div className={cn('mb-0.5 flex items-center gap-2', isOwn && 'flex-row-reverse')}>
                  {!isOwn && (
                    <span className="text-xs font-semibold text-gray-300">
                      {displayName}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-600">
                    {formatRelativeTime(new Date(msg.createdAt))}
                  </span>
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2.5 text-sm',
                    isOwn
                      ? 'rounded-tr-sm bg-[#C8A24A]/10 text-white border border-[#C8A24A]/20'
                      : 'rounded-tl-sm bg-white/[0.05] text-white border border-white/[0.06]',
                    isDeleted && 'opacity-50 italic text-gray-500'
                  )}
                >
                  {isDeleted ? 'This message was deleted' : msg.content}
                </div>

                {/* Hover actions */}
                <div
                  className={cn(
                    'mt-0.5 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100',
                    isOwn ? 'flex-row-reverse' : ''
                  )}
                >
                  {isOwn && onDeleteMessage && (
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-400 hover:bg-red-500/10"
                      title="Delete message"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  )}
                  <button
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500 hover:bg-white/5"
                    title="Report"
                  >
                    <Flag size={11} /> Report
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
