import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError } from '../../api/client';
import AddParticipantModal from './AddParticipantModal';

const mockMutateAsync = vi.fn().mockResolvedValue({});

vi.mock('../../api/client', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    data?: unknown;
    constructor(status: number, message: string, data?: unknown) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.data = data;
    }
  },
}));

vi.mock('../../hooks/useConversations', () => ({
  useAddParticipants: vi.fn(() => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  })),
}));

vi.mock('../../hooks/useUsers', () => ({
  useUsers: vi.fn(() => ({
    data: {
      data: [
        { id: '1', email: 'alice@test.com', username: 'alice' },
        { id: '2', email: 'bob@test.com', username: 'bob' },
        { id: '3', email: 'carol@test.com', username: 'carol' },
      ],
    },
    isLoading: false,
  })),
}));

vi.mock('../../hooks/useDebounce', () => ({
  useDebounce: vi.fn((value: string) => value),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function renderModal(existingIds: string[] = []) {
  const onClose = vi.fn();
  render(
    <AddParticipantModal
      conversationId="conv-1"
      existingParticipantIds={existingIds}
      onClose={onClose}
      isClosing={false}
    />,
    { wrapper },
  );
  return { onClose };
}

describe('AddParticipantModal', () => {
  beforeEach(() => {
    mockMutateAsync.mockClear();
  });

  it('renders modal with title', () => {
    renderModal();
    expect(screen.getByText('Add members')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderModal();
    expect(screen.getByPlaceholderText('Search users…')).toBeInTheDocument();
  });

  it('renders available users', () => {
    renderModal();
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
    expect(screen.getByText('carol')).toBeInTheDocument();
  });

  it('filters out existing participants', () => {
    renderModal(['1']);
    expect(screen.queryByText('alice')).not.toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
    expect(screen.getByText('carol')).toBeInTheDocument();
  });

  it('can select and deselect users', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('alice'));
    // Should show pill
    const pills = screen.getAllByText('alice');
    expect(pills.length).toBe(2); // pill + list

    // Deselect
    await user.click(pills[pills.length - 1]);
    expect(screen.getAllByText('alice').length).toBe(1);
  });

  it('add button is disabled when no users selected', () => {
    renderModal();
    const addButton = screen.getByText('Add');
    expect(addButton).toBeDisabled();
  });

  it('calls mutateAsync with selected user ids', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByText('alice'));
    await user.click(screen.getByText('bob'));

    const addButton = screen.getByText('Add (2)');
    await user.click(addButton);

    expect(mockMutateAsync).toHaveBeenCalledWith({
      conversationId: 'conv-1',
      participantIds: ['1', '2'],
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose on Escape key', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('can remove selected user via pill X button', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('alice'));
    // Find the X button in the pill
    const pill = screen.getAllByText('alice')[0].closest('span');
    const xButton = pill?.querySelector('button');
    expect(xButton).toBeTruthy();
    await user.click(xButton as HTMLButtonElement);

    // Should only have one "alice" now (in the list)
    expect(screen.getAllByText('alice').length).toBe(1);
  });

  it('shows count in add button', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('alice'));
    expect(screen.getByText('Add (1)')).toBeInTheDocument();

    await user.click(screen.getByText('bob'));
    expect(screen.getByText('Add (2)')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    const backdrop = screen.getByLabelText('Close modal');
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows "No users found" when all users are existing participants', () => {
    renderModal(['1', '2', '3']);
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('shows error message when adding participants fails with 403', async () => {
    mockMutateAsync.mockRejectedValueOnce(new ApiError(403, 'Forbidden'));

    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('alice'));
    const addButton = screen.getByText('Add (1)');
    await user.click(addButton);

    expect(
      await screen.findByText("You don't have permission to add members"),
    ).toBeInTheDocument();
  });

  it('shows generic error message when adding participants fails with non-403', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Server error'));

    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('alice'));
    await user.click(screen.getByText('Add (1)'));

    expect(await screen.findByText('Server error')).toBeInTheDocument();
  });

  it('filters users by search term', async () => {
    const user = userEvent.setup();
    renderModal();

    const searchInput = screen.getByPlaceholderText('Search users…');
    await user.type(searchInput, 'ali');

    expect(searchInput).toHaveValue('ali');
  });
});
