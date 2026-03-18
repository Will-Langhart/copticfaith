import { useTranslation } from 'react-i18next';

export default function SectionNav({ sections, currentIndex, onSelect }) {
  const { t } = useTranslation();
  const prev = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const next = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className="section-nav" aria-label="Section navigation">
      {prev ? (
        <button
          className="section-nav__btn section-nav__btn--prev"
          onClick={() => onSelect(prev.id)}
        >
          {t('section_nav.prev', { title: prev.title })}
        </button>
      ) : <span />}
      {next ? (
        <button
          className="section-nav__btn section-nav__btn--next"
          onClick={() => onSelect(next.id)}
        >
          {t('section_nav.next', { title: next.title })}
        </button>
      ) : <span />}
    </nav>
  );
}
