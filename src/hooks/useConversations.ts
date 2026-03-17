import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type CreateConversationInput,
  createConversation,
  getConversation,
  type ListConversationsParams,
  listConversations,
} from '../api/conversations';

export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (params?: ListConversationsParams) =>
    [...conversationKeys.lists(), params] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
};

export function useConversations(params?: ListConversationsParams) {
  return useQuery({
    queryKey: conversationKeys.list(params),
    queryFn: () => listConversations(params),
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: conversationKeys.detail(id),
    queryFn: () => getConversation(id),
    enabled: !!id,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateConversationInput) => createConversation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}
