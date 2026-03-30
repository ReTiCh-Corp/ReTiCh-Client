import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../i18n';

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
    expect(screen.getByText(i18n.t('profile.loadError'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('profile.backToProfile'))).toBeInTheDocument();
  });

  it('exports a valid component', () => {
    expect(typeof ProfileEdit).toBe('function');
  });
});
