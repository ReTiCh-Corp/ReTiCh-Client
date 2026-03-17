import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import ConversationList from './ConversationList';

vi.mock('../../hooks/useConversations', () => ({
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
        {
          id: '3',
          type: 'direct',
          name: 'Jane Lee',
          description: null,
          avatar_url: null,
          creator_id: null,
          is_archived: false,
          last_message_at: null,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        {
          id: '4',
          type: 'direct',
          name: 'Adrian Kolen',
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
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('ConversationList', () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it('renders the Messages heading', () => {
    render(<ConversationList selectedId={null} onSelect={onSelect} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('renders all conversations', () => {
    render(<ConversationList selectedId={null} onSelect={onSelect} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Adriana Hawk')).toBeInTheDocument();
    expect(screen.getByText('Samantha Smith')).toBeInTheDocument();
    expect(screen.getByText('Jane Lee')).toBeInTheDocument();
    expect(screen.getByText('Adrian Kolen')).toBeInTheDocument();
  });

  it('calls onSelect when a conversation is clicked', async () => {
    const user = userEvent.setup();
    render(<ConversationList selectedId={null} onSelect={onSelect} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByText('Jane Lee'));
    expect(onSelect).toHaveBeenCalledWith('3');
  });

  it('filters conversations by search input', async () => {
    const user = userEvent.setup();
    render(<ConversationList selectedId={null} onSelect={onSelect} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'Adrian');

    expect(screen.getByText('Adriana Hawk')).toBeInTheDocument();
    expect(screen.getByText('Adrian Kolen')).toBeInTheDocument();
    expect(screen.queryByText('Samantha Smith')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Lee')).not.toBeInTheDocument();
  });

  it('shows no conversations when search has no match', async () => {
    const user = userEvent.setup();
    render(<ConversationList selectedId={null} onSelect={onSelect} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'zzzzz');

    expect(screen.queryByText('Adriana Hawk')).not.toBeInTheDocument();
    expect(screen.queryByText('Samantha Smith')).not.toBeInTheDocument();
  });
});
