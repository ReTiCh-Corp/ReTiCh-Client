vi.mock('@retish/auth', () => ({
  ReTiChAuth: class {
    getAccessToken = vi.fn().mockResolvedValue(null);
  },
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import en from '../i18n/locales/en.json';

const t = (key: keyof typeof en) => en[key];

import Chat from './Chat';

vi.mock('../hooks/useConversations', () => ({
  useConversations: () => ({
    data: {
      data: [
        {
          id: '1',
          type: 'direct',
          name: 'Adriana Hawk',
          description: null,
          avatar_url: null,
          creator_id: null,
          is_archived: false,
          last_message_at: null,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        {
          id: '2',
          type: 'direct',
          name: 'Samantha Smith',
          description: null,
          avatar_url: null,
          creator_id: null,
          is_archived: false,
          last_message_at: null,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ],
    },
    isLoading: false,
    error: null,
  }),
  useConversation: () => ({
    data: {
      data: {
        id: '1',
        type: 'direct',
        name: 'Adriana Hawk',
        description: null,
        avatar_url: null,
        creator_id: null,
        is_archived: false,
        last_message_at: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        participants: [],
      },
    },
    isLoading: false,
    error: null,
  }),
  useLeaveConversation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useRemoveParticipant: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('../stores/useAuthStore', () => ({
  useAuthStore: vi.fn((selector: (s: unknown) => unknown) =>
    selector({ user: { id: 'user-1', email: 'me@test.com', username: 'me' } }),
  ),
}));

vi.mock('../hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

vi.mock('../hooks/useWebSocket', () => ({
  useWebSocket: () => ({
    status: 'connected',
    sendEvent: vi.fn(),
    disconnect: vi.fn(),
  }),
}));

vi.mock('../hooks/useMessages', () => ({
  useMessages: () => ({
    data: { data: [] },
    isLoading: false,
    error: null,
  }),
  useSendMessage: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUpdateMessage: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useDeleteMessage: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useSearchMessages: () => ({
    data: null,
    isLoading: false,
  }),
}));

vi.mock('../stores/useMessageStore', () => ({
  useMessageStore: vi.fn((selector?: (s: unknown) => unknown) => {
    const state = {
      editingMessage: null,
      replyingTo: null,
      typingUsers: {},
      drafts: {},
      setEditingMessage: vi.fn(),
      setReplyingTo: vi.fn(),
      addTypingUser: vi.fn(),
      removeTypingUser: vi.fn(),
      setDraft: vi.fn(),
      clearDraft: vi.fn(),
    };
    if (typeof selector === 'function') return selector(state);
    return state;
  }),
}));

vi.mock('../hooks/useSocial', () => ({
  useAddReaction: () => ({ mutate: vi.fn(), isPending: false }),
  useRemoveReaction: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateReadReceipt: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('../hooks/useUploads', () => ({
  useUploadFile: () => ({ mutate: vi.fn(), isPending: false }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('Chat', () => {
  it('renders conversation list and chat area', () => {
    render(<Chat />, { wrapper: createWrapper() });
    expect(screen.getByText(t('chat.messages'))).toBeInTheDocument();
  });

  it('selects a conversation and shows details panel', async () => {
    const user = userEvent.setup();
    render(<Chat />, { wrapper: createWrapper() });

    await user.click(screen.getAllByText('Adriana Hawk')[0]);
    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });
  });

  it('closes contact details when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Chat />, { wrapper: createWrapper() });

    // First select a conversation to show details
    await user.click(screen.getAllByText('Adriana Hawk')[0]);
    await waitFor(() => {
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    const closeButton = screen
      .getByText('Details')
      .closest('div')
      ?.querySelector('button');
    if (closeButton) {
      await user.click(closeButton);
    }

    await waitFor(() => {
      expect(screen.queryByText('Details')).not.toBeInTheDocument();
    });
  });

  it('goes back to conversation list on mobile when back is triggered', async () => {
    const user = userEvent.setup();
    render(<Chat />, { wrapper: createWrapper() });

    await user.click(screen.getAllByText('Adriana Hawk')[0]);

    const backButton = screen.getByLabelText(t('chat.back'));
    await user.click(backButton);

    expect(screen.getByText(t('chat.messages'))).toBeInTheDocument();
  });
});
