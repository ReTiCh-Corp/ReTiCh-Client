import { useAuthStore } from '../stores/useAuthStore';

type RequestOptions = RequestInit & { skipAuth?: boolean };

export async function apiClient<T = unknown>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);

  if (!skipAuth) {
    const token = useAuthStore.getState().accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...fetchOptions, headers });

  if (response.status === 401 && !skipAuth) {
    useAuthStore.getState().logout();
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
