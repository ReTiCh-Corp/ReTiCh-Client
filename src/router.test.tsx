import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './router';

function renderRoute(initialRoute: string) {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
  });
  return render(<RouterProvider router={router} />);
}

describe('Router', () => {
  it('renders the Home page on /', () => {
    renderRoute('/');
    expect(screen.getByText('ReTiCh')).toBeInTheDocument();
  });

  it('renders the Login page on /login', () => {
    renderRoute('/login');
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders the Register page on /register', () => {
    renderRoute('/register');
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('renders the Chat page on /chat', () => {
    renderRoute('/chat');
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('renders the Settings page on /settings', () => {
    renderRoute('/settings');
    expect(screen.getAllByText('Settings').length).toBeGreaterThanOrEqual(1);
  });
});
