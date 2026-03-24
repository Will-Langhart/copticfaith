import { useState, useRef } from 'react';
import PageShell from '../components/PageShell';
import { FATHERS } from '../data/fathers';
import './FathersPage.css';

function FatherCard({ father, onSelect, isSelected }) {
  return (
    <button
      className={`father-card ${isSelected ? 'father-card--active' : ''}`}
      onClick={() => onSelect(father)}
      aria-expanded={isSelected}
      aria-label={`View profile of ${father.name}`}
    >
      <div className="father-card__avatar-wrap">
        <img
          className="father-card__avatar"
          src={father.image}
          alt={father.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'flex';
          }}
        />
        <span className="father-card__avatar-fallback" aria-hidden="true" style={{ display: 'none' }}>
          {father.name.replace(/^(Saint|The Scholar)\s/, '').charAt(0)}
        </span>
      </div>
      <div className="father-card__info">
        <span className="father-card__name">{father.name}</span>
        <span className="father-card__dates">{father.dates}</span>
        <span className="father-card__tagline">{father.tagline}</span>
      </div>
      <span className="father-card__arrow" aria-hidden="true">›</span>
    </button>
  );
}

function FatherDetail({ father, onClose }) {
  if (!father) return null;

  return (
    <div className="father-detail" role="region" aria-label={`Profile: ${father.name}`}>
      <button className="father-detail__close" onClick={onClose} aria-label="Close profile">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div className="father-detail__hero">
        <div className="father-detail__portrait-wrap">
          <img
            className="father-detail__portrait"
            src={father.image}
            alt={father.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
          <span className="father-detail__portrait-fallback" aria-hidden="true" style={{ display: 'none' }}>
            {father.name.replace(/^(Saint|The Scholar)\s/, '').charAt(0)}
          </span>
        </div>
        <div className="father-detail__hero-text">
          <h2 className="father-detail__name">{father.name}</h2>
          <p className="father-detail__title">{father.title}</p>
          <div className="father-detail__meta">
            <span className="father-detail__dates">{father.dates}</span>
            {father.feast !== '— (not formally canonized)' && (
              <span className="father-detail__feast">Feast: {father.feast}</span>
            )}
          </div>
          {father.copticRelevance === 'central' && (
            <span className="father-detail__badge father-detail__badge--central">Central to Coptic Faith</span>
          )}
          {father.copticRelevance === 'liturgical' && (
            <span className="father-detail__badge father-detail__badge--liturgical">Liturgically Honored</span>
          )}
        </div>
      </div>

      <div className="father-detail__epithet">
        <span className="section-divider__ornament">✦</span>
        <em>{father.epithet}</em>
        <span className="section-divider__ornament">✦</span>
      </div>

      <div className="father-detail__body">
        <h3 className="father-detail__section-title">Biography</h3>
        <p className="father-detail__bio">{father.bio}</p>

        <h3 className="father-detail__section-title">Key Teachings</h3>
        <ul className="father-detail__teachings">
          {father.keyTeachings.map((t, i) => (
            <li key={i} className="father-detail__teaching-item">
              <span className="father-detail__teaching-bullet" aria-hidden="true">✦</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <h3 className="father-detail__section-title">Notable Quote</h3>
        <blockquote className="father-detail__quote">
          <p className="father-detail__quote-text">"{father.notableQuote.text}"</p>
          <footer className="father-detail__quote-source">
            — {father.name}, <cite>{father.notableQuote.source}</cite>
          </footer>
        </blockquote>
      </div>
    </div>
  );
}

export default function FathersPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const detailRef = useRef(null);

  const filtered = search.trim()
    ? FATHERS.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.bio.toLowerCase().includes(search.toLowerCase())
      )
    : FATHERS;

  const handleSelect = (father) => {
    if (selected?.id === father.id) {
      setSelected(null);
    } else {
      setSelected(father);
      // Scroll detail panel into view on mobile
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  return (
    <PageShell>
      <div className="fathers-page">
        {/* ── Hero ── */}
        <div className="fathers-hero">
          <div className="fathers-hero__inner">
            <p className="fathers-hero__eyebrow">Patristic Treasury</p>
            <h1 className="fathers-hero__title">The Church Fathers</h1>
            <p className="fathers-hero__subtitle">
              The great theologians, bishops, and martyrs whose writings guard the Faith
              "delivered once for all to the saints" — <em>Jude 1:3</em>
            </p>
            <div className="fathers-hero__divider">
              <span>─────</span>
              <span className="fathers-hero__ornament">✦</span>
              <span>─────</span>
            </div>
            <p className="fathers-hero__desc">
              The Coptic Orthodox Church is the Church of Saint Mark the Evangelist, founded in
              Alexandria in the first century. Through her Catechetical School — the oldest Christian
              school in the world — she gave the Church some of its most towering theologians. These
              Fathers are not merely historical figures; their writings are living voices that the
              Church reads, sings, and prays to this day.
            </p>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className="fathers-layout">
          {/* ── List panel ── */}
          <div className="fathers-list-panel">
            <div className="fathers-search-wrap">
              <svg className="fathers-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="fathers-search"
                type="search"
                placeholder="Search fathers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search Church Fathers"
              />
              {search && (
                <button className="fathers-search-clear" onClick={() => setSearch('')} aria-label="Clear search">×</button>
              )}
            </div>

            {filtered.length === 0 ? (
              <p className="fathers-empty">No fathers match "{search}"</p>
            ) : (
              <ul className="fathers-list" role="list">
                {filtered.map(father => (
                  <li key={father.id} role="listitem">
                    <FatherCard
                      father={father}
                      onSelect={handleSelect}
                      isSelected={selected?.id === father.id}
                    />
                  </li>
                ))}
              </ul>
            )}

            <p className="fathers-count">{filtered.length} of {FATHERS.length} Fathers</p>
          </div>

          {/* ── Detail panel ── */}
          <div className="fathers-detail-panel" ref={detailRef}>
            {selected ? (
              <FatherDetail father={selected} onClose={() => setSelected(null)} />
            ) : (
              <div className="fathers-detail-empty">
                <div className="fathers-detail-empty__icon" aria-hidden="true">☩</div>
                <p className="fathers-detail-empty__text">
                  Select a Father from the list to read their biography, key teachings, and a notable quote.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer note ── */}
        <div className="fathers-footer-note">
          <div className="section-divider section-divider--rule">─────  ✦  ─────</div>
          <p>
            <strong>A note on Origen:</strong> Origen is listed as "The Scholar" rather than "Saint" because
            certain speculative elements of his theology — particularly on the pre-existence of souls and
            universal restoration — were condemned at the Second Council of Constantinople (553 AD). The
            Coptic Church honors his immense scholarly contribution to the Alexandrian tradition while
            not venerating him liturgically as a saint.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
