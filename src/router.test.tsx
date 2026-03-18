import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './router';

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
