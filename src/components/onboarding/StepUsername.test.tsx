import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import en from '../../i18n/locales/en.json';

const t = (key: keyof typeof en, opts?: Record<string, unknown>): string => {
  const raw = en[key] ?? key;
  if (!opts) return raw;
  return raw.replace(/\{\{(\w+)\}\}/g, (_, k: string) =>
    opts[k] !== undefined ? String(opts[k]) : `{{${k}}}`,
  );
};

import { checkUsernameAvailability } from '../../api/users';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import StepUsername from './StepUsername';

vi.mock('../../api/users', () => ({
  checkUsernameAvailability: vi.fn(),
}));

const mockedCheck = vi.mocked(checkUsernameAvailability);

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  useOnboardingStore.getState().setField('username', '');
  mockedCheck.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('StepUsername', () => {
  it('shows available message when API returns available: true', async () => {
    mockedCheck.mockResolvedValue({ available: true });
    const onNext = vi.fn();
    render(<StepUsername onNext={onNext} />);

    const input = screen.getByPlaceholderText(
      t('onboarding.username.placeholder'),
    );
    await userEvent.type(input, 'valid_user');

    // Advance past debounce
    vi.advanceTimersByTime(600);

    await waitFor(() => {
      expect(
        screen.getByText(
          t('onboarding.username.available', { username: 'valid_user' }),
        ),
      ).toBeInTheDocument();
    });

    expect(mockedCheck).toHaveBeenCalledWith('valid_user');
  });

  it('shows taken message when API returns available: false', async () => {
    mockedCheck.mockResolvedValue({ available: false });
    const onNext = vi.fn();
    render(<StepUsername onNext={onNext} />);

    const input = screen.getByPlaceholderText(
      t('onboarding.username.placeholder'),
    );
    await userEvent.type(input, 'taken_user');

    vi.advanceTimersByTime(600);

    await waitFor(() => {
      expect(
        screen.getByText(
          t('onboarding.username.taken', { username: 'taken_user' }),
        ),
      ).toBeInTheDocument();
    });
  });

  it('does not call API when username is invalid', async () => {
    const onNext = vi.fn();
    render(<StepUsername onNext={onNext} />);

    const input = screen.getByPlaceholderText(
      t('onboarding.username.placeholder'),
    );
    await userEvent.type(input, 'ab');

    vi.advanceTimersByTime(600);

    expect(mockedCheck).not.toHaveBeenCalled();
  });

  it('debounces the API call', async () => {
    mockedCheck.mockResolvedValue({ available: true });
    const onNext = vi.fn();
    render(<StepUsername onNext={onNext} />);

    const input = screen.getByPlaceholderText(
      t('onboarding.username.placeholder'),
    );
    await userEvent.type(input, 'abc');

    // Not enough time elapsed — should not have been called yet
    vi.advanceTimersByTime(200);
    expect(mockedCheck).not.toHaveBeenCalled();

    // Now advance past debounce
    vi.advanceTimersByTime(400);

    await waitFor(() => {
      expect(mockedCheck).toHaveBeenCalledTimes(1);
    });
  });

  it('disables submit button when username is taken', async () => {
    mockedCheck.mockResolvedValue({ available: false });
    const onNext = vi.fn();
    render(<StepUsername onNext={onNext} />);

    const input = screen.getByPlaceholderText(
      t('onboarding.username.placeholder'),
    );
    await userEvent.type(input, 'taken_user');

    vi.advanceTimersByTime(600);

    await waitFor(() => {
      expect(
        screen.getByText(
          t('onboarding.username.taken', { username: 'taken_user' }),
        ),
      ).toBeInTheDocument();
    });

    const button = screen.getByRole('button', {
      name: t('onboarding.continue'),
    });
    expect(button).toBeDisabled();
  });

  it('enables submit and calls onNext when username is available', async () => {
    mockedCheck.mockResolvedValue({ available: true });
    const onNext = vi.fn();
    render(<StepUsername onNext={onNext} />);

    const input = screen.getByPlaceholderText(
      t('onboarding.username.placeholder'),
    );
    await userEvent.type(input, 'good_name');

    vi.advanceTimersByTime(600);

    await waitFor(() => {
      expect(
        screen.getByText(
          t('onboarding.username.available', { username: 'good_name' }),
        ),
      ).toBeInTheDocument();
    });

    const button = screen.getByRole('button', {
      name: t('onboarding.continue'),
    });
    expect(button).not.toBeDisabled();
    await userEvent.click(button);
    expect(onNext).toHaveBeenCalled();
  });
});
