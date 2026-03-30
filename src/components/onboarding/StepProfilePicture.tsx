import { Camera, X } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

interface StepProfilePictureProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function StepProfilePicture({
  onNext,
  onSkip,
}: StepProfilePictureProps) {
  const { t } = useTranslation();
  const { profilePicture, profilePicturePreview, setField } =
    useOnboardingStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB max

    setField('profilePicture', file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setField('profilePicturePreview', ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setField('profilePicture', null);
    setField('profilePicturePreview', '');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="mt-8 mb-2">
        <h1 className="font-display font-bold text-2xl text-text leading-tight">
          {t('onboarding.picture.title')}
        </h1>
        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-grey-100 text-xs font-medium text-text-muted">
          {t('onboarding.optional')}
        </span>
        <p className="text-sm text-text-muted mt-2">
          {t('onboarding.picture.subtitle')}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center mt-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {profilePicturePreview ? (
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary-100 shadow-lg shadow-primary-100/30">
              <img
                src={profilePicturePreview}
                alt={t('onboarding.picture.preview')}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-grey-800 text-white flex items-center justify-center shadow-md hover:bg-grey-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-40 h-40 rounded-full border-2 border-dashed border-grey-300 bg-grey-50 flex flex-col items-center justify-center gap-2 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 cursor-pointer group"
          >
            <Camera className="w-8 h-8 text-grey-400 group-hover:text-primary-500 transition-colors" />
            <span className="text-xs font-medium text-grey-500 group-hover:text-primary-600 transition-colors">
              {t('onboarding.picture.choose')}
            </span>
          </button>
        )}
      </div>

      <div className="mt-auto pt-8 space-y-3">
        <button
          type="button"
          onClick={onNext}
          disabled={!profilePicture}
          className="w-full py-3.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] disabled:bg-grey-200 disabled:text-grey-400 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        >
          {t('onboarding.continue')}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full py-3 rounded-xl text-sm font-medium text-grey-500 hover:bg-grey-100 active:scale-[0.98] transition-all duration-150"
        >
          {t('onboarding.skip')}
        </button>
      </div>
    </div>
  );
}
