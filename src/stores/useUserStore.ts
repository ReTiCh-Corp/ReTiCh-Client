import { create } from 'zustand';

interface UserState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
}));
