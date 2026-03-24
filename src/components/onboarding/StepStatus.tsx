import { MessageCircle } from 'lucide-react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import type { UserStatus } from '../../api/auth';

interface StepStatusProps {
  onNext: () => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

export const STATUS_MAP: Record<string, UserStatus> = {
  'Disponible': 'online',
  'Au travail': 'busy',
  'En vacances': 'away',
  'Ne pas déranger': 'busy',
};

const STATUS_SUGGESTIONS = Object.keys(STATUS_MAP);

export default function StepStatus({
  onNext,
  onSkip,
  isSubmitting,
}: StepStatusProps) {
  const { status, setField } = useOnboardingStore();

  const hasValue = status.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
      <div className="mt-8 mb-2">
        <h1 className="font-display font-bold text-2xl text-text leading-tight">
          Ajoutez un statut
        </h1>
        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-grey-100 text-xs font-medium text-text-muted">
          Optionnel
        </span>
        <p className="text-sm text-text-muted mt-2">
          Dites aux autres ce que vous faites en ce moment.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="status"
          className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5"
        >
          Statut
        </label>
        <div className="relative">
          <MessageCircle className="absolute left-3.5 top-3.5 w-4 h-4 text-grey-400 pointer-events-none" />
          <textarea
            id="status"
            placeholder="Quoi de neuf ?"
            maxLength={100}
            rows={3}
            value={status}
            onChange={(e) => setField('status', e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
          />
        </div>
        <p className="text-xs text-text-light mt-1.5 text-right">
          {status.length}/100
        </p>

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {STATUS_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setField('status', suggestion)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                status === suggestion
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-grey-100 text-grey-600 border border-transparent hover:bg-grey-200'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8 space-y-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] disabled:bg-grey-200 disabled:text-grey-400 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Finalisation…
            </span>
          ) : hasValue ? (
            'Terminer'
          ) : (
            'Terminer sans statut'
          )}
        </button>
        {!isSubmitting && (
          <button
            type="button"
            onClick={onSkip}
            className="w-full py-3 rounded-xl text-sm font-medium text-grey-500 hover:bg-grey-100 active:scale-[0.98] transition-all duration-150"
          >
            Passer
          </button>
        )}
      </div>
    </form>
  );
}
