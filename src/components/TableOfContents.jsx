import { useTranslation } from 'react-i18next';
import { TOTAL_READING_MINUTES } from '../data/sectionMeta';

export default function TableOfContents({ isOpen, sections, activeId, onClose, onSelect }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="toc-overlay" role="dialog" aria-modal="true" aria-label={t('toc.title')}>
      <button className="toc-overlay__close" onClick={onClose} aria-label={t('nav.close_menu')}>×</button>
      <div className="toc-overlay__inner">
        <h2 className="toc-overlay__title">
          {t('toc.title')}
          <span className="toc-overlay__total">{t('toc.total', { min: TOTAL_READING_MINUTES })}</span>
        </h2>
        <ol className="toc-list">
          {sections.map((s, i) => (
            <li key={s.id} className={`toc-list__item ${activeId === s.id ? 'toc-list__item--active' : ''}`}>
              <button
                className="toc-list__btn"
                onClick={() => { onClose(); onSelect(s.id); }}
              >
                <span className="toc-list__num">{i + 1}</span>
                <span className="toc-list__title">{s.title}</span>
                <span className="toc-list__time">{t('toc.reading_time', { min: s.readingMinutes })}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
