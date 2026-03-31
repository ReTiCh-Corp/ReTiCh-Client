import { apiClient } from './client';
import type { PaginationMeta } from './conversations';
import { MESSAGE_ENDPOINTS } from './endpoints';

export interface MessageReaction {
  emoji: string;
  user_id: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'system';
  content: string | null;
  metadata?: Record<string, unknown>;
  reply_to_id?: string;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  reactions?: MessageReaction[];
}

interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
}

export interface ListMessagesParams {
  limit?: number;
  offset?: number;
}

export interface SendMessageInput {
  type?: string;
  content: string;
  metadata?: Record<string, unknown>;
  reply_to_id?: string;
}

export interface UpdateMessageInput {
  content: string;
}

export function listMessages(
  conversationId: string,
  params?: ListMessagesParams,
) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset !== undefined && params.offset > 0)
    searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  const endpoint = `${MESSAGE_ENDPOINTS.BY_CONVERSATION(conversationId)}${query ? `?${query}` : ''}`;

  return apiClient<ApiResponse<Message[]>>(endpoint);
}

export function sendMessage(conversationId: string, input: SendMessageInput) {
  return apiClient<ApiResponse<Message>>(
    MESSAGE_ENDPOINTS.SEND(conversationId),
    {
      method: 'POST',
      body: input,
    },
  );
}

export function updateMessage(messageId: string, input: UpdateMessageInput) {
  return apiClient<ApiResponse<Message>>(MESSAGE_ENDPOINTS.BY_ID(messageId), {
    method: 'PUT',
    body: input,
  });
}

export function deleteMessage(messageId: string) {
  return apiClient<void>(MESSAGE_ENDPOINTS.BY_ID(messageId), {
    method: 'DELETE',
  });
}

export function searchMessages(
  conversationId: string,
  query: string,
  params?: { limit?: number; offset?: number },
) {
  const searchParams = new URLSearchParams();
  searchParams.set('q', query);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const endpoint = `${MESSAGE_ENDPOINTS.SEARCH(conversationId)}?${searchParams.toString()}`;
  return apiClient<ApiResponse<Message[]>>(endpoint);
}
