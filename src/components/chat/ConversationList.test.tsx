import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConversationList from './ConversationList';

describe('ConversationList', () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it('renders the Messages heading', () => {
    render(<ConversationList selectedId={null} onSelect={onSelect} />);
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('renders all conversations', () => {
    render(<ConversationList selectedId={null} onSelect={onSelect} />);
    expect(screen.getByText('Adriana Hawk')).toBeInTheDocument();
    expect(screen.getByText('Samantha Smith')).toBeInTheDocument();
    expect(screen.getByText('Jane Lee')).toBeInTheDocument();
    expect(screen.getByText('Adrian Kolen')).toBeInTheDocument();
  });

  it('shows unread badges for conversations with unread messages', () => {
    render(<ConversationList selectedId={null} onSelect={onSelect} />);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onSelect when a conversation is clicked', async () => {
    const user = userEvent.setup();
    render(<ConversationList selectedId={null} onSelect={onSelect} />);

    await user.click(screen.getByText('Jane Lee'));
    expect(onSelect).toHaveBeenCalledWith('3');
  });

  it('filters conversations by search input', async () => {
    const user = userEvent.setup();
    render(<ConversationList selectedId={null} onSelect={onSelect} />);

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'Adrian');

    expect(screen.getByText('Adriana Hawk')).toBeInTheDocument();
    expect(screen.getByText('Adrian Kolen')).toBeInTheDocument();
    expect(screen.queryByText('Samantha Smith')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Lee')).not.toBeInTheDocument();
  });

  it('shows no conversations when search has no match', async () => {
    const user = userEvent.setup();
    render(<ConversationList selectedId={null} onSelect={onSelect} />);

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'zzzzz');

    expect(screen.queryByText('Adriana Hawk')).not.toBeInTheDocument();
    expect(screen.queryByText('Samantha Smith')).not.toBeInTheDocument();
  });
});
