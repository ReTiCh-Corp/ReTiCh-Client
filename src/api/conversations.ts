import { apiClient } from './client';
import { CONVERSATION_ENDPOINTS } from './endpoints';

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name: string | null;
  description: string | null;
  avatar_url: string | null;
  creator_id: string | null;
  is_archived: boolean;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
}

export interface ListConversationsParams {
  limit?: number;
  offset?: number;
}

export interface CreateConversationInput {
  type: 'direct' | 'group' | 'channel';
  name?: string;
  description?: string;
  avatar_url?: string;
}

export function listConversations(params?: ListConversationsParams) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  const endpoint = `${CONVERSATION_ENDPOINTS.LIST}${query ? `?${query}` : ''}`;

  return apiClient<ApiResponse<Conversation[]>>(endpoint);
}

export function getConversation(id: string) {
  return apiClient<ApiResponse<Conversation>>(CONVERSATION_ENDPOINTS.BY_ID(id));
}

export function createConversation(input: CreateConversationInput) {
  return apiClient<ApiResponse<Conversation>>(CONVERSATION_ENDPOINTS.CREATE, {
    method: 'POST',
    body: input,
  });
}
