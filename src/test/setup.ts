import '@testing-library/jest-dom';
import { vi } from 'vitest';
import en from '../i18n/locales/en.json';

// localStorage mock (needed for zustand persist)
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock @retish/auth so tests don't need real env vars
vi.mock('@retish/auth', () => ({
  ReTiChAuth: vi.fn().mockImplementation(() => ({
    getAccessToken: vi.fn().mockResolvedValue(null),
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  })),
}));

// Mock react-i18next using the actual English translations
const translations = en as Record<string, string>;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (!key) return key;
      // Handle pluralization: when count > 1, try key_other first
      let resolvedKey = key;
      if (opts && typeof opts.count === 'number' && opts.count !== 1) {
        const pluralKey = `${key}_other`;
        if (translations[pluralKey]) resolvedKey = pluralKey;
      }
      const raw = translations[resolvedKey] ?? key;
      if (!opts || typeof raw !== 'string') return raw;
      // Replace {{variable}} placeholders
      return raw.replace(/\{\{(\w+)\}\}/g, (_: string, k: string) =>
        opts[k] !== undefined ? String(opts[k]) : `{{${k}}}`,
      );
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));
