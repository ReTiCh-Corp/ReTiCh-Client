import type { User } from '../stores/useAuthStore';
import { apiClient } from './client';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from './endpoints';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export async function registerUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiClient<AuthResponse>(AUTH_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: { email, password },
    skipAuth: true,
  });
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiClient<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: { email, password },
    skipAuth: true,
  });
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  gender: string;
  username: string;
  phone?: string;
  status?: string;
  custom_status?: string;
  display_name?: string | null;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  return apiClient<User>(USER_ENDPOINTS.ME, {
    method: 'PUT',
    body: payload,
  });
}

export async function completeOnboardingAPI(): Promise<void> {
  await apiClient(USER_ENDPOINTS.COMPLETE_ONBOARDING, {
    method: 'PATCH',
  });
}
