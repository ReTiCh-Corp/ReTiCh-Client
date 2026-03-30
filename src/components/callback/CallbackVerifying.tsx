import { useTranslation } from 'react-i18next';

export default function CallbackVerifying() {
  const { t } = useTranslation();
  return (
    <div className="animate-callback-fade-in">
      {/* Spinner ring */}
      <div className="relative w-20 h-20 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-[3px] border-grey-100" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary-500 animate-spin" />
        <div
          className="absolute inset-[6px] rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(circle, var(--color-primary-50) 0%, transparent 70%)',
          }}
        />
      </div>

      <h1 className="font-display font-bold text-xl text-text mb-2">
        {t('callback.verifying')}
      </h1>
      <p className="text-sm text-text-muted leading-relaxed">
        {t('callback.validating')}
      </p>

      {/* Shimmer progress bar */}
      <div className="mt-8 h-1 rounded-full bg-grey-100 overflow-hidden">
        <div
          className="h-full w-2/3 rounded-full"
          style={{
            background:
              'linear-gradient(90deg, var(--color-primary-200), var(--color-primary-500), var(--color-primary-200))',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
}
