import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactDetails from './ContactDetails';

describe('ContactDetails', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders nothing when name is null', () => {
    const { container } = render(
      <ContactDetails name={null} onClose={onClose} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders contact name and initials', () => {
    render(<ContactDetails name="Samantha Smith" onClose={onClose} />);
    expect(screen.getByText('Samantha Smith')).toBeInTheDocument();
    expect(screen.getByText('SS')).toBeInTheDocument();
  });

  it('renders contact info section', () => {
    render(<ContactDetails name="Samantha Smith" onClose={onClose} />);
    expect(screen.getByText('Contact Info')).toBeInTheDocument();
    expect(screen.getByText('+48 943 333 123')).toBeInTheDocument();
    expect(screen.getByText('user@retich.app')).toBeInTheDocument();
  });

  it('renders shared media and files sections', () => {
    render(<ContactDetails name="Samantha Smith" onClose={onClose} />);
    expect(screen.getByText('Shared Media')).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Timeschedule_2024')).toBeInTheDocument();
    expect(screen.getByText('Design System article...')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ContactDetails name="Samantha Smith" onClose={onClose} />);

    const closeButton = screen
      .getByText('Details')
      .closest('div')
      ?.querySelector('button');
    expect(closeButton).toBeTruthy();
    await user.click(closeButton as HTMLButtonElement);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
