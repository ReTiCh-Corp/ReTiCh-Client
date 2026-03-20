import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

describe('Register', () => {
  it('redirects to /login', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/register']}>
        <Register />
      </MemoryRouter>,
    );
    expect(container.innerHTML).toBe('');
  });
});
