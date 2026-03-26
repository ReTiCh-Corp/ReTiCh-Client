import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockData = {
  id: 'user-1',
  username: 'alice',
  display_name: 'Alice Dupont',
  avatar_url: null,
  bio: 'Hello world',
  status: 'online',
  custom_status: 'Working',
  first_name: 'Alice',
  last_name: 'Dupont',
  gender: 'female',
  phone: '+33 6 12 34 56 78',
  last_seen_at: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

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
    expect(screen.getByText('Impossible de charger le profil.')).toBeInTheDocument();
    expect(screen.getByText('Retour au profil')).toBeInTheDocument();
  });

  it('exports a valid component', () => {
    expect(typeof ProfileEdit).toBe('function');
  });
});
