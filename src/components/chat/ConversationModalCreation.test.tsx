import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { ApiError } from '../../api/client';
import ConversationModalCreation from './ConversationModalCreation';

const mockMutateAsync = vi.fn().mockResolvedValue({ data: { id: 'new' } });

const mockUseUsers = vi.fn();

vi.mock('../../hooks/useUsers', () => ({
  useUsers: (...args: unknown[]) => mockUseUsers(...args),
}));

vi.mock('../../hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

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
  useCreateConversation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

const mockUsers = [
  { id: '1', email: 'alice@test.com', username: 'alice' },
  { id: '2', email: 'bob@test.com', username: 'bob' },
  { id: '3', email: 'carol@test.com', username: 'carol' },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function renderModal(
  props: {
    onClose?: () => void;
    isClosing?: boolean;
    onConversationCreated?: (id: string) => void;
  } = {},
) {
  const onClose = props.onClose ?? vi.fn();
  const onConversationCreated = props.onConversationCreated ?? vi.fn();
  return {
    onClose,
    onConversationCreated,
    ...render(
      <ConversationModalCreation
        onClose={onClose}
        isClosing={props.isClosing ?? false}
        onConversationCreated={onConversationCreated}
      />,
      { wrapper: createWrapper() },
    ),
  };
}

beforeEach(() => {
  mockMutateAsync.mockClear();
  mockUseUsers.mockReset();
  mockUseUsers.mockReturnValue({
    data: { data: mockUsers },
    isLoading: false,
  });
});

describe('ConversationModalCreation', () => {
  it('renders the modal with title', () => {
    renderModal();
    expect(screen.getByText('New conversation')).toBeInTheDocument();
  });

  it('renders the three type options', () => {
    renderModal();
    expect(screen.getByText('Direct')).toBeInTheDocument();
    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByText('Channel')).toBeInTheDocument();
  });

  it('renders member list from useUsers', () => {
    renderModal();
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
    expect(screen.getByText('carol')).toBeInTheDocument();
  });

  it('shows "No members found" when user list is empty and not loading', () => {
    mockUseUsers.mockReturnValue({ data: { data: [] }, isLoading: false });
    renderModal();
    expect(screen.getByText('No members found')).toBeInTheDocument();
  });

  it('shows loader when loading and no members', () => {
    mockUseUsers.mockReturnValue({ data: { data: [] }, isLoading: true });
    renderModal();
    expect(screen.queryByText('No members found')).not.toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    const closeButton = screen.getByRole('dialog').querySelector('button');
    await user.click(closeButton!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', () => {
    const { onClose } = renderModal();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    const backdrop = screen.getByLabelText('Close modal');
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('Create button is disabled by default', () => {
    renderModal();
    expect(screen.getByText('Create').closest('button')).toBeDisabled();
  });

  it('does not show name input by default', () => {
    renderModal();
    expect(
      screen.queryByPlaceholderText('Group name...'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Channel name...'),
    ).not.toBeInTheDocument();
  });

  it('shows name input when Group is selected', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Group'));
    expect(screen.getByPlaceholderText('Group name...')).toBeInTheDocument();
  });

  it('shows name input when Channel is selected', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Channel'));
    expect(screen.getByPlaceholderText('Channel name...')).toBeInTheDocument();
  });

  it('selects a member when clicked', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Direct'));
    await user.click(screen.getByText('alice'));

    // Should show pill with username
    const pills = screen.getAllByText('alice');
    expect(pills.length).toBeGreaterThanOrEqual(2); // one in list, one in pill
  });

  it('enables Create when type and member are selected (direct)', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Direct'));
    await user.click(screen.getByText('alice'));

    expect(screen.getByText('Create').closest('button')).toBeEnabled();
  });

  it('keeps Create disabled for group without name', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Group'));
    await user.click(screen.getByText('alice'));

    expect(screen.getByText('Create').closest('button')).toBeDisabled();
  });

  it('enables Create for group with name and member', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Group'));
    await user.type(screen.getByPlaceholderText('Group name...'), 'My Group');
    await user.click(screen.getByText('alice'));

    expect(screen.getByText('Create').closest('button')).toBeEnabled();
  });

  it('calls mutateAsync with correct payload for direct', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByText('Direct'));
    await user.click(screen.getByText('alice'));
    await user.click(screen.getByText('Create'));

    expect(mockMutateAsync).toHaveBeenCalledWith({
      type: 'direct',
      participant_ids: ['1'],
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('calls mutateAsync with name for group', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByText('Group'));
    await user.type(screen.getByPlaceholderText('Group name...'), 'Team Chat');
    await user.click(screen.getByText('alice'));
    await user.click(screen.getByText('bob'));
    await user.click(screen.getByText('Create'));

    expect(mockMutateAsync).toHaveBeenCalledWith({
      type: 'group',
      name: 'Team Chat',
      participant_ids: ['1', '2'],
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('limits to 1 member for direct type', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Direct'));
    await user.click(screen.getByText('alice'));
    await user.click(screen.getByText('bob'));

    // Only bob should be selected (replaced alice)
    await user.click(screen.getByText('Create'));
    expect(mockMutateAsync).toHaveBeenCalledWith({
      type: 'direct',
      participant_ids: ['2'],
    });
  });

  it('allows multiple members for group type', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Group'));
    await user.type(screen.getByPlaceholderText('Group name...'), 'Team');
    await user.click(screen.getByText('alice'));
    await user.click(screen.getByText('bob'));
    await user.click(screen.getByText('carol'));
    await user.click(screen.getByText('Create'));

    expect(mockMutateAsync).toHaveBeenCalledWith({
      type: 'group',
      name: 'Team',
      participant_ids: ['1', '2', '3'],
    });
  });

  it('can deselect a member by clicking again', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Group'));
    await user.type(screen.getByPlaceholderText('Group name...'), 'Team');
    await user.click(screen.getByText('alice'));
    await user.click(screen.getByText('bob'));
    // Deselect alice — click in the member list (second occurrence, first is pill)
    const aliceElements = screen.getAllByText('alice');
    await user.click(aliceElements[aliceElements.length - 1]);
    await user.click(screen.getByText('Create'));

    expect(mockMutateAsync).toHaveBeenCalledWith({
      type: 'group',
      name: 'Team',
      participant_ids: ['2'],
    });
  });

  it('resets members when switching to direct with multiple selected', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Group'));
    await user.type(screen.getByPlaceholderText('Group name...'), 'Team');
    await user.click(screen.getByText('alice'));
    await user.click(screen.getByText('bob'));

    // Switch to direct — should clear members since > 1
    await user.click(screen.getByText('Direct'));

    expect(screen.getByText('Create').closest('button')).toBeDisabled();
  });

  it('passes search term to useUsers', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByPlaceholderText('Search members...'), 'ali');

    expect(mockUseUsers).toHaveBeenCalledWith({
      search: 'ali',
      sort: 'new',
    });
  });

  it('passes undefined search when empty', () => {
    renderModal();

    expect(mockUseUsers).toHaveBeenCalledWith({
      search: undefined,
      sort: 'new',
    });
  });

  it('redirects to existing conversation on 409 Conflict', async () => {
    mockMutateAsync.mockRejectedValueOnce(
      new ApiError(409, 'Conflict', { data: { id: 'existing-conv-id' } }),
    );

    const user = userEvent.setup();
    const onConversationCreated = vi.fn();
    const { onClose } = renderModal({ onConversationCreated });

    await user.click(screen.getByText('Direct'));
    await user.click(screen.getByText('alice'));
    await user.click(screen.getByText('Create'));

    expect(onConversationCreated).toHaveBeenCalledWith('existing-conv-id');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows error message on generic error', async () => {
    mockMutateAsync.mockRejectedValueOnce(
      new ApiError(500, 'Server error'),
    );

    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByText('Direct'));
    await user.click(screen.getByText('alice'));
    await user.click(screen.getByText('Create'));

    expect(screen.getByText('Server error')).toBeInTheDocument();
  });
});
