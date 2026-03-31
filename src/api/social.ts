import { apiClient } from './client';
import { MESSAGE_ENDPOINTS } from './endpoints';

// --- Types ---

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface ReadReceipt {
  id: string;
  conversation_id: string;
  user_id: string;
  last_read_message_id: string;
  last_read_at: string;
}

export interface PinnedMessage {
  id: string;
  conversation_id: string;
  message_id: string;
  pinned_by: string;
  pinned_at: string;
}

interface ApiResponse<T> {
  data: T;
}

// --- Reactions ---

export function addReaction(messageId: string, emoji: string) {
  return apiClient<ApiResponse<Reaction>>(
    MESSAGE_ENDPOINTS.REACTIONS(messageId),
    { method: 'POST', body: { emoji } },
  );
}

export function removeReaction(messageId: string, emoji: string) {
  return apiClient<void>(MESSAGE_ENDPOINTS.REACTION(messageId, emoji), {
    method: 'DELETE',
  });
}

export function listReactions(messageId: string) {
  return apiClient<ApiResponse<Reaction[]>>(
    MESSAGE_ENDPOINTS.REACTIONS(messageId),
  );
}

// --- Read Receipts ---

export function updateReadReceipt(
  conversationId: string,
  lastReadMessageId: string,
) {
  return apiClient<ApiResponse<ReadReceipt>>(
    MESSAGE_ENDPOINTS.READ_RECEIPTS(conversationId),
    { method: 'POST', body: { last_read_message_id: lastReadMessageId } },
  );
}

export function listReadReceipts(conversationId: string) {
  return apiClient<ApiResponse<ReadReceipt[]>>(
    MESSAGE_ENDPOINTS.READ_RECEIPTS(conversationId),
  );
}

// --- Pinned Messages ---

export function pinMessage(conversationId: string, messageId: string) {
  return apiClient<ApiResponse<PinnedMessage>>(
    MESSAGE_ENDPOINTS.PINS(conversationId),
    { method: 'POST', body: { message_id: messageId } },
  );
}

export function unpinMessage(conversationId: string, messageId: string) {
  return apiClient<void>(MESSAGE_ENDPOINTS.PIN(conversationId, messageId), {
    method: 'DELETE',
  });
}

export function listPinnedMessages(conversationId: string) {
  return apiClient<ApiResponse<PinnedMessage[]>>(
    MESSAGE_ENDPOINTS.PINS(conversationId),
  );
}
