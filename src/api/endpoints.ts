export const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  REFRESH: '/api/v1/auth/refresh',
  LOGOUT: '/api/v1/auth/logout',
} as const;

export const USER_ENDPOINTS = {
  ME: '/api/v1/users/me',
  COMPLETE_ONBOARDING: '/api/v1/users/me/onboarding',
  BY_ID: (id: string) => `/api/v1/users/${id}`,
  LIST: '/api/v1/users',
  CHECK_USERNAME: '/api/v1/users/check-username',
} as const;

export const CONVERSATION_ENDPOINTS = {
  LIST: '/api/v1/conversations',
  BY_ID: (id: string) => `/api/v1/conversations/${id}`,
  CREATE: '/api/v1/conversations',
  PARTICIPANTS: (id: string) => `/api/v1/conversations/${id}/participants`,
  PARTICIPANT: (conversationId: string, userId: string) =>
    `/api/v1/conversations/${conversationId}/participants/${userId}`,
} as const;

export const MESSAGE_ENDPOINTS = {
  BY_CONVERSATION: (conversationId: string) =>
    `/api/v1/conversations/${conversationId}/messages`,
  SEND: (conversationId: string) =>
    `/api/v1/conversations/${conversationId}/messages`,
  BY_ID: (messageId: string) => `/api/v1/messages/${messageId}`,
} as const;
