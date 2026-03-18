import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Participant } from '../../api/conversations';
import ParticipantList from './ParticipantList';

const mockParticipants: Participant[] = [
  {
    id: 'p1',
    conversation_id: 'conv-1',
    user_id: 'user-1',
    role: 'owner',
    nickname: 'Alice',
    joined_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'p2',
    conversation_id: 'conv-1',
    user_id: 'user-2',
    role: 'admin',
    nickname: 'Bob',
    joined_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'p3',
    conversation_id: 'conv-1',
    user_id: 'user-3',
    role: 'member',
    nickname: 'Carol',
    joined_at: '2026-01-01T00:00:00Z',
  },
];

describe('ParticipantList', () => {
  const onRemove = vi.fn();

  beforeEach(() => {
    onRemove.mockClear();
  });

  it('renders all participants with their names', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        currentUserId="user-1"
        currentUserRole="owner"
        onRemove={onRemove}
        removingUserId={null}
      />,
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('shows role badges for owner and admin', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        currentUserId="user-1"
        currentUserRole="owner"
        onRemove={onRemove}
        removingUserId={null}
      />,
    );

    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows "(you)" indicator for current user', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        currentUserId="user-1"
        currentUserRole="owner"
        onRemove={onRemove}
        removingUserId={null}
      />,
    );

    expect(screen.getByText('(you)')).toBeInTheDocument();
  });

  it('shows remove buttons for non-owner participants when user is owner', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        currentUserId="user-1"
        currentUserRole="owner"
        onRemove={onRemove}
        removingUserId={null}
      />,
    );

    expect(screen.getByLabelText('Remove Bob')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove Carol')).toBeInTheDocument();
    // Should not show remove for self
    expect(screen.queryByLabelText('Remove Alice')).not.toBeInTheDocument();
  });

  it('does not show remove buttons when user is a regular member', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        currentUserId="user-3"
        currentUserRole="member"
        onRemove={onRemove}
        removingUserId={null}
      />,
    );

    expect(screen.queryByLabelText('Remove Alice')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Remove Bob')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Remove Carol')).not.toBeInTheDocument();
  });

  it('calls onRemove with user_id when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ParticipantList
        participants={mockParticipants}
        currentUserId="user-1"
        currentUserRole="owner"
        onRemove={onRemove}
        removingUserId={null}
      />,
    );

    await user.click(screen.getByLabelText('Remove Carol'));
    expect(onRemove).toHaveBeenCalledWith('user-3');
  });

  it('shows loading spinner for the participant being removed', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        currentUserId="user-1"
        currentUserRole="owner"
        onRemove={onRemove}
        removingUserId="user-3"
      />,
    );

    // The remove button for Carol should show a spinner
    const removeButton = screen.getByLabelText('Remove Carol');
    expect(removeButton.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('does not allow removing the owner', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        currentUserId="user-2"
        currentUserRole="admin"
        onRemove={onRemove}
        removingUserId={null}
      />,
    );

    // Admin cannot remove owner
    expect(screen.queryByLabelText('Remove Alice')).not.toBeInTheDocument();
    // Admin can remove member
    expect(screen.getByLabelText('Remove Carol')).toBeInTheDocument();
  });

  it('uses user_id as display name when nickname is null', () => {
    const participantNoNickname: Participant[] = [
      {
        id: 'p1',
        conversation_id: 'conv-1',
        user_id: 'user-42',
        role: 'member',
        nickname: null,
        joined_at: '2026-01-01T00:00:00Z',
      },
    ];

    render(
      <ParticipantList
        participants={participantNoNickname}
        currentUserId="other"
        currentUserRole="owner"
        onRemove={onRemove}
        removingUserId={null}
      />,
    );

    expect(screen.getByText('user-42')).toBeInTheDocument();
  });
});
