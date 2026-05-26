'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type ChatMessage = {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string | null;
  } | null;
};

type UseChatOptions = {
  roomId: string | null;
  initialLimit?: number;
};

type UseChatReturn = {
  messages: ChatMessage[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<boolean>;
  deleteMessage: (messageId: string) => Promise<boolean>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
};

export function useChat({ roomId, initialLimit = 50 }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Fetch initial messages
  const loadMessages = useCallback(
    async (limit: number, skip = 0, append = false) => {
      if (!roomId) return;
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/community/chat/${roomId}/messages?limit=${limit}&offset=${skip}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Failed to load messages');
        const items = (data.messages as ChatMessage[]) ?? [];
        setMessages((prev) => (append ? [...prev, ...items] : items));
        setTotal(data.total ?? items.length);
        setOffset(skip + items.length);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load messages.';
        setError(msg);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [roomId]
  );

  // Subscribe to realtime
  useEffect(() => {
    if (!roomId) return;

    // Dynamic import to avoid SSR issues with Supabase
    void loadMessages(50, 0, false);

    let unsub: (() => void) | null = null;

    import('@/lib/supabase/realtime').then((mod) => {
      unsub = mod.subscribeToChatRoom(roomId, (payload: Record<string, unknown>) => {
        const p = payload as { id: string; content: string; userId: string; roomId: string; isDeleted?: boolean; createdAt: string; updatedAt: string; user?: { id: string; fullName: string | null } | null; __deleted?: boolean };
        if (p.__deleted) {
          setMessages((prev) => prev.filter((m) => m.id !== p.id));
          return;
        }
        setMessages((prev) => {
          // Avoid duplicate inserts
          if (prev.some((m) => m.id === p.id)) return prev;
          return [...prev, {
            id: p.id,
            content: p.content,
            userId: p.userId,
            roomId: p.roomId,
            isDeleted: !!p.isDeleted,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            user: (p.user as { id: string; fullName: string | null } | null) ?? null,
          } as ChatMessage];
        });
      });
    });

    unsubscribeRef.current = unsub;

    return () => {
      if (unsub) unsub();
    };
  }, [roomId, loadMessages]);

  // Reset on room change
  useEffect(() => {
    setMessages([]);
    setOffset(50);
    setTotal(0);
    setError(null);
    setLoading(true);
  }, [roomId]);

  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      if (!roomId || !content.trim()) return false;
      const trimmed = content.trim();
      if (trimmed.length > 500) return false;

      try {
        const res = await fetch(`/api/community/chat/${roomId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: trimmed, roomId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Failed to send');
        return true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to send message.';
        setError(msg);
        return false;
      }
    },
    [roomId]
  );

  const deleteMessage = useCallback(
    async (messageId: string): Promise<boolean> => {
      if (!roomId) return false;
      try {
        const res = await fetch(
          `/api/community/chat/${roomId}/messages/${messageId}`,
          { method: 'DELETE' }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Failed to delete');
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to delete message.');
        return false;
      }
    },
    [roomId]
  );

  const loadMore = useCallback(async () => {
    if (!roomId || loadingMore) return;
    await loadMessages(50, offset, true);
  }, [roomId, offset, loadingMore, loadMessages]);

  const hasMore = offset < total;

  return {
    messages,
    loading,
    loadingMore,
    error,
    sendMessage,
    deleteMessage,
    loadMore,
    hasMore,
  };
}
