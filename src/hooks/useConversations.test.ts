import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import {
  conversationKeys,
  useConversation,
  useConversations,
  useCreateConversation,
} from './useConversations';

vi.mock('../api/conversations', () => ({
  listConversations: vi.fn().mockResolvedValue({ data: [{ id: '1' }] }),
  getConversation: vi
    .fn()
    .mockResolvedValue({ data: { id: '1', name: 'Test' } }),
  createConversation: vi
    .fn()
    .mockResolvedValue({ data: { id: 'new', name: 'Created' } }),
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

describe('conversationKeys', () => {
  it('generates all key', () => {
    expect(conversationKeys.all).toEqual(['conversations']);
  });

  it('generates lists key', () => {
    expect(conversationKeys.lists()).toEqual(['conversations', 'list']);
  });

  it('generates list key without params', () => {
    expect(conversationKeys.list()).toEqual([
      'conversations',
      'list',
      undefined,
    ]);
  });

  it('generates list key with params', () => {
    expect(conversationKeys.list({ limit: 10 })).toEqual([
      'conversations',
      'list',
      { limit: 10 },
    ]);
  });

  it('generates list key with search param', () => {
    expect(conversationKeys.list({ search: 'test' })).toEqual([
      'conversations',
      'list',
      { search: 'test' },
    ]);
  });

  it('generates details key', () => {
    expect(conversationKeys.details()).toEqual(['conversations', 'detail']);
  });

  it('generates detail key with id', () => {
    expect(conversationKeys.detail('abc')).toEqual([
      'conversations',
      'detail',
      'abc',
    ]);
  });
});

describe('useConversations', () => {
  it('returns conversation data', async () => {
    const { result } = renderHook(() => useConversations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ data: [{ id: '1' }] });
  });
});

describe('useConversation', () => {
  it('returns a single conversation', async () => {
    const { result } = renderHook(() => useConversation('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ data: { id: '1', name: 'Test' } });
  });

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useConversation(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateConversation', () => {
  it('returns a mutation function', () => {
    const { result } = renderHook(() => useCreateConversation(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mutateAsync).toBeDefined();
  });
});
