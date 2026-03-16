import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
  it('renders the app name and description', () => {
    render(<Home />);
    expect(screen.getByText('ReTiCh')).toBeInTheDocument();
    expect(screen.getByText('Real-Time Chat Application')).toBeInTheDocument();
  });
});
