import { useAuthStore } from './useAuthStore';

const mockUser = {
  id: '1',
  email: 'test@test.com',
  username: 'testuser',
  onboarding: true,
};

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
  });
});

describe('useAuthStore', () => {
  it('has correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  it('setTokens updates access and refresh tokens', () => {
    useAuthStore.getState().setTokens('access-123', 'refresh-456');
    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('access-123');
    expect(state.refreshToken).toBe('refresh-456');
  });

  it('setUser updates the user', () => {
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('logout clears user and tokens', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setTokens('access', 'refresh');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });
});
