import { render, screen } from '@testing-library/react';
import Profile from './Profile';

describe('Profile', () => {
  it('renders the user name', () => {
    render(<Profile />);
    expect(screen.getByText('Lucas Rimbault')).toBeInTheDocument();
  });

  it('renders the user email', () => {
    render(<Profile />);
    expect(screen.getByText('lucas@retich.app')).toBeInTheDocument();
  });

  it('renders the avatar initials', () => {
    render(<Profile />);
    expect(screen.getByText('LR')).toBeInTheDocument();
  });

  it('renders phone, status and member since info cards', () => {
    render(<Profile />);
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('+33 6 12 34 56 78')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Sky is the limit')).toBeInTheDocument();
    expect(screen.getByText('Member since')).toBeInTheDocument();
    expect(screen.getByText('March 2026')).toBeInTheDocument();
  });
});
