import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  deleteMessage,
  type ListMessagesParams,
  listMessages,
  type Message,
  searchMessages,
  type SendMessageInput,
  sendMessage,
  type UpdateMessageInput,
  updateMessage,
} from '../api/messages';
import type { PaginationMeta } from '../api/conversations';
import { useAuthStore } from '../stores/useAuthStore';

interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
}

export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (conversationId: string, params?: ListMessagesParams) =>
    [...messageKeys.lists(), conversationId, params] as const,
  search: (conversationId: string, query: string) =>
    [...messageKeys.all, 'search', conversationId, query] as const,
};

export function useMessages(
  conversationId: string,
  params?: ListMessagesParams,
) {
  return useQuery({
    queryKey: messageKeys.list(conversationId, params),
    queryFn: () => listMessages(conversationId, params),
    enabled: !!conversationId,
    placeholderData: keepPreviousData,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      input,
    }: {
      conversationId: string;
      input: SendMessageInput;
    }) => sendMessage(conversationId, input),
    onMutate: async (variables) => {
      const queryKey = messageKeys.list(variables.conversationId);
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<ApiResponse<Message[]>>(queryKey);

      if (previous) {
        const userId = useAuthStore.getState().user?.id ?? '';
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`,
          conversation_id: variables.conversationId,
          sender_id: userId,
          type: (variables.input.type as Message['type']) ?? 'text',
          content: variables.input.content,
          reply_to_id: variables.input.reply_to_id,
          is_edited: false,
          created_at: new Date().toISOString(),
        };

        queryClient.setQueryData<ApiResponse<Message[]>>(queryKey, {
          ...previous,
          data: [optimisticMessage, ...previous.data],
        });
      }

      return { previous };
    },
    onError: (_err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          messageKeys.list(variables.conversationId),
          context.previous,
        );
      }
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(variables.conversationId),
      });
    },
  });
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      input,
    }: {
      messageId: string;
      conversationId: string;
      input: UpdateMessageInput;
    }) => updateMessage(messageId, input),
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(variables.conversationId),
      });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
    }: {
      messageId: string;
      conversationId: string;
    }) => deleteMessage(messageId),
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(variables.conversationId),
      });
    },
  });
}

export function useSearchMessages(conversationId: string, query: string) {
  return useQuery({
    queryKey: messageKeys.search(conversationId, query),
    queryFn: () => searchMessages(conversationId, query, { limit: 50 }),
    enabled: !!conversationId && query.length >= 2,
    placeholderData: keepPreviousData,
  });
}
