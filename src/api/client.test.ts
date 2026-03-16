import { useAuthStore } from '../stores/useAuthStore';
import { ApiError, apiClient } from './client';

const BASE_URL = 'http://localhost:3000';

beforeAll(() => {
  import.meta.env.VITE_API_BASE_URL = BASE_URL;
});

afterEach(() => {
  vi.restoreAllMocks();
  useAuthStore.getState().logout();
});

function mockFetch(response: Partial<Response>) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(response as Response);
}

function mockFetchSequence(responses: Partial<Response>[]) {
  const spy = vi.spyOn(globalThis, 'fetch');
  for (const response of responses) {
    spy.mockResolvedValueOnce(response as Response);
  }
  return spy;
}

describe('apiClient', () => {
  it('makes a GET request and returns JSON', async () => {
    mockFetch({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: 'test' }),
    });

    const result = await apiClient('/test');
    expect(result).toEqual({ data: 'test' });
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/test`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('sends body as JSON when provided', async () => {
    mockFetch({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ ok: true }),
    });

    await apiClient('/test', {
      method: 'POST',
      body: { name: 'hello' },
    });

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/test`,
      expect.objectContaining({
        body: JSON.stringify({ name: 'hello' }),
      }),
    );
  });

  it('includes Authorization header when accessToken is set', async () => {
    useAuthStore.getState().setTokens('my-token', 'my-refresh');

    mockFetch({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await apiClient('/test');

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/test`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer my-token',
        }),
      }),
    );
  });

  it('skips Authorization header when skipAuth is true', async () => {
    useAuthStore.getState().setTokens('my-token', 'my-refresh');

    mockFetch({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await apiClient('/test', { skipAuth: true });

    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/test`,
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.anything(),
        }),
      }),
    );
  });

  it('returns undefined for 204 responses', async () => {
    mockFetch({
      ok: true,
      status: 204,
    });

    const result = await apiClient('/test');
    expect(result).toBeUndefined();
  });

  it('throws ApiError on non-ok response', async () => {
    mockFetch({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Bad request' }),
    });

    await expect(apiClient('/test')).rejects.toThrow(ApiError);
    await expect(apiClient('/test')).rejects.toMatchObject({
      status: 400,
      message: 'Bad request',
    });
  });

  it('throws ApiError with fallback message when error body is not JSON', async () => {
    mockFetch({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('not json')),
    });

    await expect(apiClient('/test')).rejects.toMatchObject({
      status: 500,
      message: 'Request failed',
    });
  });

  it('refreshes token on 401 and retries the request', async () => {
    useAuthStore.getState().setTokens('expired-token', 'valid-refresh');

    mockFetchSequence([
      // First request → 401
      { ok: false, status: 401 },
      // Refresh request → success
      {
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            accessToken: 'new-token',
            refreshToken: 'new-refresh',
          }),
      },
      // Retry request → success
      {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'retried' }),
      },
    ]);

    const result = await apiClient('/test');
    expect(result).toEqual({ data: 'retried' });
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('logs out when refresh token is missing on 401', async () => {
    useAuthStore
      .getState()
      .setTokens('expired-token', null as unknown as string);
    useAuthStore.setState({ refreshToken: null });

    mockFetchSequence([
      { ok: false, status: 401, json: () => Promise.resolve({}) },
    ]);

    await expect(apiClient('/test')).rejects.toThrow(ApiError);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('logs out when refresh request fails', async () => {
    useAuthStore.getState().setTokens('expired-token', 'bad-refresh');

    mockFetchSequence([
      // First request → 401
      { ok: false, status: 401, json: () => Promise.resolve({}) },
      // Refresh request → fails
      { ok: false, status: 401 },
    ]);

    await expect(apiClient('/test')).rejects.toThrow(ApiError);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});

describe('ApiError', () => {
  it('has correct name, status, message and data', () => {
    const error = new ApiError(404, 'Not found', { detail: 'missing' });
    expect(error.name).toBe('ApiError');
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.data).toEqual({ detail: 'missing' });
    expect(error).toBeInstanceOf(Error);
  });
});
