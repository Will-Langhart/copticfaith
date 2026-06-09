import { useState, useEffect, useCallback } from 'react';
import PageShell from '../components/PageShell';
import { gregorianToCoptic, COPTIC_MONTHS } from '../data/saints';
import { getReadingsForDay, refToLabel } from '../data/lectionary';
import './DailyReadingsPage.css';

/* ── Bible API fetch ─────────────────────────────────────── */
async function fetchPassage(ref) {
  if (!ref) return null;
  try {
    const encoded = encodeURIComponent(ref);
    const res = await fetch(`https://bible-api.com/${encoded}?translation=web`);
    if (!res.ok) return { ref, text: null, error: 'Could not load passage.' };
    const data = await res.json();
    return {
      ref: data.reference,
      text: data.text?.trim() ?? null,
    };
  } catch {
    return { ref, text: null, error: 'Network error.' };
  }
}

/* ── Reading Panel ───────────────────────────────────────── */
function ReadingPanel({ label, icon, reference, passage, isLoading, isOpen, onToggle }) {
  return (
    <div className={`dr-panel ${isOpen ? 'dr-panel--open' : ''}`}>
      <button className="dr-panel__header" onClick={onToggle} aria-expanded={isOpen}>
        <span className="dr-panel__icon" aria-hidden="true">{icon}</span>
        <div className="dr-panel__meta">
          <span className="dr-panel__label">{label}</span>
          <span className="dr-panel__ref">{refToLabel(reference)}</span>
        </div>
        <span className="dr-panel__chevron" aria-hidden="true">›</span>
      </button>

      {isOpen && (
        <div className="dr-panel__body">
          {isLoading ? (
            <div className="dr-panel__loading" aria-live="polite">
              <span className="dr-panel__spinner" />
              <span>Loading passage…</span>
            </div>
          ) : passage?.error ? (
            <p className="dr-panel__error">{passage.error}</p>
          ) : passage?.text ? (
            <>
              <p className="dr-panel__ref-title">{passage.ref}</p>
              <p className="dr-panel__text">{passage.text}</p>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

/* ── Date Navigator ──────────────────────────────────────── */
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatGregorian(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* ── Main Page ───────────────────────────────────────────── */
export default function DailyReadingsPage() {
  const [date, setDate] = useState(new Date());
  const [openPanel, setOpenPanel] = useState('pauline'); // which panel is expanded
  const [passages, setPassages] = useState({});         // ref → { ref, text, error }
  const [loadingSet, setLoadingSet] = useState(new Set());

  const coptic = gregorianToCoptic(date);
  const readings = getReadingsForDay(
    coptic.month,
    coptic.day,
    date.getDay(),
    coptic.monthName
  );

  // Mapping of panel keys to icons / labels
  const PANELS = [
    { key: 'pauline',  icon: '✉', label: 'Pauline Epistle',    ref: readings.pauline },
    { key: 'catholic', icon: '📜', label: 'Catholic Epistle',   ref: readings.catholic },
    { key: 'acts',     icon: '⛵', label: 'Acts of the Apostles', ref: readings.acts },
    { key: 'gospel',   icon: '✦', label: 'Holy Gospel',         ref: readings.gospel },
  ];

  // When the date or a panel opens, fetch that passage if not already cached
  const fetchIfNeeded = useCallback(async (ref) => {
    if (!ref || passages[ref] || loadingSet.has(ref)) return;
    setLoadingSet(prev => new Set(prev).add(ref));
    const result = await fetchPassage(ref);
    setPassages(prev => ({ ...prev, [ref]: result }));
    setLoadingSet(prev => { const s = new Set(prev); s.delete(ref); return s; });
  }, [passages, loadingSet]);

  // Pre-fetch the open panel whenever it or the date changes
  useEffect(() => {
    const panel = PANELS.find(p => p.key === openPanel);
    if (panel?.ref) fetchIfNeeded(panel.ref);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPanel, date]);

  // When date changes, reset passages cache and reopen first panel
  useEffect(() => {
    setPassages({});
    setLoadingSet(new Set());
    setOpenPanel('pauline');
  }, [date]);

  function handleToggle(key, ref) {
    setOpenPanel(prev => prev === key ? null : key);
    fetchIfNeeded(ref);
  }

  const isToday = date.toDateString() === new Date().toDateString();
  const isFastDay = readings.isFastDay;

  return (
    <PageShell title="Daily Readings">
      <div className="dr">

        {/* ── Date Navigator ── */}
        <div className="dr-nav">
          <button
            className="dr-nav__btn"
            onClick={() => setDate(d => addDays(d, -1))}
            aria-label="Previous day"
          >
            ‹
          </button>

          <div className="dr-nav__center">
            <span className="dr-nav__greg">{formatGregorian(date)}</span>
            <span className="dr-nav__coptic">
              {coptic.day} {COPTIC_MONTHS[coptic.month - 1]?.name}
              {' · '}
              <span className="dr-nav__arabic">{COPTIC_MONTHS[coptic.month - 1]?.arabic}</span>
            </span>
          </div>

          <button
            className="dr-nav__btn"
            onClick={() => setDate(d => addDays(d, 1))}
            aria-label="Next day"
          >
            ›
          </button>
        </div>

        {!isToday && (
          <div className="dr-today-jump">
            <button onClick={() => setDate(new Date())} className="dr-today-jump__btn">
              ← Back to Today
            </button>
          </div>
        )}

        {/* ── Day Header ── */}
        <div className="dr-header">
          <div className="dr-header__badges">
            <span className={`dr-header__day-badge dr-header__day-badge--${DAYS[date.getDay()].toLowerCase()}`}>
              {DAYS[date.getDay()]}
            </span>
            {isFastDay && (
              <span className="dr-header__fast-badge">Fasting Day</span>
            )}
            {readings.season && (
              <span className="dr-header__season-badge">{readings.season}</span>
            )}
          </div>

          <h2 className="dr-header__title">
            {readings.isFeast ? (
              <>
                <span className="dr-header__feast-star" aria-hidden="true">✦</span>
                {readings.label}
              </>
            ) : (
              readings.label
            )}
          </h2>

          {readings.note && (
            <p className="dr-header__note">{readings.note}</p>
          )}
        </div>

        {/* ── Reading Panels ── */}
        <div className="dr-panels">
          {PANELS.map(({ key, icon, label, ref }) => (
            <ReadingPanel
              key={key}
              label={label}
              icon={icon}
              reference={ref}
              passage={passages[ref]}
              isLoading={loadingSet.has(ref)}
              isOpen={openPanel === key}
              onToggle={() => handleToggle(key, ref)}
            />
          ))}
        </div>

        {/* ── About Section ── */}
        <section className="dr-about">
          <h2 className="dr-about__title">About the Coptic Lectionary</h2>
          <div className="dr-about__cols">
            <div className="dr-about__col">
              <h3>Four Readings</h3>
              <p>Each liturgy in the Coptic Church includes four Scripture readings: a Pauline Epistle, a Catholic Epistle (from James, Peter, John, or Jude), a passage from Acts of the Apostles, and the Holy Gospel. Together they present a complete theological picture for the day.</p>
            </div>
            <div className="dr-about__col">
              <h3>Fasting Days</h3>
              <p>Every Wednesday and Friday are fasting days in the Coptic Church — Wednesday commemorating the betrayal of Christ, Friday His crucifixion. The readings on these days reflect themes of sacrifice and the Cross. In addition, the Coptic Church observes roughly 210 fasting days per year across several major fasts.</p>
            </div>
            <div className="dr-about__col">
              <h3>Feast Days</h3>
              <p>On major feasts the ordinary weekly readings are replaced by specific passages that illuminate the mystery being celebrated. The Seven Great Feasts of the Lord and the Seven Great Feasts of the Virgin each have their own appointed lectionary. Scripture text is provided by the World English Bible (WEB), a modern public-domain translation.</p>
            </div>
          </div>
        </section>

      </div>
    </PageShell>
  );
}
