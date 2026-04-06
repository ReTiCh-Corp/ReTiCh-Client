import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import en from '../i18n/locales/en.json';

const t = (key: keyof typeof en) => en[key];

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
    expect(screen.getByText(t('login.welcome'))).toBeInTheDocument();
  });
});
