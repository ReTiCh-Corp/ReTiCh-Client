import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import en from './i18n/locales/en.json';
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

vi.mock('./stores/useAuthStore', () => {
  const store = vi.fn((selector?: (s: unknown) => unknown) =>
    selector ? selector(mockAuthState) : mockAuthState,
  );
  (store as unknown as Record<string, unknown>).getState = vi.fn(
    () => mockAuthState,
  );
  (store as unknown as Record<string, unknown>).subscribe = vi.fn(() =>
    vi.fn(),
  );
  return { useAuthStore: store };
});

vi.mock('./hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

vi.mock('./hooks/useWebSocket', () => ({
  useWebSocket: () => ({
    status: 'connected',
    sendEvent: vi.fn(),
    disconnect: vi.fn(),
  }),
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
    expect(screen.getByText(en['login.welcome'])).toBeInTheDocument();
  });

  it('renders the Chat page on /chat', () => {
    renderRoute('/chat');
    expect(screen.getByText(en['chat.messages'])).toBeInTheDocument();
  });

  it('renders the Settings page on /settings', () => {
    renderRoute('/settings');
    expect(
      screen.getAllByText(en['settings.title']).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
