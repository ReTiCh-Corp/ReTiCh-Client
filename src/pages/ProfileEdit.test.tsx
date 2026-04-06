vi.mock('@retish/auth', () => ({
  ReTiChAuth: class {
    getAccessToken = vi.fn().mockResolvedValue(null);
  },
}));

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import en from '../i18n/locales/en.json';

const t = (key: keyof typeof en) => en[key];

vi.mock('../hooks/useProfile', () => ({
  useMyProfile: () => ({ data: null, isLoading: false, isError: true }),
  useUpdateMyProfile: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

import ProfileEdit from './ProfileEdit';

describe('ProfileEdit', () => {
  it('renders error state when profile fails to load', () => {
    render(
      <MemoryRouter>
        <ProfileEdit />
      </MemoryRouter>,
    );
    expect(screen.getByText(t('profile.loadError'))).toBeInTheDocument();
    expect(screen.getByText(t('profile.backToProfile'))).toBeInTheDocument();
  });

  it('exports a valid component', () => {
    expect(typeof ProfileEdit).toBe('function');
  });
});
