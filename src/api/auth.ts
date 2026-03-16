import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

interface UserResponse {
  id: string;
  email: string;
  username: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),

  register: (email: string, username: string, password: string) =>
    apiClient<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
      skipAuth: true,
    }),

  refresh: (refreshToken: string) =>
    apiClient<AuthResponse>(ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true,
    }),

  logout: () =>
    apiClient(ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    }),

  me: () => apiClient<UserResponse>(ENDPOINTS.AUTH.ME),

  forgotPassword: (email: string) =>
    apiClient(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    }),
};
