import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { userKeys, useUsers } from './useUsers';

vi.mock('../api/users', () => ({
  listUsers: vi.fn().mockResolvedValue({
    data: [{ id: '1', email: 'a@b.com', username: 'alice' }],
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('userKeys', () => {
  it('generates all key', () => {
    expect(userKeys.all).toEqual(['users']);
  });

  it('generates lists key', () => {
    expect(userKeys.lists()).toEqual(['users', 'list']);
  });

  it('generates list key without params', () => {
    expect(userKeys.list()).toEqual(['users', 'list', undefined]);
  });

  it('generates list key with params', () => {
    expect(userKeys.list({ limit: 10 })).toEqual([
      'users',
      'list',
      { limit: 10 },
    ]);
  });

  it('generates list key with search param', () => {
    expect(userKeys.list({ search: 'test' })).toEqual([
      'users',
      'list',
      { search: 'test' },
    ]);
  });

  it('generates list key with sort param', () => {
    expect(userKeys.list({ sort: 'new' })).toEqual([
      'users',
      'list',
      { sort: 'new' },
    ]);
  });
});

describe('useUsers', () => {
  it('returns user data', async () => {
    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      data: [{ id: '1', email: 'a@b.com', username: 'alice' }],
    });
  });
});
