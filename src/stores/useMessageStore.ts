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
  // Typing indicators: conversationId → set of user IDs currently typing
  typingUsers: Record<string, string[]>;
  setDraft: (conversationId: string, content: string) => void;
  clearDraft: (conversationId: string) => void;
  getDraft: (conversationId: string) => string;
  setEditingMessage: (message: EditingMessage | null) => void;
  setReplyingTo: (message: ReplyingTo | null) => void;
  addTypingUser: (conversationId: string, userId: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  drafts: {},
  editingMessage: null,
  replyingTo: null,
  typingUsers: {},
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
  addTypingUser: (conversationId, userId) =>
    set((state) => {
      const current = state.typingUsers[conversationId] ?? [];
      if (current.includes(userId)) return state;
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: [...current, userId],
        },
      };
    }),
  removeTypingUser: (conversationId, userId) =>
    set((state) => {
      const current = state.typingUsers[conversationId] ?? [];
      const filtered = current.filter((id) => id !== userId);
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: filtered,
        },
      };
    }),
}));
