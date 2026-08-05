import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FATHERS } from '../data/fathers';

/**
 * Reflection of the Day — a rotating patristic quote on the homepage.
 *
 * The pool is DERIVED from fathers.js (every Father with a vetted
 * notableQuote), so each reflection is already reviewed, links to that
 * Father's profile, and the rotation grows automatically as Fathers are
 * added. No cron, no fetch, no storage — the pick is a deterministic
 * function of the viewer's LOCAL calendar day, so it rotates once per day
 * and flips at the viewer's own midnight (not UTC midnight).
 */
const REFLECTIONS = FATHERS
  .filter((f) => f.notableQuote?.text)
  .map((f) => ({
    id: f.id,
    name: f.name,
    text: f.notableQuote.text,
    source: f.notableQuote.source,
  }));

// Index of today's reflection, keyed to the viewer's LOCAL calendar day.
// Using the local Y/M/D means the number changes at local midnight and is
// stable for the whole day, regardless of timezone.
function todayIndex(date = new Date()) {
  const localDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const daysSinceEpoch = Math.floor(localDay / 86400000);
  return daysSinceEpoch % REFLECTIONS.length;
}

export default function ReflectionOfTheDay() {
  const [index, setIndex] = useState(todayIndex);

  // Keep the pick current without a manual reload: recompute at the next
  // local midnight, and whenever the user returns to a long-open tab.
  useEffect(() => {
    let timer;
    const refresh = () => setIndex(todayIndex());

    const scheduleMidnight = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5
      );
      timer = setTimeout(() => { refresh(); scheduleMidnight(); }, nextMidnight - now);
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    scheduleMidnight();

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
      clearTimeout(timer);
    };
  }, []);

  const reflection = REFLECTIONS[index];
  if (!reflection) return null;

  return (
    <section className="reflection" aria-label="Reflection of the day">
      <div className="reflection__card">
        <p className="reflection__eyebrow">Reflection of the Day</p>
        <div className="reflection__divider" aria-hidden="true">
          <span>✦</span>
        </div>
        <blockquote className="reflection__quote">
          {reflection.text}
        </blockquote>
        <cite className="reflection__attribution">
          <span className="reflection__name">{reflection.name}</span>
          {reflection.source && (
            <span className="reflection__source">{reflection.source}</span>
          )}
        </cite>
        <Link to={`/fathers/${reflection.id}`} className="reflection__cta">
          Read more from this Father →
        </Link>
      </div>
    </section>
  );
}
