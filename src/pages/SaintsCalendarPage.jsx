import { useState, useMemo } from 'react';
import PageShell from '../components/PageShell';
import {
  SAINTS,
  COPTIC_MONTHS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  gregorianToCoptic,
  getSaintsForDay,
  getSaintsForMonth,
} from '../data/saints';
import './SaintsCalendarPage.css';

/* ── Today's Coptic date ─────────────────────────────────── */
const TODAY_COPTIC = gregorianToCoptic(new Date());

/* ── Saint Card ──────────────────────────────────────────── */
function SaintCard({ saint, onClick, isSelected }) {
  const color = CATEGORY_COLORS[saint.category] ?? '#888';
  return (
    <button
      className={`sc-card ${isSelected ? 'sc-card--open' : ''}`}
      onClick={() => onClick(saint)}
      aria-expanded={isSelected}
      style={{ '--saint-color': color }}
    >
      <span className="sc-card__dot" aria-hidden="true" />
      <div className="sc-card__body">
        <span className="sc-card__name">{saint.name}</span>
        <span className="sc-card__subtitle">{saint.subtitle}</span>
      </div>
      <span
        className="sc-card__badge"
        style={{ background: color + '22', color }}
      >
        {CATEGORY_LABELS[saint.category]}
      </span>
      <span className="sc-card__arrow" aria-hidden="true">›</span>
    </button>
  );
}

/* ── Saint Detail Panel ──────────────────────────────────── */
function SaintDetail({ saint, onClose }) {
  if (!saint) return null;
  const color = CATEGORY_COLORS[saint.category] ?? '#888';
  return (
    <div className="sc-detail" role="region" aria-label={`Profile: ${saint.name}`}>
      <button className="sc-detail__close" onClick={onClose} aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div className="sc-detail__header" style={{ '--saint-color': color }}>
        <span className="sc-detail__icon" aria-hidden="true">✦</span>
        <div>
          <h2 className="sc-detail__name">{saint.name}</h2>
          <p className="sc-detail__subtitle">{saint.subtitle}</p>
          <div className="sc-detail__meta">
            <span className="sc-detail__badge" style={{ background: color + '22', color }}>
              {CATEGORY_LABELS[saint.category]}
            </span>
            <span className="sc-detail__died">d. {saint.died}</span>
            <span className="sc-detail__feast">Feast: {saint.feast}</span>
          </div>
        </div>
      </div>

      <p className="sc-detail__bio">{saint.bio}</p>

      {saint.quote && (
        <blockquote className="sc-detail__quote">
          {saint.quote}
        </blockquote>
      )}
    </div>
  );
}

/* ── Day Picker ──────────────────────────────────────────── */
function DayPicker({ month, selectedDay, onSelect, saintsInMonth }) {
  const totalDays = COPTIC_MONTHS[month - 1]?.days ?? 30;
  const daysWithSaints = new Set(saintsInMonth.map(s => s.copticDay));

  return (
    <div className="sc-days" aria-label="Select a day">
      {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
        <button
          key={day}
          className={[
            'sc-days__btn',
            selectedDay === day ? 'sc-days__btn--active' : '',
            daysWithSaints.has(day) ? 'sc-days__btn--has-saint' : '',
          ].join(' ')}
          onClick={() => onSelect(day)}
          aria-label={`Day ${day}${daysWithSaints.has(day) ? ' — has feast' : ''}`}
          aria-pressed={selectedDay === day}
        >
          {day}
          {daysWithSaints.has(day) && (
            <span className="sc-days__dot" aria-hidden="true" />
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function SaintsCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(TODAY_COPTIC.month);
  const [selectedDay, setSelectedDay] = useState(TODAY_COPTIC.day);
  const [selectedSaint, setSelectedSaint] = useState(null);
  const [view, setView] = useState('calendar'); // 'calendar' | 'all'
  const [search, setSearch] = useState('');

  const saintsInMonth = useMemo(
    () => getSaintsForMonth(selectedMonth),
    [selectedMonth]
  );

  const saintsForDay = useMemo(
    () => getSaintsForDay(selectedMonth, selectedDay),
    [selectedMonth, selectedDay]
  );

  const filteredAll = useMemo(() => {
    if (!search.trim()) return SAINTS;
    const q = search.toLowerCase();
    return SAINTS.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.bio.toLowerCase().includes(q) ||
        CATEGORY_LABELS[s.category]?.toLowerCase().includes(q)
    );
  }, [search]);

  function handleMonthChange(num) {
    setSelectedMonth(num);
    setSelectedDay(1);
    setSelectedSaint(null);
  }

  function handleDayChange(day) {
    setSelectedDay(day);
    setSelectedSaint(null);
  }

  const todayLabel = `${TODAY_COPTIC.day} ${TODAY_COPTIC.monthName}`;

  return (
    <PageShell title="Saints Calendar">
      <div className="sc">

        {/* ── Today Banner ── */}
        <div className="sc-today">
          <div className="sc-today__inner">
            <span className="sc-today__label">Today in the Coptic Calendar</span>
            <span className="sc-today__date">{todayLabel}</span>
            {getSaintsForDay(TODAY_COPTIC.month, TODAY_COPTIC.day).length > 0 ? (
              <span className="sc-today__feasts">
                {getSaintsForDay(TODAY_COPTIC.month, TODAY_COPTIC.day)
                  .map(s => s.name)
                  .join(' · ')}
              </span>
            ) : (
              <span className="sc-today__feasts sc-today__feasts--none">No major feast recorded today</span>
            )}
            <button
              className="sc-today__jump"
              onClick={() => { setSelectedMonth(TODAY_COPTIC.month); setSelectedDay(TODAY_COPTIC.day); setView('calendar'); setSelectedSaint(null); }}
            >
              View Today →
            </button>
          </div>
        </div>

        {/* ── View Tabs ── */}
        <div className="sc-tabs">
          <button
            className={`sc-tabs__btn ${view === 'calendar' ? 'sc-tabs__btn--active' : ''}`}
            onClick={() => setView('calendar')}
          >
            Browse by Date
          </button>
          <button
            className={`sc-tabs__btn ${view === 'all' ? 'sc-tabs__btn--active' : ''}`}
            onClick={() => setView('all')}
          >
            All Saints
          </button>
        </div>

        {view === 'calendar' ? (
          <div className="sc-calendar">
            {/* Month selector */}
            <div className="sc-months" role="tablist" aria-label="Coptic months">
              {COPTIC_MONTHS.map(cm => (
                <button
                  key={cm.num}
                  role="tab"
                  aria-selected={selectedMonth === cm.num}
                  className={`sc-months__btn ${selectedMonth === cm.num ? 'sc-months__btn--active' : ''}`}
                  onClick={() => handleMonthChange(cm.num)}
                >
                  <span className="sc-months__name">{cm.name}</span>
                  <span className="sc-months__arabic">{cm.arabic}</span>
                  <span className="sc-months__count">
                    {getSaintsForMonth(cm.num).length > 0
                      ? `${getSaintsForMonth(cm.num).length} feast${getSaintsForMonth(cm.num).length > 1 ? 's' : ''}`
                      : ''}
                  </span>
                </button>
              ))}
            </div>

            {/* Day picker + detail */}
            <div className="sc-main">
              <div className="sc-left">
                <div className="sc-month-header">
                  <h2 className="sc-month-header__name">
                    {COPTIC_MONTHS[selectedMonth - 1]?.name}
                    <span className="sc-month-header__arabic">
                      {COPTIC_MONTHS[selectedMonth - 1]?.arabic}
                    </span>
                  </h2>
                  <p className="sc-month-header__greg">
                    {(() => {
                      const cm = COPTIC_MONTHS[selectedMonth - 1];
                      if (!cm) return '';
                      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                      const end = new Date(2000, cm.gregStart.m - 1, cm.gregStart.d + cm.days - 1);
                      return `${months[cm.gregStart.m - 1]} ${cm.gregStart.d} – ${months[end.getMonth()]} ${end.getDate()}`;
                    })()}
                  </p>
                </div>

                <DayPicker
                  month={selectedMonth}
                  selectedDay={selectedDay}
                  onSelect={handleDayChange}
                  saintsInMonth={saintsInMonth}
                />
              </div>

              <div className="sc-right">
                <div className="sc-day-header">
                  <h3 className="sc-day-header__title">
                    {selectedDay} {COPTIC_MONTHS[selectedMonth - 1]?.name}
                  </h3>
                  <span className="sc-day-header__count">
                    {saintsForDay.length === 0
                      ? 'No major feasts'
                      : `${saintsForDay.length} feast${saintsForDay.length > 1 ? 's' : ''}`}
                  </span>
                </div>

                {saintsForDay.length === 0 ? (
                  <p className="sc-empty">
                    No major feasts are recorded for this day in our calendar. The full Coptic Synaxarium contains thousands of entries — this is a curated selection of the most significant saints.
                  </p>
                ) : (
                  <div className="sc-list">
                    {saintsForDay.map(saint => (
                      <SaintCard
                        key={saint.id}
                        saint={saint}
                        onClick={s => setSelectedSaint(selectedSaint?.id === s.id ? null : s)}
                        isSelected={selectedSaint?.id === saint.id}
                      />
                    ))}
                  </div>
                )}

                {selectedSaint && saintsForDay.some(s => s.id === selectedSaint.id) && (
                  <SaintDetail saint={selectedSaint} onClose={() => setSelectedSaint(null)} />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── All Saints View ── */
          <div className="sc-all">
            <div className="sc-search-wrap">
              <input
                className="sc-search"
                type="search"
                placeholder="Search saints by name, category, or description…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search saints"
              />
            </div>

            <p className="sc-all__count">
              {filteredAll.length} saint{filteredAll.length !== 1 ? 's' : ''} shown
            </p>

            <div className="sc-all-grid">
              {filteredAll
                .slice()
                .sort((a, b) => a.copticMonth - b.copticMonth || a.copticDay - b.copticDay)
                .map(saint => (
                  <button
                    key={saint.id}
                    className={`sc-all-card ${selectedSaint?.id === saint.id ? 'sc-all-card--open' : ''}`}
                    onClick={() => setSelectedSaint(selectedSaint?.id === saint.id ? null : saint)}
                    style={{ '--saint-color': CATEGORY_COLORS[saint.category] ?? '#888' }}
                  >
                    <div className="sc-all-card__top">
                      <span className="sc-all-card__feast-day">
                        {saint.copticDay} {COPTIC_MONTHS[saint.copticMonth - 1]?.name}
                      </span>
                      <span
                        className="sc-all-card__badge"
                        style={{ background: (CATEGORY_COLORS[saint.category] ?? '#888') + '22', color: CATEGORY_COLORS[saint.category] ?? '#888' }}
                      >
                        {CATEGORY_LABELS[saint.category]}
                      </span>
                    </div>
                    <span className="sc-all-card__name">{saint.name}</span>
                    <span className="sc-all-card__subtitle">{saint.subtitle}</span>

                    {selectedSaint?.id === saint.id && (
                      <div className="sc-all-card__detail" onClick={e => e.stopPropagation()}>
                        <p className="sc-all-card__bio">{saint.bio}</p>
                        {saint.quote && (
                          <blockquote className="sc-all-card__quote">{saint.quote}</blockquote>
                        )}
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* ── About section ── */}
        <section className="sc-about">
          <h2 className="sc-about__title">About the Coptic Calendar</h2>
          <div className="sc-about__cols">
            <div className="sc-about__col">
              <h3>The Coptic Year</h3>
              <p>The Coptic calendar, also called the Alexandrian calendar, has 13 months — twelve of 30 days and a short month called Nasi of 5 or 6 days. The new year begins on 1 Tout (September 11 in most years). The current Coptic era is Anno Martyrum (AM), counting from the accession of Emperor Diocletian (284 AD), in memory of the martyrs who died under him.</p>
            </div>
            <div className="sc-about__col">
              <h3>The Synaxarium</h3>
              <p>The Synaxarium (from Greek <em>synaxis</em>, "gathering") is the Coptic Church's official martyrology and hagiography, listing commemorations for each day of the year. It contains thousands of entries compiled over centuries. This page presents a curated selection of major saints; the full Synaxarium is read aloud during the Divine Liturgy on feast days.</p>
            </div>
            <div className="sc-about__col">
              <h3>Monthly Virgin's Feast</h3>
              <p>The Virgin Mary has a feast on the 21st of every Coptic month, totaling 13 feasts per year. The month of Kiahk (December–January) is entirely devoted to her honor, and its praises (the Kiahk Theotokia) are among the most beloved in Coptic hymnody. She is called Theotokos — God-bearer — and is venerated above all saints.</p>
            </div>
          </div>
        </section>

      </div>
    </PageShell>
  );
}
