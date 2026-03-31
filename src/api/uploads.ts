import { useAuthStore } from '../stores/useAuthStore';
import type { PaginationMeta } from './conversations';
import { MESSAGE_ENDPOINTS } from './endpoints';

export interface Attachment {
  id: string;
  message_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  duration?: number;
  created_at: string;
}

interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
}

function getBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL as string;
}

export async function uploadFile(
  messageId: string,
  file: File,
): Promise<ApiResponse<Attachment>> {
  const { accessToken } = useAuthStore.getState();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${getBaseUrl()}${MESSAGE_ENDPOINTS.ATTACHMENTS(messageId)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? 'Upload failed');
  }

  return response.json();
}

export async function listAttachments(
  messageId: string,
): Promise<ApiResponse<Attachment[]>> {
  const { accessToken } = useAuthStore.getState();
  const response = await fetch(
    `${getBaseUrl()}${MESSAGE_ENDPOINTS.ATTACHMENTS(messageId)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch attachments');
  }

  return response.json();
}

export async function listMedia(
  conversationId: string,
  params?: { limit?: number; offset?: number },
): Promise<ApiResponse<Attachment[]>> {
  const { accessToken } = useAuthStore.getState();
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  const endpoint = `${MESSAGE_ENDPOINTS.MEDIA(conversationId)}${query ? `?${query}` : ''}`;

  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch media');
  }

  return response.json();
}
