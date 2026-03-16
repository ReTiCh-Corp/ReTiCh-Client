import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

function renderSidebar(initialRoute = '/chat') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Sidebar />
    </MemoryRouter>,
  );
}

describe('Sidebar', () => {
  it('renders the logo button', () => {
    renderSidebar();
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('renders Chat and Settings nav items', () => {
    renderSidebar();
    expect(screen.getByTitle('Chat')).toBeInTheDocument();
    expect(screen.getByTitle('Settings')).toBeInTheDocument();
  });

  it('highlights Chat nav item when on /chat route', () => {
    renderSidebar('/chat');
    const chatButton = screen.getByTitle('Chat');
    expect(chatButton.className).toContain('bg-primary-50');
  });

  it('highlights Settings nav item when on /settings route', () => {
    renderSidebar('/settings');
    const settingsButton = screen.getByTitle('Settings');
    expect(settingsButton.className).toContain('bg-primary-50');
  });

  it('navigates when a nav item is clicked', async () => {
    const user = userEvent.setup();
    renderSidebar('/chat');

    await user.click(screen.getByTitle('Settings'));
    const settingsButton = screen.getByTitle('Settings');
    expect(settingsButton.className).toContain('bg-primary-50');
  });

  it('navigates to /chat when the logo button is clicked', async () => {
    const user = userEvent.setup();
    renderSidebar('/settings');

    await user.click(screen.getByText('R'));
    const chatButton = screen.getByTitle('Chat');
    expect(chatButton.className).toContain('bg-primary-50');
  });
});
