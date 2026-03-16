import { ENV } from '../config/env';

const BASE = ENV.API_BASE_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE}/auth/login`,
    REGISTER: `${BASE}/auth/register`,
    REFRESH: `${BASE}/auth/refresh`,
    LOGOUT: `${BASE}/auth/logout`,
    ME: `${BASE}/auth/me`,
    FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
  },
  CONVERSATIONS: {
    LIST: `${BASE}/conversations`,
    CREATE: `${BASE}/conversations`,
    BY_ID: (id: string) => `${BASE}/conversations/${id}`,
    DELETE: (id: string) => `${BASE}/conversations/${id}`,
  },
  MESSAGES: {
    LIST: (conversationId: string) =>
      `${BASE}/conversations/${conversationId}/messages`,
    SEND: (conversationId: string) =>
      `${BASE}/conversations/${conversationId}/messages`,
  },
} as const;
