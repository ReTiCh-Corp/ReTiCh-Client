import { AtSign, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { checkUsernameAvailability } from '../../api/users';
import { useDebounce } from '../../hooks/useDebounce';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

interface StepUsernameProps {
  onNext: () => void;
}

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'taken';

export default function StepUsername({ onNext }: StepUsernameProps) {
  const { t } = useTranslation();
  const { username, setField } = useOnboardingStore();
  const [touched, setTouched] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityStatus>('idle');

  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  const isValid = usernameRegex.test(username);
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    if (!debouncedUsername || !usernameRegex.test(debouncedUsername)) {
      setAvailability('idle');
      return;
    }

    let cancelled = false;
    setAvailability('checking');

    checkUsernameAvailability(debouncedUsername)
      .then((res) => {
        if (!cancelled) {
          setAvailability(res.available ? 'available' : 'taken');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailability('idle');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedUsername]);

  // While the user is still typing (username !== debouncedUsername), show checking state
  const isTyping = isValid && username !== debouncedUsername;
  const displayStatus = isTyping ? 'checking' : availability;

  const canSubmit = isValid && displayStatus === 'available';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (canSubmit) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
      <div className="mt-8 mb-2">
        <h1 className="font-display font-bold text-2xl text-text leading-tight">
          {t('onboarding.username.title')}
        </h1>
        <p className="text-sm text-text-muted mt-1.5">
          {t('onboarding.username.subtitle')}
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="username"
          className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5"
        >
          {t('onboarding.username.label')}
        </label>
        <div className="relative">
          <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder={t('onboarding.username.placeholder')}
            value={username}
            onChange={(e) =>
              setField(
                'username',
                e.target.value.toLowerCase().replace(/\s/g, '_'),
              )
            }
            onBlur={() => setTouched(true)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
        {touched && !isValid && username !== '' && (
          <p className="text-xs text-red-500 mt-1.5">
            {t('onboarding.username.hint')}
          </p>
        )}
        {isValid && displayStatus === 'checking' && (
          <p className="text-xs text-grey-500 mt-1.5 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            {t('onboarding.username.checking')}
          </p>
        )}
        {isValid && displayStatus === 'available' && (
          <p className="text-xs text-leaf-600 mt-1.5 font-medium">
            {t('onboarding.username.available', { username })}
          </p>
        )}
        {isValid && displayStatus === 'taken' && (
          <p className="text-xs text-red-500 mt-1.5">
            {t('onboarding.username.taken', { username })}
          </p>
        )}
      </div>

      <div className="mt-auto pt-8">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-3.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] disabled:bg-grey-200 disabled:text-grey-400 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        >
          {t('onboarding.continue')}
        </button>
      </div>
    </form>
  );
}
