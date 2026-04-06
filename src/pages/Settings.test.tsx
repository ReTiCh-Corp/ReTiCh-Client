import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import en from '../i18n/locales/en.json';

const t = (key: keyof typeof en) => en[key];

import Settings from './Settings';

describe('Settings', () => {
  it('renders the settings heading', () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>,
    );
    expect(screen.getByText(t('settings.title'))).toBeInTheDocument();
  });
});
