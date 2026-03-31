import { create } from 'zustand';

interface EditingMessage {
  id: string;
  content: string;
}

interface MessageState {
  drafts: Record<string, string>;
  editingMessage: EditingMessage | null;
  setDraft: (conversationId: string, content: string) => void;
  clearDraft: (conversationId: string) => void;
  getDraft: (conversationId: string) => string;
  setEditingMessage: (message: EditingMessage | null) => void;
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  drafts: {},
  editingMessage: null,
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
  setEditingMessage: (message) => set({ editingMessage: message }),
}));
