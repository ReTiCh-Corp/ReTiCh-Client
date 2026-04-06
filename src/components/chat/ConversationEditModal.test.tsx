import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import type { ConversationDetail } from '../../api/conversations';
import ConversationEditModal from './ConversationEditModal';

const mockMutateAsync = vi.fn().mockResolvedValue({ data: { id: 'conv-1' } });

vi.mock('../../hooks/useConversations', () => ({
  useUpdateConversation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

const mockConversation: ConversationDetail = {
  id: 'conv-1',
  type: 'group',
  name: 'Team Chat',
  description: 'Our team group',
  avatar_url: 'https://example.com/avatar.png',
  creator_id: 'user-1',
  is_archived: false,
  last_message_at: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  unread_count: 0,
  participants: [],
};

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
    conversation?: ConversationDetail;
    onClose?: () => void;
    isClosing?: boolean;
  } = {},
) {
  const onClose = props.onClose ?? vi.fn();
  return {
    onClose,
    ...render(
      <ConversationEditModal
        conversation={props.conversation ?? mockConversation}
        onClose={onClose}
        isClosing={props.isClosing ?? false}
      />,
      { wrapper: createWrapper() },
    ),
  };
}

beforeEach(() => {
  mockMutateAsync.mockClear();
});

describe('ConversationEditModal', () => {
  it('renders modal with title "Edit conversation"', () => {
    renderModal();
    expect(screen.getByText('Edit conversation')).toBeInTheDocument();
  });

  it('pre-fills name, description, and avatar URL inputs', () => {
    renderModal();
    expect(screen.getByPlaceholderText('Conversation name…')).toHaveValue(
      'Team Chat',
    );
    expect(screen.getByPlaceholderText('Add a description…')).toHaveValue(
      'Our team group',
    );
    expect(
      screen.getByPlaceholderText('https://example.com/avatar.png'),
    ).toHaveValue('https://example.com/avatar.png');
  });

  it('save button is disabled when name is empty', async () => {
    const user = userEvent.setup();
    renderModal();

    const nameInput = screen.getByPlaceholderText('Conversation name…');
    await user.clear(nameInput);

    expect(screen.getByText('Save').closest('button')).toBeDisabled();
  });

  it('calls mutateAsync with correct payload on save', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    const nameInput = screen.getByPlaceholderText('Conversation name…');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    await user.click(screen.getByText('Save'));

    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: 'conv-1',
      input: {
        name: 'Updated Name',
        description: 'Our team group',
        avatar_url: 'https://example.com/avatar.png',
      },
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose after successful save', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByText('Save'));

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose on Cancel click', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on Escape key', () => {
    const { onClose } = renderModal();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on backdrop click', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    const backdrop = screen.getByLabelText('Close modal');
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not submit when name is whitespace only', async () => {
    const user = userEvent.setup();
    renderModal();

    const nameInput = screen.getByPlaceholderText('Conversation name…');
    await user.clear(nameInput);
    await user.type(nameInput, '   ');

    expect(screen.getByText('Save').closest('button')).toBeDisabled();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('sends undefined for empty description and avatar_url', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal({
      conversation: {
        ...mockConversation,
        description: null,
        avatar_url: null,
      },
    });

    await user.click(screen.getByText('Save'));

    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: 'conv-1',
      input: {
        name: 'Team Chat',
        description: undefined,
        avatar_url: undefined,
      },
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('can edit description and avatar URL fields', async () => {
    const user = userEvent.setup();
    renderModal({
      conversation: {
        ...mockConversation,
        description: null,
        avatar_url: null,
      },
    });

    const descInput = screen.getByPlaceholderText('Add a description…');
    await user.type(descInput, 'New desc');

    const avatarInput = screen.getByPlaceholderText(
      'https://example.com/avatar.png',
    );
    await user.type(avatarInput, 'https://img.com/pic.png');

    await user.click(screen.getByText('Save'));

    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: 'conv-1',
      input: {
        name: 'Team Chat',
        description: 'New desc',
        avatar_url: 'https://img.com/pic.png',
      },
    });
  });

  it('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    const dialog = screen.getByRole('dialog');
    const xButton = dialog.querySelector(
      '.flex.items-center.justify-between button',
    );
    await user.click(xButton as HTMLButtonElement);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
