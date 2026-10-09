import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import AskAFather from './AskAFather';
import FastBadge from './FastBadge';
import NavOverlay from './NavOverlay';
import SiteNav from './SiteNav';

export default function PageShell({ children, title }) {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="page-shell">
      <header className="page-shell__header header header--visible" role="banner">
        <Link to="/" className="header__logo" aria-label={t('site_title')}>
          <span className="header__logo-svg" aria-hidden>
            <img src="/logo-128.png" alt="" width="32" height="32" />
          </span>
          <span className="header__logo-text">{t('site_title')}</span>
        </Link>

        <SiteNav />

        <FastBadge />

        <button
          className="dark-toggle header__icon-btn"
          onClick={toggle}
          aria-label={t('theme.toggle')}
          title={t(theme === 'dark' ? 'theme.light' : 'theme.dark')}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>

        <button
          className="header__menu-btn"
          onClick={() => setMenuOpen(true)}
          aria-label={t('nav.open_menu')}
        >
          <span className="header__menu-icon" />
          <span className="header__menu-icon" />
          <span className="header__menu-icon" />
        </button>
      </header>

      <NavOverlay isOpen={menuOpen} sections={[]} onClose={() => setMenuOpen(false)} />

      <main className="page-shell__main">
        {title && <div className="page-hero"><h1 className="page-hero__title">{title}</h1></div>}
        {children}
      </main>

      <footer className="page-shell__footer">
        <p>{t('footer.text')}</p>
        <Link to="/">{t('footer.home')}</Link>
      </footer>

      <AskAFather />
    </div>
  );
}
