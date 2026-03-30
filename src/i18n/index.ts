import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';
import ja from './locales/ja.json';

// Read persisted language from the settings store
function getStoredLanguage(): string {
  try {
    const raw = localStorage.getItem('retich-settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.state?.language) return parsed.state.language;
    }
  } catch {
    // ignore
  }
  return 'fr';
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
});

export default i18n;
