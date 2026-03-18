import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell';
import { GLOSSARY, GLOSSARY_CATEGORIES } from '../data/glossary';

export default function GlossaryPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = GLOSSARY.filter(e => {
    const matchesCat = category === 'All' || e.category === category;
    const matchesFilter = !filter || e.term.toLowerCase().includes(filter.toLowerCase()) || e.definition.toLowerCase().includes(filter.toLowerCase());
    return matchesCat && matchesFilter;
  });

  // Group by first letter
  const grouped = filtered.reduce((acc, entry) => {
    const letter = entry.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(entry);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort();

  return (
    <PageShell>
      <div className="page-content">
        <div className="page-content__header">
          <h1>{t('pages.glossary.title')}</h1>
          <p className="page-content__subtitle">{t('pages.glossary.subtitle')}</p>
        </div>

        <div className="glossary-controls">
          <input
            className="glossary-filter"
            type="search"
            placeholder={t('pages.glossary.search_placeholder')}
            value={filter}
            onChange={e => setFilter(e.target.value)}
            aria-label={t('pages.glossary.search_placeholder')}
          />
          <div className="glossary-cats" role="group" aria-label="Filter by category">
            {['All', ...GLOSSARY_CATEGORIES].map(cat => (
              <button
                key={cat}
                className={`glossary-cat-btn ${category === cat ? 'glossary-cat-btn--active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {letters.length === 0 && (
          <p className="glossary-empty">No terms match your search.</p>
        )}

        {letters.map(letter => (
          <div key={letter} className="glossary-group">
            <h2 className="glossary-group__letter">{letter}</h2>
            <dl className="glossary-list">
              {grouped[letter].map(entry => (
                <div key={entry.term} className="glossary-entry" id={`term-${entry.term.toLowerCase().replace(/\s+/g, '-')}`}>
                  <dt className="glossary-entry__term">
                    {entry.term}
                    {entry.pronunciation && <span className="glossary-entry__pronunciation"> /{entry.pronunciation}/</span>}
                    {entry.ar && <span className="glossary-entry__ar" lang="ar" dir="rtl"> — {entry.ar}</span>}
                    <span className="glossary-entry__cat">{entry.category}</span>
                  </dt>
                  <dd className="glossary-entry__def">{entry.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
