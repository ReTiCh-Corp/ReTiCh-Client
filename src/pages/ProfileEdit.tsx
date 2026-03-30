import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  User,
  AtSign,
  Phone,
  MessageCircle,
  SmilePlus,
  ChevronDown,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useMyProfile, useUpdateMyProfile } from '../hooks/useProfile';
import type { UpdateProfileInput } from '../api/users';

const GENDER_OPTIONS = [
  { value: '', labelKey: 'profile.unspecified' },
  { value: 'male', labelKey: 'profile.male' },
  { value: 'female', labelKey: 'profile.female' },
  { value: 'other', labelKey: 'profile.other' },
];

const STATUS_OPTIONS = [
  { value: 'online', labelKey: 'profile.online', color: 'bg-leaf-500' },
  { value: 'away', labelKey: 'profile.away', color: 'bg-amber-400' },
  { value: 'busy', labelKey: 'profile.busy', color: 'bg-red-500' },
  { value: 'offline', labelKey: 'profile.offline', color: 'bg-grey-300' },
];

function getInitials(firstName: string, lastName: string, username: string) {
  if (firstName && lastName) return (firstName[0] + lastName[0]).toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (username) return username[0].toUpperCase();
  return '?';
}

function EditSkeleton() {
  return (
    <div className="flex flex-col h-full bg-surface-alt animate-pulse">
      <div className="sticky top-0 z-10 bg-surface-alt/80 backdrop-blur-md border-b border-border-light px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-grey-200" />
        <div className="h-5 w-32 rounded-lg bg-grey-200" />
      </div>
      <div className="flex flex-col items-center pt-6 pb-4">
        <div className="w-24 h-24 rounded-full bg-grey-200" />
      </div>
      <div className="px-5 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface rounded-xl border border-border-light p-4 space-y-3">
            <div className="h-3 w-20 rounded bg-grey-200" />
            <div className="h-10 w-full rounded-xl bg-grey-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfileEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useMyProfile();
  const updateProfile = useUpdateMyProfile();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    bio: '',
    phone: '',
    gender: '',
    custom_status: '',
    status: 'online',
  });

  const [, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name ?? '',
        last_name: profile.last_name ?? '',
        username: profile.username ?? '',
        bio: profile.bio ?? '',
        phone: profile.phone ?? '',
        gender: profile.gender ?? '',
        custom_status: profile.custom_status ?? '',
        status: profile.status ?? 'online',
      });
    }
  }, [profile]);

  if (isLoading) return <EditSkeleton />;

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-surface-alt px-6 gap-3">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-primary-400" />
        </div>
        <p className="text-text-muted text-sm text-center">
          {t('profile.loadError')}
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          {t('profile.backToProfile')}
        </button>
      </div>
    );
  }

  const usernameValid = form.username.trim().length >= 3 && form.username.trim().length <= 30;
  const canSubmit = usernameValid && !updateProfile.isPending;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!canSubmit) return;

    const input: UpdateProfileInput = {
      username: form.username.trim(),
      status: form.status,
      first_name: form.first_name.trim() || null,
      last_name: form.last_name.trim() || null,
      bio: form.bio.trim() || null,
      phone: form.phone.trim() || null,
      gender: form.gender || null,
      custom_status: form.custom_status.trim() || null,
      display_name:
        form.first_name.trim() && form.last_name.trim()
          ? `${form.first_name.trim()} ${form.last_name.trim()}`
          : null,
    };

    try {
      await updateProfile.mutateAsync(input);
      navigate('/profile');
    } catch {
      setSubmitError(t('profile.saveError'));
    }
  };

  const initials = getInitials(form.first_name, form.last_name, form.username);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-surface-alt">
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-surface-alt/80 backdrop-blur-md border-b border-border-light">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface border border-border-light hover:bg-grey-50 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-[18px] h-[18px] text-text" />
          </button>
          <h1 className="font-display font-bold text-lg text-text">
            {t('profile.edit')}
          </h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Avatar ── */}
        <div className="flex flex-col items-center pt-6 pb-2">
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={form.first_name || form.username}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-surface shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center ring-4 ring-surface shadow-lg">
                <span className="font-display font-bold text-3xl text-white drop-shadow-sm">
                  {initials}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-10 space-y-4 mt-4">
          {/* ── Error Banner ── */}
          {submitError && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* ── Section: Identité ── */}
          <div className="bg-surface rounded-xl border border-border-light p-4 space-y-4">
            <h2 className="text-xs font-bold text-text-light uppercase tracking-wider">
              {t('profile.identity')}
            </h2>

            {/* Prénom */}
            <div>
              <label htmlFor="first_name" className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5">
                {t('profile.firstName')}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
                <input
                  id="first_name"
                  type="text"
                  autoComplete="given-name"
                  placeholder={t('profile.firstNamePlaceholder')}
                  value={form.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  onBlur={() => handleBlur('first_name')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="last_name" className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5">
                {t('profile.lastName')}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
                <input
                  id="last_name"
                  type="text"
                  autoComplete="family-name"
                  placeholder={t('profile.lastNamePlaceholder')}
                  value={form.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  onBlur={() => handleBlur('last_name')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </div>

            {/* Username (read-only) */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5">
                {t('profile.username')}
              </label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
                <input
                  id="username"
                  type="text"
                  readOnly
                  value={form.username}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-100 border border-border-light text-sm text-text-muted cursor-not-allowed outline-none"
                />
              </div>
              <p className="text-xs text-text-light mt-1.5">
                {t('profile.usernameReadonly')}
              </p>
            </div>

            {/* Genre */}
            <div>
              <label htmlFor="gender" className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5">
                {t('profile.gender')}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all appearance-none"
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ── Section: Contact ── */}
          <div className="bg-surface rounded-xl border border-border-light p-4 space-y-4">
            <h2 className="text-xs font-bold text-text-light uppercase tracking-wider">
              {t('profile.contact')}
            </h2>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5">
                {t('profile.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={t('profile.phonePlaceholder')}
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ── Section: À propos ── */}
          <div className="bg-surface rounded-xl border border-border-light p-4 space-y-4">
            <h2 className="text-xs font-bold text-text-light uppercase tracking-wider">
              {t('profile.about')}
            </h2>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5">
                {t('profile.bio')}
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3.5 top-3.5 w-4 h-4 text-grey-400 pointer-events-none" />
                <textarea
                  id="bio"
                  placeholder={t('profile.bioPlaceholder')}
                  maxLength={200}
                  rows={3}
                  value={form.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                />
              </div>
              <p className="text-xs text-text-light mt-1 text-right">
                {form.bio.length}/200
              </p>
            </div>

            {/* Statut personnalisé */}
            <div>
              <label htmlFor="custom_status" className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5">
                {t('profile.customStatus')}
              </label>
              <div className="relative">
                <SmilePlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
                <input
                  id="custom_status"
                  type="text"
                  placeholder={t('profile.statusPlaceholder')}
                  maxLength={100}
                  value={form.custom_status}
                  onChange={(e) => handleChange('custom_status', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ── Section: Disponibilité ── */}
          <div className="bg-surface rounded-xl border border-border-light p-4 space-y-3">
            <h2 className="text-xs font-bold text-text-light uppercase tracking-wider">
              {t('profile.availability')}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = form.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange('status', opt.value)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border-2 transition-all duration-150 ${
                      isSelected
                        ? 'bg-primary-50 border-primary-300 shadow-sm shadow-primary-100'
                        : 'border-border-light bg-grey-50 hover:bg-grey-100 hover:border-grey-300'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${opt.color} shrink-0`} />
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isSelected ? 'text-primary-700' : 'text-grey-600'
                      }`}
                    >
                      {t(opt.labelKey)}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-primary-600 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="pt-2 pb-4">
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] disabled:bg-grey-200 disabled:text-grey-400 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
            >
              {updateProfile.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('profile.saving')}
                </span>
              ) : (
                t('profile.saveChanges')
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
