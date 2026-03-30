import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../i18n';
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
    expect(screen.getByText(i18n.t('nav.chats'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('nav.settings'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('nav.profile'))).toBeInTheDocument();
  });

  it('highlights Chats when on /chat route', () => {
    renderNavbar('/chat');
    expect(screen.getByText(i18n.t('nav.chats')).className).toContain('text-primary-600');
  });

  it('highlights Settings when on /settings route', () => {
    renderNavbar('/settings');
    expect(screen.getByText(i18n.t('nav.settings')).className).toContain(
      'text-primary-600',
    );
  });

  it('navigates when a nav item is clicked', async () => {
    const user = userEvent.setup();
    renderNavbar('/chat');

    await user.click(screen.getByText(i18n.t('nav.settings')));
    expect(screen.getByText(i18n.t('nav.settings')).className).toContain(
      'text-primary-600',
    );
  });

  it('navigates to profile when Profile is clicked', async () => {
    const user = userEvent.setup();
    renderNavbar('/chat');

    await user.click(screen.getByText(i18n.t('nav.profile')));
    expect(screen.getByText(i18n.t('nav.profile')).className).toContain('text-primary-600');
  });
});
