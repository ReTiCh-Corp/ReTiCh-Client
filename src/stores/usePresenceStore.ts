import { create } from 'zustand';

interface PresenceState {
  onlineUsers: Record<string, boolean>;
  setOnline: (userId: string) => void;
  setOffline: (userId: string) => void;
  setBulkOnline: (userIds: string[]) => void;
  clearAll: () => void;
}

export const usePresenceStore = create<PresenceState>()((set) => ({
  onlineUsers: {},
  setOnline: (userId) =>
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [userId]: true },
    })),
  setOffline: (userId) =>
    set((state) => {
      const { [userId]: _, ...rest } = state.onlineUsers;
      return { onlineUsers: rest };
    }),
  setBulkOnline: (userIds) =>
    set(() => {
      const online: Record<string, boolean> = {};
      for (const id of userIds) {
        online[id] = true;
      }
      return { onlineUsers: online };
    }),
  clearAll: () => set({ onlineUsers: {} }),
}));

export const useIsUserOnline = (userId: string) =>
  usePresenceStore((s) => !!s.onlineUsers[userId]);
