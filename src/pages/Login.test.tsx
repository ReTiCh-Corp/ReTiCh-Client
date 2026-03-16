import { render, screen } from '@testing-library/react';
import Login from './Login';

describe('Login', () => {
  it('renders the login heading', () => {
    render(<Login />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
