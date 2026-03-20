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
    expect(container.innerHTML).toBe('');
  });
});
