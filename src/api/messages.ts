import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  conversationId: string;
  createdAt: string;
}

export const messagesApi = {
  list: (conversationId: string) =>
    apiClient<Message[]>(ENDPOINTS.MESSAGES.LIST(conversationId)),

  send: (conversationId: string, content: string) =>
    apiClient<Message>(ENDPOINTS.MESSAGES.SEND(conversationId), {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};
