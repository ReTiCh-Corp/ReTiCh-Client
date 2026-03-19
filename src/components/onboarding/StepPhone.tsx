import { Phone } from 'lucide-react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

interface StepPhoneProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function StepPhone({ onNext, onSkip }: StepPhoneProps) {
  const { phone, setField } = useOnboardingStore();

  const phoneValid = phone === '' || /^\+?[\d\s\-()]{7,}$/.test(phone);
  const hasValue = phone.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasValue && phoneValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
      <div className="mt-8 mb-2">
        <h1 className="font-display font-bold text-2xl text-text leading-tight">
          Votre numéro de téléphone
        </h1>
        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-grey-100 text-xs font-medium text-text-muted">
          Optionnel
        </span>
        <p className="text-sm text-text-muted mt-2">
          Permet à vos contacts de vous retrouver plus facilement.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="phone"
          className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5"
        >
          Téléphone
        </label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+33 6 12 34 56 78"
            value={phone}
            onChange={(e) => setField('phone', e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
        {!phoneValid && phone !== '' && (
          <p className="text-xs text-red-500 mt-1.5">
            Numéro de téléphone invalide.
          </p>
        )}
      </div>

      <div className="mt-auto pt-8 space-y-3">
        <button
          type="submit"
          disabled={!hasValue || !phoneValid}
          className="w-full py-3.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] disabled:bg-grey-200 disabled:text-grey-400 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        >
          Continuer
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full py-3 rounded-xl text-sm font-medium text-grey-500 hover:bg-grey-100 active:scale-[0.98] transition-all duration-150"
        >
          Passer
        </button>
      </div>
    </form>
  );
}
