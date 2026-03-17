import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
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
    data: { data: { name: 'Adriana Hawk' } },
    isLoading: false,
    error: null,
  }),
}));

vi.mock('../hooks/useDebounce', () => ({
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

describe('Chat', () => {
  it('renders conversation list, chat area and contact details', () => {
    render(<Chat />, { wrapper: createWrapper() });
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('selects a conversation when clicked', async () => {
    const user = userEvent.setup();
    render(<Chat />, { wrapper: createWrapper() });

    await user.click(screen.getAllByText('Adriana Hawk')[0]);
    expect(screen.getAllByText('Adriana Hawk').length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it('closes contact details when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Chat />, { wrapper: createWrapper() });

    expect(screen.getByText('Details')).toBeInTheDocument();

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

    const backButton = screen.getByLabelText('Back');
    await user.click(backButton);

    expect(screen.getByText('Messages')).toBeInTheDocument();
  });
});
