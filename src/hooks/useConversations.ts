import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  addParticipants,
  archiveConversation,
  type ConversationDetail,
  type CreateConversationInput,
  createConversation,
  getConversation,
  type ListConversationsParams,
  listConversations,
  removeParticipant,
  type UpdateConversationInput,
  updateConversation,
} from '../api/conversations';
import { useAuthStore } from '../stores/useAuthStore';

interface ApiResponse<T> {
  data: T;
}

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
    placeholderData: keepPreviousData,
    refetchInterval: 10_000,
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

export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateConversationInput;
    }) => updateConversation(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(variables.id),
      });
    },
  });
}

export function useArchiveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

export function useAddParticipants() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      participantIds,
    }: {
      conversationId: string;
      participantIds: string[];
    }) => addParticipants(conversationId, participantIds),
    onMutate: async (variables) => {
      const queryKey = conversationKeys.detail(variables.conversationId);
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<ApiResponse<ConversationDetail>>(queryKey);

      if (previous) {
        const optimisticParticipants = variables.participantIds.map((id) => ({
          id: `temp-${id}`,
          conversation_id: variables.conversationId,
          user_id: id,
          role: 'member',
          nickname: null,
          joined_at: new Date().toISOString(),
        }));

        queryClient.setQueryData<ApiResponse<ConversationDetail>>(queryKey, {
          ...previous,
          data: {
            ...previous.data,
            participants: [
              ...previous.data.participants,
              ...optimisticParticipants,
            ],
          },
        });
      }

      return { previous };
    },
    onError: (_err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          conversationKeys.detail(variables.conversationId),
          context.previous,
        );
      }
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(variables.conversationId),
      });
    },
  });
}

export function useRemoveParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => removeParticipant(conversationId, userId),
    onMutate: async (variables) => {
      const queryKey = conversationKeys.detail(variables.conversationId);
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<ApiResponse<ConversationDetail>>(queryKey);

      if (previous) {
        queryClient.setQueryData<ApiResponse<ConversationDetail>>(queryKey, {
          ...previous,
          data: {
            ...previous.data,
            participants: previous.data.participants.filter(
              (p) => p.user_id !== variables.userId,
            ),
          },
        });
      }

      return { previous };
    },
    onError: (_err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          conversationKeys.detail(variables.conversationId),
          context.previous,
        );
      }
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(variables.conversationId),
      });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

export function useLeaveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) throw new Error('User not authenticated');
      return removeParticipant(conversationId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}
