import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import i18n from '../../i18n';
import ChatArea from './ChatArea';

vi.mock('../../hooks/useMessages', () => ({
  useMessages: () => ({
    data: {
      data: [
        {
          id: 'msg-2',
          conversation_id: 'conv-1',
          sender_id: 'user-1',
          type: 'text',
          content: 'Hello there!',
          is_edited: false,
          created_at: '2026-03-31T12:47:00Z',
        },
        {
          id: 'msg-1',
          conversation_id: 'conv-1',
          sender_id: 'other-user',
          type: 'text',
          content: 'Hi, how are you?',
          is_edited: false,
          created_at: '2026-03-31T12:45:00Z',
        },
      ],
    },
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

vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: vi.fn((selector: (s: unknown) => unknown) =>
    selector({
      user: { id: 'user-1', email: 'me@test.com', username: 'me' },
    }),
  ),
}));

vi.mock('../../stores/useMessageStore', () => ({
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

vi.mock('../../hooks/useSocial', () => ({
  useAddReaction: () => ({ mutate: vi.fn(), isPending: false }),
  useRemoveReaction: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateReadReceipt: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('../../hooks/useUploads', () => ({
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

describe('ChatArea', () => {
  it('shows placeholder when no conversation is selected', () => {
    render(
      <ChatArea conversationId={null} conversationName={null} wsStatus="connected" />,
      { wrapper: createWrapper() },
    );
    expect(
      screen.getByText(i18n.t('chat.selectConversation')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('chat.startMessaging')),
    ).toBeInTheDocument();
  });

  it('renders the conversation header with name and initials', () => {
    render(
      <ChatArea conversationId="conv-1" conversationName="Samantha Smith" wsStatus="connected" />,
      { wrapper: createWrapper() },
    );
    expect(screen.getByText('Samantha Smith')).toBeInTheDocument();
    expect(screen.getAllByText('SS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(i18n.t('chat.online'))).toBeInTheDocument();
  });

  it('renders messages from the API', () => {
    render(
      <ChatArea conversationId="conv-1" conversationName="Samantha Smith" wsStatus="connected" />,
      { wrapper: createWrapper() },
    );
    expect(screen.getByText('Hi, how are you?')).toBeInTheDocument();
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
  });

  it('renders the input with placeholder containing first name', () => {
    render(
      <ChatArea conversationId="conv-1" conversationName="Samantha Smith" wsStatus="connected" />,
      { wrapper: createWrapper() },
    );
    expect(
      screen.getByPlaceholderText(
        i18n.t('chat.whisper', { name: 'Samantha' }),
      ),
    ).toBeInTheDocument();
  });

  it('updates input value when typing', async () => {
    const user = userEvent.setup();
    render(
      <ChatArea conversationId="conv-1" conversationName="Samantha Smith" wsStatus="connected" />,
      { wrapper: createWrapper() },
    );

    const input = screen.getByPlaceholderText(
      i18n.t('chat.whisper', { name: 'Samantha' }),
    );
    await user.type(input, 'Hello!');
    expect(input).toHaveValue('Hello!');
  });
});
