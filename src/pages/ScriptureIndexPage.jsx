import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell';
import { SCRIPTURE_INDEX, SCRIPTURE_BOOKS } from '../data/scriptureIndex';

export default function ScriptureIndexPage() {
  const { t } = useTranslation();
  const [activeBook, setActiveBook] = useState(null);

  const visibleBooks = activeBook ? [activeBook] : SCRIPTURE_BOOKS;

  return (
    <PageShell>
      <div className="page-content">
        <div className="page-content__header">
          <h1>{t('pages.scripture_index.title')}</h1>
          <p className="page-content__subtitle">{t('pages.scripture_index.subtitle')}</p>
        </div>

        <div className="scripture-book-nav" aria-label={t('pages.scripture_index.books_label')}>
          <button
            className={`scripture-book-btn ${!activeBook ? 'scripture-book-btn--active' : ''}`}
            onClick={() => setActiveBook(null)}
          >
            All Books
          </button>
          {SCRIPTURE_BOOKS.map(book => (
            <button
              key={book}
              className={`scripture-book-btn ${activeBook === book ? 'scripture-book-btn--active' : ''}`}
              onClick={() => setActiveBook(book === activeBook ? null : book)}
            >
              {book}
            </button>
          ))}
        </div>

        <div className="scripture-index-list">
          {visibleBooks.map(book => (
            <div key={book} className="scripture-book-group">
              <h2 className="scripture-book-group__title">{book}</h2>
              <ul className="scripture-ref-list">
                {SCRIPTURE_INDEX[book].map(entry => (
                  <li key={entry.ref} className="scripture-ref-item">
                    <div className="scripture-ref-item__ref">
                      <blockquote className="scripture-block" style={{ margin: 0 }}>
                        <span className="ref">{entry.ref}</span>
                        {entry.text}
                      </blockquote>
                    </div>
                    <div className="scripture-ref-item__section">
                      <Link to={`/#${entry.sectionId}`}>
                        → {entry.sectionTitle}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
