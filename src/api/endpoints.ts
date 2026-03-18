export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
} as const;

export const USER_ENDPOINTS = {
  ME: '/users/me',
  BY_ID: (id: string) => `/users/${id}`,
  LIST: '/users',
} as const;

export const CONVERSATION_ENDPOINTS = {
  LIST: '/conversations',
  BY_ID: (id: string) => `/conversations/${id}`,
  CREATE: '/conversations',
  PARTICIPANTS: (id: string) => `/conversations/${id}/participants`,
  PARTICIPANT: (conversationId: string, userId: string) =>
    `/conversations/${conversationId}/participants/${userId}`,
} as const;

export const MESSAGE_ENDPOINTS = {
  BY_CONVERSATION: (conversationId: string) =>
    `/conversations/${conversationId}/messages`,
  SEND: (conversationId: string) => `/conversations/${conversationId}/messages`,
} as const;
