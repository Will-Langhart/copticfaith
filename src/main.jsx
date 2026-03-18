import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext';
import i18n from './i18n/index';
import { router } from './router/routes';
import './index.css';
import './styles/themes.css';
import './styles/print.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>,
);
