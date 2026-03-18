import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import SEARCH_DATA from '../data/searchData';

let fuseInstance = null;
let fusePromise = null;

async function getFuse() {
  if (fuseInstance) return fuseInstance;
  if (!fusePromise) {
    fusePromise = import('fuse.js').then(({ default: Fuse }) => {
      fuseInstance = new Fuse(SEARCH_DATA, {
        keys: [
          { name: 'heading', weight: 3 },
          { name: 'text', weight: 2 },
          { name: 'sectionTitle', weight: 1 },
        ],
        threshold: 0.35,
        includeMatches: true,
        minMatchCharLength: 2,
      });
      return fuseInstance;
    });
  }
  return fusePromise;
}

function highlight(text, indices) {
  if (!indices?.length) return text;
  let result = '';
  let last = 0;
  for (const [start, end] of indices) {
    result += text.slice(last, start);
    result += `<mark>${text.slice(start, end + 1)}</mark>`;
    last = end + 1;
  }
  result += text.slice(last);
  return result;
}

export default function SearchModal({ isOpen, onClose, onNavigate }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
      // Pre-load Fuse
      getFuse();
    }
  }, [isOpen]);

  // Keyboard shortcut Cmd+K / Ctrl+K — handled in App
  useEffect(() => {
    if (!isOpen) return;
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [isOpen, onClose]);

  const search = useCallback(async (q) => {
    if (q.trim().length < 2) { setResults([]); return; }
    const fuse = await getFuse();
    setResults(fuse.search(q, { limit: 20 }));
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 150);
  };

  if (!isOpen) return null;

  const typeBadge = (type) => ({
    scripture: t('search.type_scripture'),
    father: t('search.type_father'),
    body: t('search.type_body'),
    note: t('search.type_note'),
  }[type] || type);

  return (
    <div className="search-modal" role="dialog" aria-modal="true" aria-label={t('header.search')}>
      <div className="search-modal__backdrop" onClick={onClose} />
      <div className="search-modal__box">
        <div className="search-modal__header">
          <input
            ref={inputRef}
            className="search-modal__input"
            type="search"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={handleChange}
            aria-label={t('header.search')}
          />
          <button className="search-modal__close" onClick={onClose} aria-label={t('nav.close_menu')}>×</button>
        </div>

        <div className="search-modal__hint">{t('search.hint')}</div>

        {query.trim().length >= 2 && results.length === 0 && (
          <p className="search-modal__empty">{t('search.no_results', { query: query.trim() })}</p>
        )}

        {results.length > 0 && (
          <ul className="search-results" role="listbox">
            {results.map(({ item, matches }) => {
              const textMatch = matches?.find(m => m.key === 'text');
              const headingMatch = matches?.find(m => m.key === 'heading');
              const displayText = textMatch
                ? highlight(item.text, textMatch.indices).slice(0, 200) + '…'
                : item.text.slice(0, 200) + '…';
              const displayHeading = headingMatch
                ? highlight(item.heading, headingMatch.indices)
                : item.heading;

              return (
                <li
                  key={item.id}
                  className="search-result"
                  role="option"
                  aria-selected={false}
                >
                  <button
                    className="search-result__btn"
                    onClick={() => { onClose(); onNavigate(item.sectionId); }}
                  >
                    <div className="search-result__meta">
                      <span className={`search-result__badge search-result__badge--${item.type}`}>{typeBadge(item.type)}</span>
                      <span className="search-result__section">{item.sectionTitle}</span>
                    </div>
                    <div className="search-result__heading" dangerouslySetInnerHTML={{ __html: displayHeading }} />
                    <div className="search-result__text" dangerouslySetInnerHTML={{ __html: displayText }} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
