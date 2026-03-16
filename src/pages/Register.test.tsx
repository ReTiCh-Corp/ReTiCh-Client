import { render, screen } from '@testing-library/react';
import Register from './Register';

describe('Register', () => {
  it('renders the register heading', () => {
    render(<Register />);
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});
