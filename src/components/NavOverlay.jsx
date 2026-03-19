import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NavOverlay({ isOpen, sections, activeId, onClose, onSelect }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="nav-overlay" role="dialog" aria-modal="true" aria-label="Section navigation">
      <button
        className="nav-overlay__close"
        onClick={onClose}
        aria-label={t('nav.close_menu')}
      >
        ×
      </button>
      <nav className="nav-overlay__nav">
        {sections.map(({ id, title, readingMinutes }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`nav-overlay__link ${activeId === id ? 'nav-overlay__link--active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onSelect(id);
            }}
          >
            <span className="nav-overlay__title">{title}</span>
            {readingMinutes > 0 && (
              <span className="nav-overlay__time">{t('toc.reading_time', { min: readingMinutes })}</span>
            )}
          </a>
        ))}
      </nav>

      <div className="nav-overlay__pages">
        <p className="nav-overlay__section-label">The Seven Holy Mysteries</p>
        <Link to="/sacraments" onClick={onClose} className="nav-overlay__page-link nav-overlay__page-link--highlight">All Seven Mysteries (Overview)</Link>
        <Link to="/baptism" onClick={onClose} className="nav-overlay__page-link">I. Holy Baptism</Link>
        <Link to="/chrismation" onClick={onClose} className="nav-overlay__page-link">II. Chrismation (Myron)</Link>
        <Link to="/confession" onClick={onClose} className="nav-overlay__page-link">III. Repentance &amp; Confession</Link>
        <Link to="/unction" onClick={onClose} className="nav-overlay__page-link">V. Unction of the Sick</Link>
        <Link to="/matrimony" onClick={onClose} className="nav-overlay__page-link">VI. Holy Matrimony</Link>
        <Link to="/holy-orders" onClick={onClose} className="nav-overlay__page-link">VII. Holy Orders</Link>
        <p className="nav-overlay__section-label">Deep Dives</p>
        <Link to="/salvation" onClick={onClose} className="nav-overlay__page-link">Salvation</Link>
        <Link to="/reading-list" onClick={onClose} className="nav-overlay__page-link">{t('header.reading_list')}</Link>
        <Link to="/faq" onClick={onClose} className="nav-overlay__page-link">{t('header.faq')}</Link>
        <Link to="/glossary" onClick={onClose} className="nav-overlay__page-link">{t('header.glossary')}</Link>
        <Link to="/scripture-index" onClick={onClose} className="nav-overlay__page-link">{t('header.scripture_index')}</Link>
        <Link to="/contact" onClick={onClose} className="nav-overlay__page-link">{t('header.contact')}</Link>
      </div>
    </div>
  );
}
