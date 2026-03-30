import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../i18n';
import Login from './Login';

vi.mock('@retish/auth/react', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
    user: null,
    isAuthenticated: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Login', () => {
  it('renders the login heading', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    expect(screen.getByText(i18n.t('login.welcome'))).toBeInTheDocument();
  });
});
