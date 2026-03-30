import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Bell, BellOff, LogOut, Monitor, Languages, Type, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/useAuthStore';
import {
  useSettingsStore,
  applyTheme,
  applyFontSize,
  type Theme,
  type Language,
  type FontSize,
} from '../stores/useSettingsStore';
import { playNotificationSound } from '../utils/notificationSound';

const THEME_OPTIONS: { value: Theme; icon: typeof Sun; labelKey: string }[] = [
  { value: 'light', icon: Sun, labelKey: 'settings.theme.light' },
  { value: 'dark', icon: Moon, labelKey: 'settings.theme.dark' },
  { value: 'system', icon: Monitor, labelKey: 'settings.theme.system' },
];

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
];

const FONT_SIZE_OPTIONS: { value: FontSize; labelKey: string }[] = [
  { value: 'small', labelKey: 'settings.fontSize.small' },
  { value: 'medium', labelKey: 'settings.fontSize.medium' },
  { value: 'large', labelKey: 'settings.fontSize.large' },
];

export default function Settings() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const { t, i18n } = useTranslation();

  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const pushNotifications = useSettingsStore((s) => s.pushNotifications);
  const setPushNotifications = useSettingsStore((s) => s.setPushNotifications);
  const notificationSound = useSettingsStore((s) => s.notificationSound);
  const setNotificationSound = useSettingsStore((s) => s.setNotificationSound);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }, [setLanguage, i18n]);

  const handleToggleNotifications = useCallback(async () => {
    if (!pushNotifications) {
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;
      }
      setPushNotifications(true);
    } else {
      setPushNotifications(false);
    }
  }, [pushNotifications, setPushNotifications]);

  const handleToggleSound = useCallback(() => {
    setNotificationSound(!notificationSound);
  }, [notificationSound, setNotificationSound]);

  const handleTestSound = useCallback(() => {
    playNotificationSound();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center h-full bg-surface-alt overflow-y-auto">
      {/* ── Header ── */}
      <div className="w-full bg-gradient-to-b from-primary-50 via-primary-50/40 to-surface-alt pt-10 pb-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center shadow-lg">
          <Sun size={28} strokeWidth={1.5} className="text-white" />
        </div>
        <h2 className="mt-4 font-display font-bold text-2xl text-text">
          {t('settings.title')}
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="w-full max-w-md px-5 mt-2 pb-10 space-y-6">
        {/* ── Theme Section ── */}
        <section>
          <h3 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-2.5 px-1">
            {t('settings.appearance')}
          </h3>
          <div className="bg-surface rounded-xl border border-border-light p-1.5 flex gap-1">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${active
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-text-muted hover:bg-grey-50 hover:text-text'
                    }
                  `}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                  {t(opt.labelKey)}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Language Section ── */}
        <section>
          <h3 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-2.5 px-1">
            {t('settings.language')}
          </h3>
          <div className="bg-surface rounded-xl border border-border-light p-1.5 flex gap-1">
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = language === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleLanguageChange(opt.value)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${active
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-text-muted hover:bg-grey-50 hover:text-text'
                    }
                  `}
                >
                  <Languages size={16} strokeWidth={active ? 2.2 : 1.8} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Font Size Section ── */}
        <section>
          <h3 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-2.5 px-1">
            {t('settings.fontSize')}
          </h3>
          <div className="bg-surface rounded-xl border border-border-light p-1.5 flex gap-1">
            {FONT_SIZE_OPTIONS.map((opt) => {
              const active = fontSize === opt.value;
              const iconSize = opt.value === 'small' ? 14 : opt.value === 'large' ? 20 : 16;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFontSize(opt.value)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${active
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-text-muted hover:bg-grey-50 hover:text-text'
                    }
                  `}
                >
                  <Type size={iconSize} strokeWidth={active ? 2.2 : 1.8} />
                  {t(opt.labelKey)}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Notifications Section ── */}
        <section>
          <h3 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-2.5 px-1">
            {t('settings.notifications')}
          </h3>
          <div className="space-y-2">
            {/* Push notifications toggle */}
            <button
              type="button"
              onClick={handleToggleNotifications}
              className="w-full flex items-center gap-3.5 bg-surface rounded-xl border border-border-light px-4 py-3.5 transition-shadow hover:shadow-sm cursor-pointer group"
            >
              <span className={`shrink-0 ${pushNotifications ? 'text-primary-400' : 'text-grey-300'} transition-colors`}>
                {pushNotifications
                  ? <Bell size={20} strokeWidth={1.8} />
                  : <BellOff size={20} strokeWidth={1.8} />
                }
              </span>
              <div className="flex-1 text-left min-w-0">
                <span className="block text-sm font-semibold text-text">
                  {t('settings.notifications.push')}
                </span>
                <span className="block text-xs text-text-muted mt-0.5">
                  {pushNotifications
                    ? t('settings.notifications.enabled')
                    : t('settings.notifications.disabled')
                  }
                </span>
              </div>
              <div
                className={`
                  relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
                  ${pushNotifications ? 'bg-primary-500' : 'bg-grey-200'}
                `}
              >
                <div
                  className={`
                    absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200
                    ${pushNotifications ? 'translate-x-[22px]' : 'translate-x-0.5'}
                  `}
                />
              </div>
            </button>

            {/* Notification sound toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleSound}
                className="flex-1 flex items-center gap-3.5 bg-surface rounded-xl border border-border-light px-4 py-3.5 transition-shadow hover:shadow-sm cursor-pointer group"
              >
                <span className={`shrink-0 ${notificationSound ? 'text-primary-400' : 'text-grey-300'} transition-colors`}>
                  {notificationSound
                    ? <Volume2 size={20} strokeWidth={1.8} />
                    : <VolumeX size={20} strokeWidth={1.8} />
                  }
                </span>
                <div className="flex-1 text-left min-w-0">
                  <span className="block text-sm font-semibold text-text">
                    {t('settings.notifications.sound')}
                  </span>
                  <span className="block text-xs text-text-muted mt-0.5">
                    {notificationSound
                      ? t('settings.notifications.soundEnabled')
                      : t('settings.notifications.soundDisabled')
                    }
                  </span>
                </div>
                <div
                  className={`
                    relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
                    ${notificationSound ? 'bg-primary-500' : 'bg-grey-200'}
                  `}
                >
                  <div
                    className={`
                      absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200
                      ${notificationSound ? 'translate-x-[22px]' : 'translate-x-0.5'}
                    `}
                  />
                </div>
              </button>
              <button
                type="button"
                onClick={handleTestSound}
                className="shrink-0 px-3 py-3.5 bg-surface rounded-xl border border-border-light text-xs font-semibold text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
              >
                {t('settings.notifications.test')}
              </button>
            </div>
          </div>
        </section>

        {/* ── Account Section ── */}
        <section>
          <h3 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-2.5 px-1">
            {t('settings.account')}
          </h3>
          {!showLogoutConfirm ? (
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3.5 bg-surface rounded-xl border border-border-light px-4 py-3.5 transition-all hover:shadow-sm hover:border-red-200 cursor-pointer group"
            >
              <span className="shrink-0 text-red-400 group-hover:text-red-500 transition-colors">
                <LogOut size={20} strokeWidth={1.8} />
              </span>
              <div className="flex-1 text-left">
                <span className="block text-sm font-semibold text-red-600 group-hover:text-red-700 transition-colors">
                  {t('settings.logout')}
                </span>
                <span className="block text-xs text-text-muted mt-0.5">
                  {t('settings.logoutHint')}
                </span>
              </div>
            </button>
          ) : (
            <div className="bg-surface rounded-xl border border-red-200 px-4 py-4 animate-empty-fade-in">
              <p className="text-sm text-text font-semibold mb-1">
                {t('settings.logoutConfirmTitle')}
              </p>
              <p className="text-xs text-text-muted mb-4">
                {t('settings.logoutConfirmMessage')}
              </p>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-border text-sm font-semibold text-text hover:bg-grey-50 transition-colors cursor-pointer"
                >
                  {t('settings.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:scale-[0.98] transition-all cursor-pointer"
                >
                  {t('settings.logoutConfirm')}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
