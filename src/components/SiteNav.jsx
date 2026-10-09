import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** Page navigation shared by the home Header and PageShell. */
export default function SiteNav() {
  const { t } = useTranslation();

  return (
    <nav className="page-shell__nav" aria-label="Site navigation">
      <div className="header__dropdown-wrapper">
        <Link to="/sacraments" className="page-shell__nav-link page-shell__nav-link--highlight">The Seven Mysteries ▾</Link>
        <ul className="header__dropdown">
          <li><Link to="/baptism" className="header__dropdown-link">I. Baptism</Link></li>
          <li><Link to="/chrismation" className="header__dropdown-link">II. Chrismation</Link></li>
          <li><Link to="/confession" className="header__dropdown-link">III. Confession</Link></li>
          <li><Link to="/eucharist" className="header__dropdown-link">IV. Eucharist</Link></li>
          <li><Link to="/unction" className="header__dropdown-link">V. Unction of the Sick</Link></li>
          <li><Link to="/matrimony" className="header__dropdown-link">VI. Matrimony</Link></li>
          <li><Link to="/holy-orders" className="header__dropdown-link">VII. Holy Orders</Link></li>
        </ul>
      </div>
      <span className="page-shell__nav-divider" aria-hidden="true" />
      <Link to="/daily-readings" className="page-shell__nav-link">Daily Readings</Link>
      <Link to="/saints-calendar" className="page-shell__nav-link">Saints</Link>
      <Link to="/salvation" className="page-shell__nav-link">Salvation</Link>
      <Link to="/church-history" className="page-shell__nav-link">Church History</Link>
      <Link to="/fathers" className="page-shell__nav-link page-shell__nav-link--fathers">The Fathers</Link>
      <Link to="/intercession-of-saints" className="page-shell__nav-link">Intercession of the Saints</Link>
      <Link to="/books" className="page-shell__nav-link">Books</Link>
      <div className="header__dropdown-wrapper">
        <button type="button" className="page-shell__nav-link page-shell__nav-more">More ▾</button>
        <ul className="header__dropdown">
          <li><Link to="/reading-list" className="header__dropdown-link">{t('header.reading_list')}</Link></li>
          <li><Link to="/faq" className="header__dropdown-link">{t('header.faq')}</Link></li>
          <li><Link to="/glossary" className="header__dropdown-link">{t('header.glossary')}</Link></li>
          <li><Link to="/scripture-index" className="header__dropdown-link">{t('header.scripture_index')}</Link></li>
          <li><Link to="/contact" className="header__dropdown-link">{t('header.contact')}</Link></li>
        </ul>
      </div>
    </nav>
  );
}
