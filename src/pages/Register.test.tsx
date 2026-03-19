import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

describe('Register', () => {
  it('renders the register heading', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    expect(screen.getByText('Créez votre compte')).toBeInTheDocument();
  });
});
