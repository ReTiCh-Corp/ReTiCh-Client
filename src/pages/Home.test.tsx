import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

describe('Home', () => {
  it('redirects to /chat', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Home />
      </MemoryRouter>,
    );
    // Home renders a <Navigate to="/chat" replace />, so the container should be empty
    expect(container.innerHTML).toBe('');
  });
});
