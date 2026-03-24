import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export default function PageShell({ children, title }) {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();

  return (
    <div className="page-shell">
      <header className="page-shell__header header header--visible" role="banner">
        <Link to="/" className="header__logo" aria-label={t('site_title')}>
          <span className="header__logo-svg" aria-hidden>
            <img src="/logo.png" alt="" width="32" height="32" />
          </span>
          <span className="header__logo-text">{t('site_title')}</span>
        </Link>

        <nav className="page-shell__nav" aria-label="Site navigation">
          <Link to="/sacraments" className="page-shell__nav-link page-shell__nav-link--highlight">The Seven Mysteries</Link>
          <span className="page-shell__nav-divider" aria-hidden="true" />
          <Link to="/baptism" className="page-shell__nav-link">Baptism</Link>
          <Link to="/chrismation" className="page-shell__nav-link">Chrismation</Link>
          <Link to="/confession" className="page-shell__nav-link">Confession</Link>
          <Link to="/unction" className="page-shell__nav-link">Unction</Link>
          <Link to="/matrimony" className="page-shell__nav-link">Matrimony</Link>
          <Link to="/holy-orders" className="page-shell__nav-link">Holy Orders</Link>
          <span className="page-shell__nav-divider" aria-hidden="true" />
          <Link to="/salvation" className="page-shell__nav-link">Salvation</Link>
          <Link to="/fathers" className="page-shell__nav-link page-shell__nav-link--fathers">The Fathers</Link>
          <Link to="/reading-list" className="page-shell__nav-link">{t('header.reading_list')}</Link>
          <Link to="/faq" className="page-shell__nav-link">{t('header.faq')}</Link>
          <Link to="/glossary" className="page-shell__nav-link">{t('header.glossary')}</Link>
          <Link to="/scripture-index" className="page-shell__nav-link">{t('header.scripture_index')}</Link>
          <Link to="/contact" className="page-shell__nav-link">{t('header.contact')}</Link>
        </nav>

        <button
          className="dark-toggle header__icon-btn"
          onClick={toggle}
          aria-label={t('theme.toggle')}
          title={t(theme === 'dark' ? 'theme.light' : 'theme.dark')}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>

      <main className="page-shell__main">
        {title && <div className="page-hero"><h1 className="page-hero__title">{title}</h1></div>}
        {children}
      </main>

      <footer className="page-shell__footer">
        <p>{t('footer.text')}</p>
        <Link to="/">{t('footer.home')}</Link>
      </footer>
    </div>
  );
}
