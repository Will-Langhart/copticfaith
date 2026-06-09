import { useParams, Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { FATHERS } from '../data/fathers';
import { FATHERS_EXTENDED } from '../data/fathersExtended';
import './FatherProfilePage.css';

const RELEVANCE_LABELS = {
  central:    { label: 'Central to Coptic Faith',   cls: 'fp-badge--central'    },
  liturgical: { label: 'Liturgically Honored',       cls: 'fp-badge--liturgical' },
  honored:    { label: 'Honored Father',             cls: 'fp-badge--honored'    },
};

export default function FatherProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const idx    = FATHERS.findIndex(f => f.id === id);
  const father = FATHERS[idx];
  const ext    = FATHERS_EXTENDED[id] ?? {};

  if (!father) {
    return (
      <PageShell title="Father Not Found">
        <div className="fp-notfound">
          <p>No Father found with id "{id}".</p>
          <Link to="/fathers">← Back to The Fathers</Link>
        </div>
      </PageShell>
    );
  }

  const prev = FATHERS[idx - 1] ?? null;
  const next = FATHERS[idx + 1] ?? null;

  const relevance = RELEVANCE_LABELS[father.copticRelevance];
  const relatedFathers = (ext.relatedFathers ?? [])
    .map(rid => FATHERS.find(f => f.id === rid))
    .filter(Boolean);

  return (
    <PageShell>
      <div className="fp">

        {/* ── Breadcrumb ── */}
        <nav className="fp-breadcrumb" aria-label="Breadcrumb">
          <Link to="/fathers" className="fp-breadcrumb__link">← The Fathers</Link>
          <span className="fp-breadcrumb__sep" aria-hidden="true">/</span>
          <span className="fp-breadcrumb__current">{father.name.replace(/^(Saint|The Scholar)\s/, '')}</span>
        </nav>

        {/* ── Hero ── */}
        <header className="fp-hero">
          <div className="fp-hero__portrait-wrap">
            <img
              className="fp-hero__portrait"
              src={father.image}
              alt={father.name}
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <span className="fp-hero__portrait-fallback" aria-hidden="true" style={{ display: 'none' }}>
              {father.name.replace(/^(Saint|The Scholar)\s/, '').charAt(0)}
            </span>
          </div>

          <div className="fp-hero__text">
            {relevance && (
              <span className={`fp-badge ${relevance.cls}`}>{relevance.label}</span>
            )}
            <h1 className="fp-hero__name">{father.name}</h1>
            <p className="fp-hero__title">{father.title}</p>
            <div className="fp-hero__meta">
              <span className="fp-hero__dates">{father.dates}</span>
              {father.feast !== '— (not formally canonized)' && (
                <span className="fp-hero__feast">Feast Day: {father.feast}</span>
              )}
              {ext.era && <span className="fp-hero__era">{ext.era}</span>}
              {ext.location && <span className="fp-hero__location">📍 {ext.location}</span>}
            </div>
            <div className="fp-hero__epithet" aria-label="Epithet">
              <span className="fp-hero__epithet-ornament" aria-hidden="true">✦</span>
              <em>{father.epithet}</em>
              <span className="fp-hero__epithet-ornament" aria-hidden="true">✦</span>
            </div>
          </div>
        </header>

        {/* ── Tagline pull-quote ── */}
        <div className="fp-tagline">
          <p>{father.tagline}</p>
        </div>

        <div className="fp-body">

          {/* ── Biography ── */}
          <section className="fp-section" aria-labelledby="fp-bio-heading">
            <h2 id="fp-bio-heading" className="fp-section__title">Biography</h2>
            <p className="fp-bio">{father.bio}</p>
            {ext.contextNote && (
              <aside className="fp-context-note">
                <span className="fp-context-note__icon" aria-hidden="true">ℹ</span>
                <p>{ext.contextNote}</p>
              </aside>
            )}
          </section>

          {/* ── Key Teachings ── */}
          <section className="fp-section" aria-labelledby="fp-teachings-heading">
            <h2 id="fp-teachings-heading" className="fp-section__title">Key Teachings</h2>
            <ul className="fp-teachings">
              {father.keyTeachings.map((t, i) => (
                <li key={i} className="fp-teaching">
                  <span className="fp-teaching__bullet" aria-hidden="true">✦</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Notable Quote ── */}
          <section className="fp-section" aria-labelledby="fp-quote-heading">
            <h2 id="fp-quote-heading" className="fp-section__title">Notable Quote</h2>
            <blockquote className="fp-quote">
              <p className="fp-quote__text">"{father.notableQuote.text}"</p>
              <footer className="fp-quote__source">
                — {father.name}, <cite>{father.notableQuote.source}</cite>
              </footer>
            </blockquote>
          </section>

          {/* ── Major Writings ── */}
          {ext.works?.length > 0 && (
            <section className="fp-section" aria-labelledby="fp-works-heading">
              <h2 id="fp-works-heading" className="fp-section__title">Major Writings</h2>
              <div className="fp-works">
                {ext.works.map((w, i) => (
                  <div key={i} className="fp-work">
                    <div className="fp-work__header">
                      <span className="fp-work__title">{w.title}</span>
                      {w.date && <span className="fp-work__date">{w.date}</span>}
                    </div>
                    <p className="fp-work__desc">{w.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Councils / Exiles ── */}
          {((ext.councilsAttended?.length > 0) || ext.exiles) && (
            <section className="fp-section" aria-labelledby="fp-history-heading">
              <h2 id="fp-history-heading" className="fp-section__title">Historical Highlights</h2>
              <div className="fp-highlights">
                {ext.exiles && (
                  <div className="fp-highlight">
                    <span className="fp-highlight__num">{ext.exiles}</span>
                    <span className="fp-highlight__label">Exiles Endured</span>
                  </div>
                )}
                {ext.councilsAttended?.map((c, i) => (
                  <div key={i} className="fp-highlight fp-highlight--council">
                    <span className="fp-highlight__icon" aria-hidden="true">☩</span>
                    <span className="fp-highlight__label">{c}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Related Fathers ── */}
          {relatedFathers.length > 0 && (
            <section className="fp-section" aria-labelledby="fp-related-heading">
              <h2 id="fp-related-heading" className="fp-section__title">Related Fathers</h2>
              <div className="fp-related">
                {relatedFathers.map(rf => (
                  <Link
                    key={rf.id}
                    to={`/fathers/${rf.id}`}
                    className="fp-related-card"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <img
                      className="fp-related-card__img"
                      src={rf.image}
                      alt={rf.name}
                      loading="lazy"
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <span className="fp-related-card__fallback" aria-hidden="true" style={{ display: 'none' }}>
                      {rf.name.replace(/^(Saint|The Scholar)\s/, '').charAt(0)}
                    </span>
                    <div className="fp-related-card__info">
                      <span className="fp-related-card__name">{rf.name}</span>
                      <span className="fp-related-card__dates">{rf.dates}</span>
                    </div>
                    <span className="fp-related-card__arrow" aria-hidden="true">›</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ── Prev / Next navigation ── */}
        <nav className="fp-pagination" aria-label="Previous and next Father">
          <div className="fp-pagination__slot fp-pagination__slot--prev">
            {prev && (
              <Link
                to={`/fathers/${prev.id}`}
                className="fp-pagination__btn"
                onClick={() => window.scrollTo(0, 0)}
              >
                <span className="fp-pagination__arrow" aria-hidden="true">‹</span>
                <span className="fp-pagination__label">
                  <span className="fp-pagination__hint">Previous</span>
                  <span className="fp-pagination__name">{prev.name.replace(/^(Saint|The Scholar)\s/, '')}</span>
                </span>
              </Link>
            )}
          </div>
          <Link to="/fathers" className="fp-pagination__all">All Fathers</Link>
          <div className="fp-pagination__slot fp-pagination__slot--next">
            {next && (
              <Link
                to={`/fathers/${next.id}`}
                className="fp-pagination__btn fp-pagination__btn--next"
                onClick={() => window.scrollTo(0, 0)}
              >
                <span className="fp-pagination__label">
                  <span className="fp-pagination__hint">Next</span>
                  <span className="fp-pagination__name">{next.name.replace(/^(Saint|The Scholar)\s/, '')}</span>
                </span>
                <span className="fp-pagination__arrow" aria-hidden="true">›</span>
              </Link>
            )}
          </div>
        </nav>

      </div>
    </PageShell>
  );
}
