import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type Attachment,
  listAttachments,
  listMedia,
  uploadFile,
} from '../api/uploads';
import { messageKeys } from './useMessages';

export const uploadKeys = {
  attachments: (messageId: string) => ['attachments', messageId] as const,
  media: (conversationId: string) => ['media', conversationId] as const,
};

export function useAttachments(messageId: string) {
  return useQuery({
    queryKey: uploadKeys.attachments(messageId),
    queryFn: () => listAttachments(messageId),
    enabled: !!messageId,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      file,
    }: {
      messageId: string;
      conversationId: string;
      file: File;
    }) => uploadFile(messageId, file),
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: uploadKeys.attachments(variables.messageId),
      });
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(variables.conversationId),
      });
    },
  });
}

export function useMedia(conversationId: string) {
  return useQuery({
    queryKey: uploadKeys.media(conversationId),
    queryFn: () => listMedia(conversationId, { limit: 50 }),
    enabled: !!conversationId,
  });
}

export type { Attachment };
