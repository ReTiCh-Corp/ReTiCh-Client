import { create } from 'zustand';

interface EditingMessage {
  id: string;
  content: string;
}

interface ReplyingTo {
  id: string;
  content: string;
  senderName: string;
}

interface MessageState {
  drafts: Record<string, string>;
  editingMessage: EditingMessage | null;
  replyingTo: ReplyingTo | null;
  setDraft: (conversationId: string, content: string) => void;
  clearDraft: (conversationId: string) => void;
  getDraft: (conversationId: string) => string;
  setEditingMessage: (message: EditingMessage | null) => void;
  setReplyingTo: (message: ReplyingTo | null) => void;
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  drafts: {},
  editingMessage: null,
  replyingTo: null,
  setDraft: (conversationId, content) =>
    set((state) => ({
      drafts: { ...state.drafts, [conversationId]: content },
    })),
  clearDraft: (conversationId) =>
    set((state) => {
      const { [conversationId]: _, ...rest } = state.drafts;
      return { drafts: rest };
    }),
  getDraft: (conversationId) => get().drafts[conversationId] ?? '',
  setEditingMessage: (message) =>
    set({ editingMessage: message, replyingTo: null }),
  setReplyingTo: (message) =>
    set({ replyingTo: message, editingMessage: null }),
}));
