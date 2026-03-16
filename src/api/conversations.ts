import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export const conversationsApi = {
  list: () => apiClient<Conversation[]>(ENDPOINTS.CONVERSATIONS.LIST),

  create: (title: string) =>
    apiClient<Conversation>(ENDPOINTS.CONVERSATIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  getById: (id: string) =>
    apiClient<Conversation>(ENDPOINTS.CONVERSATIONS.BY_ID(id)),

  delete: (id: string) =>
    apiClient(ENDPOINTS.CONVERSATIONS.DELETE(id), {
      method: 'DELETE',
    }),
};
