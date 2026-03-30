import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '../../i18n';
import ChatArea from './ChatArea';

describe('ChatArea', () => {
  it('shows placeholder when no conversation is selected', () => {
    render(<ChatArea conversationName={null} />);
    expect(screen.getByText(i18n.t('chat.selectConversation'))).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('chat.startMessaging')),
    ).toBeInTheDocument();
  });

  it('renders the conversation header with name and initials', () => {
    render(<ChatArea conversationName="Samantha Smith" />);
    expect(screen.getByText('Samantha Smith')).toBeInTheDocument();
    expect(screen.getAllByText('SS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(i18n.t('chat.online'))).toBeInTheDocument();
  });

  it('renders mock messages', () => {
    render(<ChatArea conversationName="Samantha Smith" />);
    expect(screen.getByText(/I'm curious/)).toBeInTheDocument();
    expect(screen.getByText(/Here is the link/)).toBeInTheDocument();
  });

  it('renders the input with placeholder containing first name', () => {
    render(<ChatArea conversationName="Samantha Smith" />);
    expect(
      screen.getByPlaceholderText(i18n.t('chat.whisper', { name: 'Samantha' })),
    ).toBeInTheDocument();
  });

  it('updates input value when typing', async () => {
    const user = userEvent.setup();
    render(<ChatArea conversationName="Samantha Smith" />);

    const input = screen.getByPlaceholderText(
      i18n.t('chat.whisper', { name: 'Samantha' }),
    );
    await user.type(input, 'Hello!');
    expect(input).toHaveValue('Hello!');
  });
});
