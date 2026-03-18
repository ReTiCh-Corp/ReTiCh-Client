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
  search?: string;
}

export interface Participant {
  id: string;
  conversation_id: string;
  user_id: string;
  role: string;
  nickname: string | null;
  joined_at: string;
}

export interface ConversationDetail extends Conversation {
  participants: Participant[];
}

export interface CreateConversationInput {
  type: 'direct' | 'group' | 'channel';
  name?: string;
  description?: string;
  avatar_url?: string;
  participant_ids?: string[];
}

export interface UpdateConversationInput {
  name?: string;
  description?: string;
  avatar_url?: string;
}

export interface AddParticipantsInput {
  participant_ids: string[];
}

export function listConversations(params?: ListConversationsParams) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  if (params?.search) searchParams.set('search', params.search);

  const query = searchParams.toString();
  const endpoint = `${CONVERSATION_ENDPOINTS.LIST}${query ? `?${query}` : ''}`;

  return apiClient<ApiResponse<Conversation[]>>(endpoint);
}

export function getConversation(id: string) {
  return apiClient<ApiResponse<ConversationDetail>>(
    CONVERSATION_ENDPOINTS.BY_ID(id),
  );
}

export function createConversation(input: CreateConversationInput) {
  return apiClient<ApiResponse<Conversation>>(CONVERSATION_ENDPOINTS.CREATE, {
    method: 'POST',
    body: input,
  });
}

export function updateConversation(id: string, input: UpdateConversationInput) {
  return apiClient<ApiResponse<Conversation>>(
    CONVERSATION_ENDPOINTS.BY_ID(id),
    {
      method: 'PUT',
      body: input,
    },
  );
}

export function archiveConversation(id: string) {
  return apiClient<void>(CONVERSATION_ENDPOINTS.BY_ID(id), {
    method: 'DELETE',
  });
}

export function addParticipants(
  conversationId: string,
  participantIds: string[],
) {
  return apiClient<ApiResponse<Participant[]>>(
    CONVERSATION_ENDPOINTS.PARTICIPANTS(conversationId),
    {
      method: 'POST',
      body: { participant_ids: participantIds } satisfies AddParticipantsInput,
    },
  );
}

export function removeParticipant(conversationId: string, userId: string) {
  return apiClient<void>(
    CONVERSATION_ENDPOINTS.PARTICIPANT(conversationId, userId),
    {
      method: 'DELETE',
    },
  );
}
