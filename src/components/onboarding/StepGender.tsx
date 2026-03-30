import { useTranslation } from 'react-i18next';
import {
  type Gender,
  useOnboardingStore,
} from '../../stores/useOnboardingStore';

interface StepGenderProps {
  onNext: () => void;
}

const GENDER_OPTIONS: { value: Gender; labelKey: string; emoji: string }[] = [
  { value: 'male', labelKey: 'profile.male', emoji: '👨' },
  { value: 'female', labelKey: 'profile.female', emoji: '👩' },
  { value: 'other', labelKey: 'profile.other', emoji: '🌈' },
];

export default function StepGender({ onNext }: StepGenderProps) {
  const { t } = useTranslation();
  const { gender, setField } = useOnboardingStore();

  const handleSelect = (value: Gender) => {
    setField('gender', value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gender) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
      <div className="mt-8 mb-2">
        <h1 className="font-display font-bold text-2xl text-text leading-tight">
          {t('onboarding.gender.title')}
        </h1>
        <p className="text-sm text-text-muted mt-1.5">
          {t('onboarding.gender.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        {GENDER_OPTIONS.map((option) => {
          const isSelected = gender === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-50 border-primary-300 shadow-sm shadow-primary-100'
                  : 'border-border-light bg-white hover:bg-grey-50 hover:border-grey-300'
              }`}
            >
              <span className="text-3xl" role="img" aria-label={t(option.labelKey)}>
                {option.emoji}
              </span>
              <span
                className={`text-sm font-semibold transition-colors ${
                  isSelected ? 'text-primary-700' : 'text-grey-600'
                }`}
              >
                {t(option.labelKey)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <button
          type="submit"
          disabled={!gender}
          className="w-full py-3.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] disabled:bg-grey-200 disabled:text-grey-400 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        >
          {t('onboarding.continue')}
        </button>
      </div>
    </form>
  );
}
