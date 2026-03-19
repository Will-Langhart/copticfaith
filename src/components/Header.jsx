import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { SHORT_LABELS } from '../data/sectionMeta';
import i18n from '../i18n/index';

export default function Header({ visible, sections = [], activeId, onNavigateClick, onSelect, onSearchClick, onTocClick }) {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();

  const handleNavClick = (e, id) => {
    e.preventDefault();
    onSelect?.(id);
  };

  const toggleLang = () => {
    const next = i18n.language?.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };

  return (
    <header
      className={`header ${visible ? 'header--visible' : ''}`}
      role="banner"
    >
      <a
        href="#hero"
        className="header__logo"
        onClick={(e) => handleNavClick(e, 'hero')}
        aria-label={`${t('site_title')} – ${t('hero.begin')}`}
      >
        <span className="header__logo-svg" aria-hidden>
          <img src="/logo.png" alt="" width="32" height="32" />
        </span>
        <span className="header__logo-text">{t('site_title')}</span>
      </a>

      <nav className="header__nav" aria-label="Section navigation">
        <ul className="header__nav-list">
          {sections.map(({ id, title }) => (
            <li key={id} className="header__nav-item">
              <a
                href={`#${id}`}
                className={`header__nav-link ${activeId === id ? 'header__nav-link--active' : ''}`}
                onClick={(e) => handleNavClick(e, id)}
                title={title}
              >
                {t(`nav.${id}`, { defaultValue: SHORT_LABELS[id] ?? title })}
              </a>
            </li>
          ))}
          <li className="header__nav-item header__nav-item--divider" aria-hidden="true" />
          <li className="header__nav-item">
            <Link to="/baptism" className="header__nav-link header__nav-link--page">Baptism</Link>
          </li>
          <li className="header__nav-item">
            <Link to="/salvation" className="header__nav-link header__nav-link--page">Salvation</Link>
          </li>
        </ul>
      </nav>

      <div className="header__actions">
        {/* Search button */}
        <button
          className="header__icon-btn"
          onClick={onSearchClick}
          aria-label={t('header.search')}
          title={`${t('header.search')} (⌘K)`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        {/* Table of Contents button */}
        <button
          className="header__icon-btn"
          onClick={onTocClick}
          aria-label={t('header.toc')}
          title={t('header.toc')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>

        {/* More pages dropdown links */}
        <nav className="header__pages-nav" aria-label="Additional pages">
          <Link to="/reading-list" className="header__page-link">{t('header.reading_list')}</Link>
          <Link to="/faq" className="header__page-link">{t('header.faq')}</Link>
          <Link to="/glossary" className="header__page-link">{t('header.glossary')}</Link>
          <Link to="/contact" className="header__page-link">{t('header.contact')}</Link>
        </nav>

        {/* Dark/light toggle */}
        <button
          className="header__icon-btn dark-toggle"
          onClick={toggle}
          aria-label={t('theme.toggle')}
          title={t(theme === 'dark' ? 'theme.light' : 'theme.dark')}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* Language toggle */}
        <button
          className="header__icon-btn lang-toggle"
          onClick={toggleLang}
          aria-label={t('lang.toggle')}
          title={t('lang.toggle')}
        >
          {i18n.language?.startsWith('ar') ? t('lang.en') : t('lang.ar')}
        </button>

        {/* Hamburger */}
        <button
          className="header__menu-btn"
          onClick={onNavigateClick}
          aria-label={t('nav.open_menu')}
        >
          <span className="header__menu-icon" />
          <span className="header__menu-icon" />
          <span className="header__menu-icon" />
        </button>
      </div>
    </header>
  );
}
