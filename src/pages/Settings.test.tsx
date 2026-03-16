import { render, screen } from '@testing-library/react';
import Settings from './Settings';

describe('Settings', () => {
  it('renders the settings heading', () => {
    render(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
