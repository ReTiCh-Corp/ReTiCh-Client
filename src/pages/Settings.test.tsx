import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../i18n';
import Settings from './Settings';

describe('Settings', () => {
  it('renders the settings heading', () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>,
    );
    expect(screen.getByText(i18n.t('settings.title'))).toBeInTheDocument();
  });
});
