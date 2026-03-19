import { User } from 'lucide-react';
import { useState } from 'react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

interface StepNameProps {
  onNext: () => void;
}

export default function StepName({ onNext }: StepNameProps) {
  const { firstName, lastName, setField } = useOnboardingStore();
  const [touched, setTouched] = useState({ firstName: false, lastName: false });

  const firstNameValid = firstName.trim().length >= 2;
  const lastNameValid = lastName.trim().length >= 2;
  const isValid = firstNameValid && lastNameValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true });
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
      <div className="mt-8 mb-2">
        <h1 className="font-display font-bold text-2xl text-text leading-tight">
          Comment vous appelez-vous ?
        </h1>
        <p className="text-sm text-text-muted mt-1.5">
          Les autres membres verront votre nom dans les conversations.
        </p>
      </div>

      <div className="space-y-4 mt-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5"
          >
            Prénom
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>
          {touched.firstName && !firstNameValid && firstName !== '' && (
            <p className="text-xs text-red-500 mt-1.5">
              Le prénom doit contenir au moins 2 caractères.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5"
          >
            Nom
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-grey-50 border border-border-light text-sm text-text placeholder:text-grey-400 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>
          {touched.lastName && !lastNameValid && lastName !== '' && (
            <p className="text-xs text-red-500 mt-1.5">
              Le nom doit contenir au moins 2 caractères.
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button
          type="submit"
          disabled={!isValid}
          className="w-full py-3.5 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] disabled:bg-grey-200 disabled:text-grey-400 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
        >
          Continuer
        </button>
      </div>
    </form>
  );
}
