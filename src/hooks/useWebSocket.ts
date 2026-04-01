import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Message } from '../api/messages';
import type { PaginationMeta } from '../api/conversations';
import { WS_ENDPOINT } from '../api/endpoints';
import { useAuthStore } from '../stores/useAuthStore';
import { useMessageStore } from '../stores/useMessageStore';
import { usePresenceStore } from '../stores/usePresenceStore';
import { conversationKeys } from './useConversations';
import { messageKeys } from './useMessages';

export type WSStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

interface WSEvent {
  type: string;
  conversation_id: string;
  payload: unknown;
}

interface MessageListResponse {
  data: Message[];
  pagination?: PaginationMeta;
}

const MAX_RECONNECT_DELAY = 30000;
const INITIAL_RECONNECT_DELAY = 1000;

function getWSBaseUrl(): string {
  const httpBase = import.meta.env.VITE_API_BASE_URL as string;
  return httpBase.replace(/^http/, 'ws');
}

export function useWebSocket() {
  const [status, setStatus] = useState<WSStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const queryClient = useQueryClient();

  const handleEvent = useCallback(
    (event: WSEvent) => {
      const conversationId = event.conversation_id;
      // Find matching query keys for this conversation
      const queryKey = messageKeys.list(conversationId);

      switch (event.type) {
        case 'message.new': {
          const newMessage = event.payload as Message;
          // Update the message list cache by prepending the new message
          queryClient.setQueriesData<MessageListResponse>(
            { queryKey: messageKeys.lists() },
            (old) => {
              if (!old) return old;
              // Only update if this cache entry is for the right conversation
              const firstMsg = old.data[0];
              if (firstMsg && firstMsg.conversation_id !== conversationId) {
                return old;
              }
              // Avoid duplicates (optimistic update might have added it)
              if (old.data.some((m) => m.id === newMessage.id)) {
                // Replace the temp/optimistic version with the real one
                return {
                  ...old,
                  data: old.data.map((m) =>
                    m.id === newMessage.id ? newMessage : m,
                  ),
                };
              }
              return {
                ...old,
                data: [newMessage, ...old.data],
                pagination: old.pagination
                  ? {
                      ...old.pagination,
                      total: old.pagination.total + 1,
                    }
                  : undefined,
              };
            },
          );
          // Also invalidate to get fresh data on next focus
          queryClient.invalidateQueries({ queryKey, refetchType: 'none' });
          // Refresh conversation list to update unread counts
          queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
          break;
        }

        case 'message.updated': {
          const updatedMessage = event.payload as Message;
          queryClient.setQueriesData<MessageListResponse>(
            { queryKey: messageKeys.lists() },
            (old) => {
              if (!old) return old;
              return {
                ...old,
                data: old.data.map((m) =>
                  m.id === updatedMessage.id ? updatedMessage : m,
                ),
              };
            },
          );
          break;
        }

        case 'message.deleted': {
          const { id } = event.payload as { id: string };
          queryClient.setQueriesData<MessageListResponse>(
            { queryKey: messageKeys.lists() },
            (old) => {
              if (!old) return old;
              return {
                ...old,
                data: old.data.filter((m) => m.id !== id),
                pagination: old.pagination
                  ? {
                      ...old.pagination,
                      total: Math.max(0, old.pagination.total - 1),
                    }
                  : undefined,
              };
            },
          );
          break;
        }

        case 'reaction.added':
        case 'reaction.removed':
          // Invalidate reactions for the affected message
          queryClient.invalidateQueries({
            queryKey: ['reactions'],
          });
          break;

        case 'read.updated':
          queryClient.invalidateQueries({
            queryKey: ['readReceipts', conversationId],
          });
          queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
          break;

        case 'message.pinned':
        case 'message.unpinned':
          queryClient.invalidateQueries({
            queryKey: ['pinnedMessages', conversationId],
          });
          break;

        case 'typing.start': {
          const { user_id } = event.payload as { user_id: string };
          if (user_id) {
            useMessageStore.getState().addTypingUser(conversationId, user_id);
          }
          break;
        }

        case 'typing.stop': {
          const { user_id: stoppedUserId } = event.payload as { user_id: string };
          if (stoppedUserId) {
            useMessageStore.getState().removeTypingUser(conversationId, stoppedUserId);
          }
          break;
        }

        case 'presence.online': {
          const { user_id: onlineUserId } = event.payload as { user_id: string };
          if (onlineUserId) {
            usePresenceStore.getState().setOnline(onlineUserId);
          }
          break;
        }

        case 'presence.offline': {
          const { user_id: offlineUserId } = event.payload as { user_id: string };
          if (offlineUserId) {
            usePresenceStore.getState().setOffline(offlineUserId);
          }
          break;
        }

        case 'presence.snapshot': {
          const { online_user_ids } = event.payload as { online_user_ids: string[] };
          if (online_user_ids) {
            usePresenceStore.getState().setBulkOnline(online_user_ids);
          }
          break;
        }

        default:
          break;
      }
    },
    [queryClient],
  );

  const connect = useCallback(() => {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      setStatus('disconnected');
      return;
    }

    setStatus(reconnectAttemptRef.current > 0 ? 'reconnecting' : 'connecting');

    const wsUrl = `${getWSBaseUrl()}${WS_ENDPOINT}?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setStatus('connected');
      reconnectAttemptRef.current = 0;
    };

    ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data as string) as WSEvent;
        handleEvent(event);
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onclose = (e) => {
      wsRef.current = null;
      setStatus('disconnected');
      usePresenceStore.getState().clearAll();

      // Don't reconnect on intentional close (1000) or auth failure (4001)
      if (e.code === 1000 || e.code === 4001) return;

      // Exponential backoff reconnect
      const delay = Math.min(
        INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttemptRef.current),
        MAX_RECONNECT_DELAY,
      );
      reconnectAttemptRef.current += 1;
      reconnectTimeoutRef.current = setTimeout(connect, delay);
    };

    ws.onerror = () => {
      // onclose will fire after onerror
    };

    wsRef.current = ws;
  }, [handleEvent]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close(1000);
      wsRef.current = null;
    }
    setStatus('disconnected');
    reconnectAttemptRef.current = 0;
  }, []);

  // Send a typed event through the WebSocket
  const sendEvent = useCallback(
    (type: string, conversationId: string, payload?: unknown) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type,
            conversation_id: conversationId,
            payload: payload ?? {},
          }),
        );
      }
    },
    [],
  );

  // Auto-connect when authenticated, disconnect on logout
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state, prev) => {
      if (state.accessToken && !prev.accessToken) {
        connect();
      }
      if (!state.accessToken && prev.accessToken) {
        disconnect();
      }
    });

    // Connect immediately if already authenticated
    if (useAuthStore.getState().accessToken) {
      connect();
    }

    return () => {
      unsubscribe();
      disconnect();
    };
  }, [connect, disconnect]);

  return { status, sendEvent, disconnect };
}
