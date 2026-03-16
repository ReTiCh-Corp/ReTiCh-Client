import { create } from 'zustand';

interface Conversation {
  id: string;
  name: string;
  participants: string[];
  lastMessageAt: string;
}

interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (id: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
}

export const useConversationStore = create<ConversationState>()((set) => ({
  conversations: [],
  currentConversationId: null,
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
    })),
  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
    })),
}));
