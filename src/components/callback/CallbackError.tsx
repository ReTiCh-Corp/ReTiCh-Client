import { useTranslation } from 'react-i18next';

interface CallbackErrorProps {
  message: string;
  onRetry: () => void;
}

export default function CallbackError({ message, onRetry }: CallbackErrorProps) {
  const { t } = useTranslation();
  return (
    <div className="animate-callback-fade-in">
      {/* Error icon */}
      <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-red-50" />
        <svg
          viewBox="0 0 52 52"
          className="relative w-14 h-14"
          aria-hidden="true"
        >
          <circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            className="animate-callback-circle-draw"
            style={{
              strokeDasharray: 151,
              strokeDashoffset: 151,
              strokeLinecap: 'round',
            }}
          />
          <path
            d="M18 18l16 16M34 18l-16 16"
            fill="none"
            stroke="#dc2626"
            strokeWidth="3"
            className="animate-callback-check-draw"
            style={{
              strokeDasharray: 45,
              strokeDashoffset: 45,
              strokeLinecap: 'round',
            }}
          />
        </svg>
      </div>

      <h1 className="font-display font-bold text-xl text-text mb-2">
        {t('callback.failed')}
      </h1>
      <p className="text-sm text-text-muted leading-relaxed mb-8">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="w-full py-3 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] transition-all duration-150 shadow-sm cursor-pointer"
      >
        {t('callback.backToLogin')}
      </button>
    </div>
  );
}
