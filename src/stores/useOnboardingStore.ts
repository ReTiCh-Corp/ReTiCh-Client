import { create } from 'zustand';

export type Gender = 'male' | 'female' | 'other' | '';

interface OnboardingData {
  firstName: string;
  lastName: string;
  gender: Gender;
  username: string;
  phone: string;
  profilePicture: File | null;
  profilePicturePreview: string;
  status: string;
}

interface OnboardingState extends OnboardingData {
  setField: <K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K],
  ) => void;
  reset: () => void;
}

const initialState: OnboardingData = {
  firstName: '',
  lastName: '',
  gender: '',
  username: '',
  phone: '',
  profilePicture: null,
  profilePicturePreview: '',
  status: '',
};

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  ...initialState,
  setField: (field, value) => set({ [field]: value }),
  reset: () => set(initialState),
}));
