import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addReaction,
  listPinnedMessages,
  listReactions,
  listReadReceipts,
  pinMessage,
  removeReaction,
  unpinMessage,
  updateReadReceipt,
} from '../api/social';

// --- Query Keys ---

export const socialKeys = {
  reactions: (messageId: string) => ['reactions', messageId] as const,
  readReceipts: (conversationId: string) =>
    ['readReceipts', conversationId] as const,
  pinnedMessages: (conversationId: string) =>
    ['pinnedMessages', conversationId] as const,
};

// --- Reactions ---

export function useReactions(messageId: string) {
  return useQuery({
    queryKey: socialKeys.reactions(messageId),
    queryFn: () => listReactions(messageId),
    enabled: !!messageId,
  });
}

export function useAddReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      emoji,
    }: {
      messageId: string;
      emoji: string;
    }) => addReaction(messageId, emoji),
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: socialKeys.reactions(variables.messageId),
      });
    },
  });
}

export function useRemoveReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      emoji,
    }: {
      messageId: string;
      emoji: string;
    }) => removeReaction(messageId, emoji),
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: socialKeys.reactions(variables.messageId),
      });
    },
  });
}

// --- Read Receipts ---

export function useReadReceipts(conversationId: string) {
  return useQuery({
    queryKey: socialKeys.readReceipts(conversationId),
    queryFn: () => listReadReceipts(conversationId),
    enabled: !!conversationId,
  });
}

export function useUpdateReadReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      lastReadMessageId,
    }: {
      conversationId: string;
      lastReadMessageId: string;
    }) => updateReadReceipt(conversationId, lastReadMessageId),
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: socialKeys.readReceipts(variables.conversationId),
      });
    },
  });
}

// --- Pinned Messages ---

export function usePinnedMessages(conversationId: string) {
  return useQuery({
    queryKey: socialKeys.pinnedMessages(conversationId),
    queryFn: () => listPinnedMessages(conversationId),
    enabled: !!conversationId,
  });
}

export function usePinMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId: string;
    }) => pinMessage(conversationId, messageId),
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: socialKeys.pinnedMessages(variables.conversationId),
      });
    },
  });
}

export function useUnpinMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId: string;
    }) => unpinMessage(conversationId, messageId),
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: socialKeys.pinnedMessages(variables.conversationId),
      });
    },
  });
}
