import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell';
import { READING_LIST } from '../data/readingList';

function BookCard({ book }) {
  return (
    <div className="book-card">
      <div className="book-card__title">{book.title}</div>
      <div className="book-card__author">{book.author}{book.year ? ` (${book.year})` : ''}</div>
      {book.publisher && <div className="book-card__publisher">{book.publisher}</div>}
      {book.note && <p className="book-card__note">{book.note}</p>}
      {book.available && (
        <div className="book-card__available">Available: {book.available}</div>
      )}
    </div>
  );
}

function DocCard({ doc }) {
  return (
    <div className="book-card">
      <div className="book-card__title">{doc.title}</div>
      {doc.format && <div className="book-card__author">{doc.format}</div>}
      <p className="book-card__note">{doc.description}</p>
      {doc.note && <div className="book-card__available">{doc.note}</div>}
    </div>
  );
}

export default function ReadingListPage() {
  const { t } = useTranslation();

  return (
    <PageShell>
      <div className="page-content">
        <div className="page-content__header">
          <h1>{t('pages.reading_list.title')}</h1>
          <p className="page-content__subtitle">{t('pages.reading_list.subtitle')}</p>
        </div>

        <section className="reading-section">
          <h2>Primary Historical Sources</h2>
          <p className="reading-section__intro">Ancient texts used throughout this document — all available in English translation, many freely online.</p>
          <div className="book-grid">
            {READING_LIST.books_primary.map(b => <BookCard key={b.title} book={b} />)}
          </div>
        </section>

        <section className="reading-section">
          <h2>Protestant & Academic Scholarship</h2>
          <p className="reading-section__intro">Works by Protestant historians and scholars that corroborate the historical claims of this document.</p>
          <div className="book-grid">
            {READING_LIST.books_protestant.map(b => <BookCard key={b.title} book={b} />)}
          </div>
        </section>

        <section className="reading-section">
          <h2>Coptic Orthodox Sources</h2>
          <p className="reading-section__intro">Official writings and theological works from Coptic bishops and theologians — many freely available online.</p>
          <div className="book-grid">
            {READING_LIST.books_coptic.map(b => <BookCard key={b.title} book={b} />)}
          </div>
        </section>

        <section className="reading-section">
          <h2>{t('pages.reading_list.documentaries')}</h2>
          <div className="book-grid">
            {READING_LIST.documentaries.map(d => <DocCard key={d.title} doc={d} />)}
          </div>
        </section>

        <section className="reading-section">
          <h2>{t('pages.reading_list.websites')}</h2>
          <ul className="website-list">
            {READING_LIST.websites.map(site => (
              <li key={site.name} className="website-list__item">
                <span className="website-list__name">{site.name}</span>
                <span className="website-list__url">({site.url})</span>
                <span className="website-list__desc"> — {site.description}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
