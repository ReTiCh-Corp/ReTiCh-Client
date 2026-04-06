import { auth } from '../auth';
import { useAuthStore } from '../stores/useAuthStore';

function getBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL;
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  skipAuth?: boolean;
};

async function refreshAccessToken(): Promise<string | null> {
  const { logout, setTokens } = useAuthStore.getState();

  // Use the SDK's getAccessToken() which handles refresh internally
  const newToken = await auth.getAccessToken();
  if (!newToken) {
    logout();
    return null;
  }

  // Keep the Zustand store in sync (refresh token managed by the SDK)
  setTokens(newToken, '');
  return newToken;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, skipAuth = false, headers: customHeaders, ...rest } = options;
  // Prefer the SDK's access token (auto-refreshed) over the stale Zustand value
  const sdkToken = await auth.getAccessToken();
  const { accessToken: storedToken } = useAuthStore.getState();
  const accessToken = sdkToken ?? storedToken;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((customHeaders as Record<string, string>) ?? {}),
  };

  if (!skipAuth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${getBaseUrl()}${endpoint}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(`${getBaseUrl()}${endpoint}`, {
        ...rest,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.message ?? 'Request failed',
      error,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
