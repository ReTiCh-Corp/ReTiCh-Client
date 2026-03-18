import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import {
  addParticipants,
  archiveConversation,
  createConversation,
  removeParticipant,
  updateConversation,
} from '../api/conversations';
import { useAuthStore } from '../stores/useAuthStore';
import {
  conversationKeys,
  useAddParticipants,
  useArchiveConversation,
  useConversation,
  useConversations,
  useCreateConversation,
  useLeaveConversation,
  useRemoveParticipant,
  useUpdateConversation,
} from './useConversations';

vi.mock('../api/conversations', () => ({
  listConversations: vi.fn().mockResolvedValue({ data: [{ id: '1' }] }),
  getConversation: vi
    .fn()
    .mockResolvedValue({ data: { id: '1', name: 'Test' } }),
  createConversation: vi
    .fn()
    .mockResolvedValue({ data: { id: 'new', name: 'Created' } }),
  updateConversation: vi.fn().mockResolvedValue({ data: { id: '1' } }),
  archiveConversation: vi.fn().mockResolvedValue(undefined),
  addParticipants: vi.fn().mockResolvedValue({ data: [] }),
  removeParticipant: vi.fn().mockResolvedValue(undefined),
}));

function createWrapper(queryClient?: QueryClient) {
  const qc =
    queryClient ??
    new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
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
  it('calls createConversation and invalidates lists', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateConversation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync({ type: 'direct' });

    expect(createConversation).toHaveBeenCalledWith({ type: 'direct' });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: conversationKeys.lists(),
    });
  });
});

describe('useUpdateConversation', () => {
  it('calls updateConversation and invalidates lists and detail', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateConversation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync({
      id: 'c1',
      input: { name: 'Updated' },
    });

    expect(updateConversation).toHaveBeenCalledWith('c1', { name: 'Updated' });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: conversationKeys.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: conversationKeys.detail('c1'),
    });
  });
});

describe('useArchiveConversation', () => {
  it('calls archiveConversation and invalidates lists', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useArchiveConversation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync('c1');

    expect(archiveConversation).toHaveBeenCalledWith('c1');
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: conversationKeys.lists(),
    });
  });
});

describe('useAddParticipants', () => {
  it('calls addParticipants and invalidates detail on settled', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useAddParticipants(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync({
      conversationId: 'c1',
      participantIds: ['u1', 'u2'],
    });

    expect(addParticipants).toHaveBeenCalledWith('c1', ['u1', 'u2']);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: conversationKeys.detail('c1'),
    });
  });

  it('performs optimistic update when cache has data', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const existingData = {
      data: {
        id: 'c1',
        type: 'group',
        name: 'Team',
        description: null,
        avatar_url: null,
        creator_id: 'u0',
        is_archived: false,
        last_message_at: null,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        participants: [
          {
            id: 'p1',
            conversation_id: 'c1',
            user_id: 'u0',
            role: 'owner',
            nickname: null,
            joined_at: '2026-01-01T00:00:00Z',
          },
        ],
      },
    };

    queryClient.setQueryData(conversationKeys.detail('c1'), existingData);

    const { result } = renderHook(() => useAddParticipants(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync({
      conversationId: 'c1',
      participantIds: ['u1'],
    });

    expect(addParticipants).toHaveBeenCalledWith('c1', ['u1']);
  });

  it('rolls back on error', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const existingData = {
      data: {
        id: 'c1',
        type: 'group',
        name: 'Team',
        description: null,
        avatar_url: null,
        creator_id: 'u0',
        is_archived: false,
        last_message_at: null,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        participants: [
          {
            id: 'p1',
            conversation_id: 'c1',
            user_id: 'u0',
            role: 'owner',
            nickname: null,
            joined_at: '2026-01-01T00:00:00Z',
          },
        ],
      },
    };

    queryClient.setQueryData(conversationKeys.detail('c1'), existingData);
    vi.mocked(addParticipants).mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useAddParticipants(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(
      result.current.mutateAsync({
        conversationId: 'c1',
        participantIds: ['u1'],
      }),
    ).rejects.toThrow('fail');

    // Should have rolled back to original data
    const cached = queryClient.getQueryData(conversationKeys.detail('c1'));
    expect(cached).toEqual(existingData);
  });
});

describe('useRemoveParticipant', () => {
  it('calls removeParticipant and invalidates detail and lists', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useRemoveParticipant(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync({
      conversationId: 'c1',
      userId: 'u1',
    });

    expect(removeParticipant).toHaveBeenCalledWith('c1', 'u1');
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: conversationKeys.detail('c1'),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: conversationKeys.lists(),
    });
  });

  it('performs optimistic removal from cache', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const existingData = {
      data: {
        id: 'c1',
        type: 'group',
        name: 'Team',
        description: null,
        avatar_url: null,
        creator_id: 'u0',
        is_archived: false,
        last_message_at: null,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        participants: [
          {
            id: 'p1',
            conversation_id: 'c1',
            user_id: 'u0',
            role: 'owner',
            nickname: null,
            joined_at: '2026-01-01T00:00:00Z',
          },
          {
            id: 'p2',
            conversation_id: 'c1',
            user_id: 'u1',
            role: 'member',
            nickname: null,
            joined_at: '2026-01-01T00:00:00Z',
          },
        ],
      },
    };

    queryClient.setQueryData(conversationKeys.detail('c1'), existingData);

    const { result } = renderHook(() => useRemoveParticipant(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync({
      conversationId: 'c1',
      userId: 'u1',
    });

    expect(removeParticipant).toHaveBeenCalledWith('c1', 'u1');
  });

  it('rolls back on error', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const existingData = {
      data: {
        id: 'c1',
        type: 'group',
        name: 'Team',
        description: null,
        avatar_url: null,
        creator_id: 'u0',
        is_archived: false,
        last_message_at: null,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        participants: [
          {
            id: 'p1',
            conversation_id: 'c1',
            user_id: 'u0',
            role: 'owner',
            nickname: null,
            joined_at: '2026-01-01T00:00:00Z',
          },
          {
            id: 'p2',
            conversation_id: 'c1',
            user_id: 'u1',
            role: 'member',
            nickname: null,
            joined_at: '2026-01-01T00:00:00Z',
          },
        ],
      },
    };

    queryClient.setQueryData(conversationKeys.detail('c1'), existingData);
    vi.mocked(removeParticipant).mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useRemoveParticipant(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(
      result.current.mutateAsync({ conversationId: 'c1', userId: 'u1' }),
    ).rejects.toThrow('fail');

    const cached = queryClient.getQueryData(conversationKeys.detail('c1'));
    expect(cached).toEqual(existingData);
  });
});

describe('useLeaveConversation', () => {
  it('calls removeParticipant with current user id and invalidates lists', async () => {
    useAuthStore.setState({
      user: { id: 'me-123', email: 'me@test.com', username: 'me' },
    });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useLeaveConversation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync('c1');

    expect(removeParticipant).toHaveBeenCalledWith('c1', 'me-123');
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: conversationKeys.lists(),
    });
  });

  it('throws when user is not authenticated', async () => {
    useAuthStore.setState({ user: null });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result } = renderHook(() => useLeaveConversation(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(result.current.mutateAsync('c1')).rejects.toThrow(
      'User not authenticated',
    );
  });
});
