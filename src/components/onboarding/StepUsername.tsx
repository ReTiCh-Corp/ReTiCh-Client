import { AtSign } from 'lucide-react';
import { useState } from 'react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';

interface StepUsernameProps {
  onNext: () => void;
}

export default function StepUsername({ onNext }: StepUsernameProps) {
  const { username, setField } = useOnboardingStore();
  const [touched, setTouched] = useState(false);

  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  const isValid = usernameRegex.test(username);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
      <div className="mt-8 mb-2">
        <h1 className="font-display font-bold text-2xl text-text leading-tight">
          Choisissez un nom d'utilisateur
        </h1>
        <p className="text-sm text-text-muted mt-1.5">
          C'est votre identifiant unique sur ReTiCh.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="username"
          className="block text-xs font-semibold text-grey-600 uppercase tracking-wider mb-1.5"
        >
          Nom d'utilisateur
        </label>
        <div className="relative">
          <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="mon_pseudo"
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
            3 à 30 caractères : lettres, chiffres et underscores uniquement.
          </p>
        )}
        {username && isValid && (
          <p className="text-xs text-leaf-600 mt-1.5 font-medium">
            @{username} est disponible !
          </p>
        )}
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
