import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UpdateProfilePayload } from '../api/auth';
import { useAuthStore } from '../stores/useAuthStore';
import { useOnboardingStore } from '../stores/useOnboardingStore';

const TOTAL_STEPS = 6;

export function useOnboardingStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { completeOnboarding } = useAuthStore();
  const onboardingStore = useOnboardingStore();

  const goNext = () => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const finish = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const payload: UpdateProfilePayload = {
        firstName: onboardingStore.firstName,
        lastName: onboardingStore.lastName,
        gender: onboardingStore.gender,
        username: onboardingStore.username,
      };
      if (onboardingStore.phone) payload.phone = onboardingStore.phone;
      if (onboardingStore.status) payload.status = onboardingStore.status;

      // TODO: quand le backend sera prêt, décommenter :
      // await updateProfile(payload);

      completeOnboarding();
      onboardingStore.reset();
      navigate('/chat', { replace: true });
    } catch {
      setError('Erreur lors de la sauvegarde du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    isSubmitting,
    error,
    goNext,
    finish,
  };
}
