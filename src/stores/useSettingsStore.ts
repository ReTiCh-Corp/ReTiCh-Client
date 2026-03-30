import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'fr' | 'en' | 'ja';
export type FontSize = 'small' | 'medium' | 'large';

interface SettingsState {
  theme: Theme;
  language: Language;
  fontSize: FontSize;
  pushNotifications: boolean;
  notificationSound: boolean;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setFontSize: (fontSize: FontSize) => void;
  setPushNotifications: (enabled: boolean) => void;
  setNotificationSound: (enabled: boolean) => void;
}

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: '14px',
  medium: '16px',
  large: '18px',
};

export function applyFontSize(size: FontSize) {
  document.documentElement.style.setProperty('--font-size-base', FONT_SIZE_MAP[size]);
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

// Migrate old localStorage keys to the new store
function migrateOldSettings(): Partial<Pick<SettingsState, 'theme' | 'pushNotifications'>> {
  const migrated: Partial<Pick<SettingsState, 'theme' | 'pushNotifications'>> = {};

  const oldTheme = localStorage.getItem('retich-theme');
  if (oldTheme) {
    migrated.theme = oldTheme as Theme;
    localStorage.removeItem('retich-theme');
  }

  const oldNotif = localStorage.getItem('retich-notifications');
  if (oldNotif !== null) {
    migrated.pushNotifications = oldNotif !== 'false';
    localStorage.removeItem('retich-notifications');
  }

  return migrated;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'fr',
      fontSize: 'medium',
      pushNotifications: true,
      notificationSound: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setFontSize: (fontSize) => set({ fontSize }),
      setPushNotifications: (pushNotifications) => set({ pushNotifications }),
      setNotificationSound: (notificationSound) => set({ notificationSound }),
    }),
    {
      name: 'retich-settings',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const migrated = migrateOldSettings();
        if (migrated.theme !== undefined) state.setTheme(migrated.theme);
        if (migrated.pushNotifications !== undefined) state.setPushNotifications(migrated.pushNotifications);
      },
    },
  ),
);
