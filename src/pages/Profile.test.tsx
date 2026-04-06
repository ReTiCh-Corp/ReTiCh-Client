import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import en from '../i18n/locales/en.json';

const t = (key: keyof typeof en) => en[key];

import Profile from './Profile';

vi.mock('../hooks/useProfile', () => ({
  useMyProfile: () => ({
    data: {
      id: '1',
      username: 'lucas',
      first_name: 'Lucas',
      last_name: 'Rimbault',
      display_name: 'Lucas Rimbault',
      avatar_url: null,
      bio: null,
      phone: '+33 6 12 34 56 78',
      gender: null,
      status: 'online',
      custom_status: 'Sky is the limit',
      created_at: '2026-03-01T00:00:00Z',
    },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('../stores/useAuthStore', () => ({
  useAuthStore: vi.fn((selector: (s: unknown) => unknown) =>
    selector({ user: { id: '1', email: 'lucas@retich.app' } }),
  ),
}));

describe('Profile', () => {
  it('renders the user name', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );
    expect(screen.getByText('Lucas Rimbault')).toBeInTheDocument();
  });

  it('renders the user email', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );
    expect(screen.getByText('lucas@retich.app')).toBeInTheDocument();
  });

  it('renders the avatar initials', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );
    expect(screen.getByText('LR')).toBeInTheDocument();
  });

  it('renders phone, status and member since info cards', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    );
    expect(screen.getByText(t('profile.phone'))).toBeInTheDocument();
    expect(screen.getByText('+33 6 12 34 56 78')).toBeInTheDocument();
    expect(screen.getByText(t('profile.status'))).toBeInTheDocument();
    expect(screen.getByText('Sky is the limit')).toBeInTheDocument();
    expect(screen.getByText(t('profile.memberSince'))).toBeInTheDocument();
  });
});
