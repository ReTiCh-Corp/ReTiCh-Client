import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

describe('Login', () => {
  it('renders the login heading', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    expect(screen.getByText('Bon retour !')).toBeInTheDocument();
  });
});
