import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactDetails from './ContactDetails';

const mockRemoveMutateAsync = vi.fn().mockResolvedValue(undefined);
const mockLeaveMutateAsync = vi.fn().mockResolvedValue(undefined);

vi.mock('../../hooks/useConversations', () => ({
  useConversation: vi.fn(),
  useLeaveConversation: vi.fn(() => ({
    mutateAsync: mockLeaveMutateAsync,
    isPending: false,
  })),
  useRemoveParticipant: vi.fn(() => ({
    mutateAsync: mockRemoveMutateAsync,
    isPending: false,
  })),
  useAddParticipants: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useUpdateConversation: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('../../stores/useAuthStore', () => ({
  useAuthStore: vi.fn((selector: (s: unknown) => unknown) =>
    selector({
      user: { id: 'current-user', email: 'me@test.com', username: 'me' },
    }),
  ),
}));

vi.mock('../../hooks/useUsers', () => ({
  useUsers: vi.fn(() => ({ data: { data: [] }, isLoading: false })),
}));

vi.mock('./AddParticipantModal', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="add-participant-modal">
      <button type="button" onClick={onClose}>
        close-add-modal
      </button>
    </div>
  ),
}));

vi.mock('./ConversationEditModal', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="edit-modal">
      <button type="button" onClick={onClose}>
        close-edit-modal
      </button>
    </div>
  ),
}));

const { useConversation } = await import('../../hooks/useConversations');
const mockUseConversation = vi.mocked(useConversation);

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockDirectConversation = {
  data: {
    id: 'conv-1',
    type: 'direct' as const,
    name: 'Alice',
    description: null,
    avatar_url: null,
    creator_id: 'current-user',
    is_archived: false,
    last_message_at: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    participants: [
      {
        id: 'p1',
        conversation_id: 'conv-1',
        user_id: 'current-user',
        role: 'member',
        nickname: 'me',
        joined_at: '2026-01-01T00:00:00Z',
      },
      {
        id: 'p2',
        conversation_id: 'conv-1',
        user_id: 'user-2',
        role: 'member',
        nickname: 'Alice',
        joined_at: '2026-01-01T00:00:00Z',
      },
    ],
  },
};

const mockGroupConversation = {
  data: {
    id: 'conv-2',
    type: 'group' as const,
    name: 'Team Chat',
    description: 'Our team group',
    avatar_url: null,
    creator_id: 'current-user',
    is_archived: false,
    last_message_at: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    participants: [
      {
        id: 'p1',
        conversation_id: 'conv-2',
        user_id: 'current-user',
        role: 'owner',
        nickname: 'me',
        joined_at: '2026-01-01T00:00:00Z',
      },
      {
        id: 'p2',
        conversation_id: 'conv-2',
        user_id: 'user-2',
        role: 'member',
        nickname: 'Bob',
        joined_at: '2026-01-01T00:00:00Z',
      },
      {
        id: 'p3',
        conversation_id: 'conv-2',
        user_id: 'user-3',
        role: 'admin',
        nickname: 'Carol',
        joined_at: '2026-01-01T00:00:00Z',
      },
    ],
  },
};

describe('ContactDetails', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
    mockRemoveMutateAsync.mockClear();
    mockLeaveMutateAsync.mockClear();
  });

  it('renders nothing when conversationId is null', () => {
    mockUseConversation.mockReturnValue({
      data: undefined,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    const { container } = render(
      <ContactDetails conversationId={null} onClose={onClose} />,
      { wrapper },
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders loading spinner while fetching', () => {
    mockUseConversation.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-1" onClose={onClose} />, {
      wrapper,
    });
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders direct conversation with name and initials', () => {
    mockUseConversation.mockReturnValue({
      data: mockDirectConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-1" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders shared media section', () => {
    mockUseConversation.mockReturnValue({
      data: mockDirectConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-1" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.getByText('Shared Media')).toBeInTheDocument();
  });

  it('renders group conversation with participants list', () => {
    mockUseConversation.mockReturnValue({
      data: mockGroupConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.getByText('Team Chat')).toBeInTheDocument();
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('3 members')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('shows "Add" button for owner in group conversation', () => {
    mockUseConversation.mockReturnValue({
      data: mockGroupConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('shows "Leave conversation" button for group conversations', () => {
    mockUseConversation.mockReturnValue({
      data: mockGroupConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.getByText('Leave conversation')).toBeInTheDocument();
  });

  it('does not show "Leave conversation" for direct conversations', () => {
    mockUseConversation.mockReturnValue({
      data: mockDirectConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-1" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.queryByText('Leave conversation')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    mockUseConversation.mockReturnValue({
      data: mockDirectConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-1" onClose={onClose} />, {
      wrapper,
    });

    const closeButton = screen
      .getByText('Details')
      .closest('div')
      ?.querySelector('button');
    expect(closeButton).toBeTruthy();
    await user.click(closeButton as HTMLButtonElement);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('shows description for group conversations', () => {
    mockUseConversation.mockReturnValue({
      data: mockGroupConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.getByText('Our team group')).toBeInTheDocument();
  });

  it('shows edit button for owner on group conversation', () => {
    mockUseConversation.mockReturnValue({
      data: mockGroupConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.getByLabelText('Edit conversation')).toBeInTheDocument();
  });

  it('does not show edit button for regular member on group conversation', () => {
    const mockGroupAsMember = {
      data: {
        ...mockGroupConversation.data,
        participants: mockGroupConversation.data.participants.map((p) =>
          p.user_id === 'current-user' ? { ...p, role: 'member' } : p,
        ),
      },
    };

    mockUseConversation.mockReturnValue({
      data: mockGroupAsMember,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.queryByLabelText('Edit conversation')).not.toBeInTheDocument();
  });

  it('does not show edit button on direct conversation', () => {
    mockUseConversation.mockReturnValue({
      data: mockDirectConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-1" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.queryByLabelText('Edit conversation')).not.toBeInTheDocument();
  });

  it('renders nothing when conversation data is undefined', () => {
    mockUseConversation.mockReturnValue({
      data: { data: undefined },
      isLoading: false,
    } as unknown as ReturnType<typeof useConversation>);

    const { container } = render(
      <ContactDetails conversationId="conv-1" onClose={onClose} />,
      { wrapper },
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows "Direct message" when name is null', () => {
    mockUseConversation.mockReturnValue({
      data: {
        data: {
          ...mockDirectConversation.data,
          name: null,
        },
      },
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-1" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.getByText('Direct message')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('shows Contact Info section for direct conversations', () => {
    mockUseConversation.mockReturnValue({
      data: mockDirectConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-1" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.getByText('Contact Info')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
  });

  it('calls removeParticipant when remove button is clicked', async () => {
    const user = userEvent.setup();
    mockUseConversation.mockReturnValue({
      data: mockGroupConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });

    const removeButton = screen.getByLabelText('Remove Bob');
    await user.click(removeButton);

    expect(mockRemoveMutateAsync).toHaveBeenCalledWith({
      conversationId: 'conv-2',
      userId: 'user-2',
    });
  });

  it('calls leaveConversation when Leave button is clicked', async () => {
    const user = userEvent.setup();
    mockUseConversation.mockReturnValue({
      data: mockGroupConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });

    await user.click(screen.getByText('Leave conversation'));

    expect(mockLeaveMutateAsync).toHaveBeenCalledWith('conv-2');
  });

  it('does not show "Add" button for non-admin member in group', () => {
    const memberGroupConversation = {
      data: {
        ...mockGroupConversation.data,
        participants: [
          {
            id: 'p1',
            conversation_id: 'conv-2',
            user_id: 'current-user',
            role: 'member',
            nickname: 'me',
            joined_at: '2026-01-01T00:00:00Z',
          },
          {
            id: 'p2',
            conversation_id: 'conv-2',
            user_id: 'user-2',
            role: 'owner',
            nickname: 'Bob',
            joined_at: '2026-01-01T00:00:00Z',
          },
        ],
      },
    };

    mockUseConversation.mockReturnValue({
      data: memberGroupConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });

  it('shows singular "member" for 1 participant', () => {
    const singleMemberGroup = {
      data: {
        ...mockGroupConversation.data,
        participants: [
          {
            id: 'p1',
            conversation_id: 'conv-2',
            user_id: 'current-user',
            role: 'owner',
            nickname: 'me',
            joined_at: '2026-01-01T00:00:00Z',
          },
        ],
      },
    };

    mockUseConversation.mockReturnValue({
      data: singleMemberGroup,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });
    expect(screen.getByText('1 member')).toBeInTheDocument();
  });

  it('opens Add Participant modal when Add button is clicked', async () => {
    const user = userEvent.setup();
    mockUseConversation.mockReturnValue({
      data: mockGroupConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });

    expect(screen.queryByTestId('add-participant-modal')).not.toBeInTheDocument();

    await user.click(screen.getByText('Add'));

    expect(screen.getByTestId('add-participant-modal')).toBeInTheDocument();
  });

  it('opens Edit modal when edit button is clicked', async () => {
    const user = userEvent.setup();
    mockUseConversation.mockReturnValue({
      data: mockGroupConversation,
      isLoading: false,
    } as ReturnType<typeof useConversation>);

    render(<ContactDetails conversationId="conv-2" onClose={onClose} />, {
      wrapper,
    });

    expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Edit conversation'));

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });
});
