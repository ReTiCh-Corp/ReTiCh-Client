import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { useConversationStore } from '../../stores/useConversationStore';
import ConversationList from './ConversationList';

const allConversations = [
  {
    id: '1',
    type: 'direct' as const,
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
    type: 'direct' as const,
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
    type: 'direct' as const,
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
    type: 'direct' as const,
    name: 'Adrian Kolen',
    description: null,
    avatar_url: null,
    creator_id: null,
    is_archived: false,
    last_message_at: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

const adrianResults = allConversations.filter((c) =>
  c.name?.toLowerCase().includes('adrian'),
);

const mockUseConversations = vi.fn();

vi.mock('../../hooks/useConversations', () => ({
  useConversations: (...args: unknown[]) => mockUseConversations(...args),
}));

vi.mock('../../hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
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
    mockUseConversations.mockReset();
    mockUseConversations.mockReturnValue({
      data: { data: allConversations },
      isLoading: false,
      error: null,
    });
    useConversationStore.setState({
      searchTerm: '',
      searchResults: [],
    });
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

  it('passes search term to useConversations', async () => {
    mockUseConversations.mockImplementation((params?: { search?: string }) => {
      const data = params?.search
        ? allConversations.filter((c) =>
            c.name?.toLowerCase().includes(params.search?.toLowerCase() ?? ''),
          )
        : allConversations;
      return {
        data: { data },
        isLoading: false,
        error: null,
      };
    });

    const user = userEvent.setup();
    render(<ConversationList selectedId={null} onSelect={onSelect} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'Adrian');

    expect(mockUseConversations).toHaveBeenCalledWith({ search: 'Adrian' });
  });

  it('displays filtered results from backend search', async () => {
    mockUseConversations.mockImplementation((params?: { search?: string }) => {
      const data = params?.search
        ? allConversations.filter((c) =>
            c.name?.toLowerCase().includes(params.search?.toLowerCase() ?? ''),
          )
        : allConversations;
      return {
        data: { data },
        isLoading: false,
        error: null,
      };
    });

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

  it('syncs search results to the store', async () => {
    mockUseConversations.mockReturnValue({
      data: { data: adrianResults },
      isLoading: false,
      error: null,
    });

    render(<ConversationList selectedId={null} onSelect={onSelect} />, {
      wrapper: createWrapper(),
    });

    expect(useConversationStore.getState().searchResults).toEqual(
      adrianResults,
    );
  });

  it('shows loading state', () => {
    mockUseConversations.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<ConversationList selectedId={null} onSelect={onSelect} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.queryByText('Failed to load conversations'),
    ).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseConversations.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('fail'),
    });

    render(<ConversationList selectedId={null} onSelect={onSelect} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByText('Failed to load conversations'),
    ).toBeInTheDocument();
  });

  it('calls useConversations with undefined when search is empty', () => {
    render(<ConversationList selectedId={null} onSelect={onSelect} />, {
      wrapper: createWrapper(),
    });

    expect(mockUseConversations).toHaveBeenCalledWith(undefined);
  });
});
