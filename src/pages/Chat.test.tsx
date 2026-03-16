import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chat from './Chat';

describe('Chat', () => {
  it('renders conversation list, chat area and contact details', () => {
    render(<Chat />);
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getAllByText('Samantha Smith').length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('selects a conversation when clicked', async () => {
    const user = userEvent.setup();
    render(<Chat />);

    await user.click(screen.getByText('Adriana Hawk'));
    // Name appears in both the list and the chat header
    expect(screen.getAllByText('Adriana Hawk').length).toBeGreaterThanOrEqual(
      2,
    );
  });

  it('closes contact details when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Chat />);

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
});
