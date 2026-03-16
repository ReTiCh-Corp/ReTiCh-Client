import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('ReTiCh')).toBeInTheDocument();
  });

  it('renders the app description', () => {
    render(<App />);
    expect(screen.getByText('Real-Time Chat Application')).toBeInTheDocument();
  });
});
