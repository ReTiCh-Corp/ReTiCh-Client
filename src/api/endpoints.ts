export const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  REFRESH: '/api/v1/auth/refresh',
  LOGOUT: '/api/v1/auth/logout',
} as const;

export const USER_ENDPOINTS = {
  ME: '/api/v1/user/users/me',
  BY_ID: (id: string) => `/api/v1/user/users/${id}`,
  LIST: '/api/v1/user/users',
} as const;

export const CONVERSATION_ENDPOINTS = {
  LIST: '/api/v1/messaging/conversations',
  BY_ID: (id: string) => `/api/v1/messaging/conversations/${id}`,
  CREATE: '/api/v1/messaging/conversations',
  PARTICIPANTS: (id: string) => `/api/v1/messaging/conversations/${id}/participants`,
  PARTICIPANT: (conversationId: string, userId: string) =>
    `/api/v1/messaging/conversations/${conversationId}/participants/${userId}`,
} as const;

export const MESSAGE_ENDPOINTS = {
  BY_CONVERSATION: (conversationId: string) =>
    `/api/v1/messaging/conversations/${conversationId}/messages`,
  SEND: (conversationId: string) =>
    `/api/v1/messaging/conversations/${conversationId}/messages`,
} as const;
