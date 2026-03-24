import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, type UpdateProfilePayload } from '../api/auth';
import { useAuthStore } from '../stores/useAuthStore';
import { useOnboardingStore } from '../stores/useOnboardingStore';
import { STATUS_MAP } from '../components/onboarding/StepStatus';

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
        first_name: onboardingStore.firstName,
        last_name: onboardingStore.lastName,
        gender: onboardingStore.gender,
        username: onboardingStore.username,
      };
      if (onboardingStore.phone) payload.phone = onboardingStore.phone;
      if (onboardingStore.status) {
        payload.status = STATUS_MAP[onboardingStore.status] ?? 'online';
        payload.custom_status = onboardingStore.status;
      }

      await updateProfile(payload);

      completeOnboarding();
      onboardingStore.reset();
      navigate('/onboarding/success', { replace: true });
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
