import { create } from 'zustand';
import type { Conversation, Participant } from '../api/conversations';

interface LocalConversation {
  id: string;
  name: string;
  participants: Participant[];
  lastMessageAt: string;
}

interface ConversationState {
  conversations: LocalConversation[];
  currentConversationId: string | null;
  searchTerm: string;
  searchResults: Conversation[];
  setConversations: (conversations: LocalConversation[]) => void;
  setCurrentConversation: (id: string | null) => void;
  addConversation: (conversation: LocalConversation) => void;
  removeConversation: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: Conversation[]) => void;
}

export const useConversationStore = create<ConversationState>()((set) => ({
  conversations: [],
  currentConversationId: null,
  searchTerm: '',
  searchResults: [],
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
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSearchResults: (results) => set({ searchResults: results }),
}));
