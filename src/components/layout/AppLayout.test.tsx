import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './AppLayout';

function renderWithRouter() {
  const router = createMemoryRouter(
    [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/test',
            element: <div>Test Child</div>,
          },
        ],
      },
    ],
    { initialEntries: ['/test'] },
  );
  return render(<RouterProvider router={router} />);
}

describe('AppLayout', () => {
  it('renders the sidebar', () => {
    renderWithRouter();
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('renders child routes via Outlet', () => {
    renderWithRouter();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
