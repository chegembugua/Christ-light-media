/**
 * lib/supabase/realtime.ts
 * Supabase Realtime helpers for the chat system.
 * Import from: import { subscribeToChatRoom } from '@/lib/supabase/realtime';
 */

import { supabase } from './client';
import type { RealtimeChannel } from '@supabase/supabase-js';

let activeChannels: Map<string, RealtimeChannel> = new Map();

/**
 * Subscribe to new messages inserted into a chat room.
 * Returns unsubscribe function.
 */
export function subscribeToChatRoom(
  roomId: string,
  onNewMessage: (message: Record<string, unknown>) => void
) {
  if (activeChannels.has(roomId)) {
    activeChannels.get(roomId)?.on('broadcast', { event: 'message' }, (event) => {
      onNewMessage(event.payload as Record<string, unknown>);
    });
    return () => {};
  }

  const channel = supabase.channel(`chat:${roomId}`);

  channel
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'Message',
        filter: `roomId=eq.${roomId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Record<string, unknown>);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'Message',
        filter: `roomId=eq.${roomId}`,
      },
      (payload) => {
        onNewMessage({ ...(payload.old as Record<string, unknown>), __deleted: true });
      }
    )
    .subscribe();

  activeChannels.set(roomId, channel);
  return () => {
    supabase.removeChannel(channel);
    activeChannels.delete(roomId);
  };
}

/**
 * Subscribe to message deletions in a room.
 */
export function subscribeToMessageDeletes(
  roomId: string,
  onDelete: (messageId: string) => void
) {
  return subscribeToChatRoom(roomId, (payload) => {
    if ((payload as { __deleted?: boolean }).__deleted) {
      onDelete(String(payload.id ?? ''));
    }
  });
}

/**
 * Unsubscribe from a specific room channel.
 */
export function unsubscribeFromRoom(roomId: string) {
  const channel = activeChannels.get(roomId);
  if (channel) {
    supabase.removeChannel(channel);
    activeChannels.delete(roomId);
  }
}

/**
 * Unsubscribe from all active chat channels.
 */
export function unsubscribeAll() {
  activeChannels.forEach((channel) => {
    supabase.removeChannel(channel);
  });
  activeChannels.clear();
}
