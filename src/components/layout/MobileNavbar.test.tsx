import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MobileNavbar from './MobileNavbar';

function renderNavbar(initialRoute = '/chat') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MobileNavbar />
    </MemoryRouter>,
  );
}

describe('MobileNavbar', () => {
  it('renders Chats, Settings and Profile items', () => {
    renderNavbar();
    expect(screen.getByText('Chats')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('highlights Chats when on /chat route', () => {
    renderNavbar('/chat');
    expect(screen.getByText('Chats').className).toContain('text-primary-600');
  });

  it('highlights Settings when on /settings route', () => {
    renderNavbar('/settings');
    expect(screen.getByText('Settings').className).toContain(
      'text-primary-600',
    );
  });

  it('navigates when a nav item is clicked', async () => {
    const user = userEvent.setup();
    renderNavbar('/chat');

    await user.click(screen.getByText('Settings'));
    expect(screen.getByText('Settings').className).toContain(
      'text-primary-600',
    );
  });

  it('navigates to profile when Profile is clicked', async () => {
    const user = userEvent.setup();
    renderNavbar('/chat');

    await user.click(screen.getByText('Profile'));
    expect(screen.getByText('Profile').className).toContain('text-primary-600');
  });
});
