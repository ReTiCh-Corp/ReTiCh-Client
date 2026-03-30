import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import i18n from './i18n';
import { routes } from './router';

vi.mock('@retish/auth', () => ({
  ReTiChAuth: class {
    constructor() {}
  },
}));

vi.mock('@retish/auth/react', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
    user: null,
    isAuthenticated: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('./hooks/useConversations', () => ({
  useConversations: () => ({
    data: { data: [] },
    isLoading: false,
    error: null,
  }),
  useConversation: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
  useLeaveConversation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useRemoveParticipant: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

const mockAuthState = {
  user: {
    id: 'user-1',
    email: 'me@test.com',
    username: 'me',
    onboarding: true,
  },
  accessToken: 'fake-token',
  refreshToken: 'fake-refresh',
  setTokens: vi.fn(),
  setUser: vi.fn(),
  completeOnboarding: vi.fn(),
  logout: vi.fn(),
};

vi.mock('./stores/useAuthStore', () => ({
  useAuthStore: vi.fn((selector?: (s: unknown) => unknown) =>
    selector ? selector(mockAuthState) : mockAuthState,
  ),
}));

vi.mock('./hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

function renderRoute(initialRoute: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('Router', () => {
  it('renders the Login page on /login', () => {
    renderRoute('/login');
    expect(screen.getByText(i18n.t('login.welcome'))).toBeInTheDocument();
  });

  it('renders the Chat page on /chat', () => {
    renderRoute('/chat');
    expect(screen.getByText(i18n.t('chat.messages'))).toBeInTheDocument();
  });

  it('renders the Settings page on /settings', () => {
    renderRoute('/settings');
    expect(screen.getAllByText(i18n.t('settings.title')).length).toBeGreaterThanOrEqual(1);
  });
});
