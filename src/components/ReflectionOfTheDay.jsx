import { Link } from 'react-router-dom';
import { FATHERS } from '../data/fathers';

/**
 * Reflection of the Day — a rotating patristic quote on the homepage.
 *
 * The pool is DERIVED from fathers.js (every Father with a vetted
 * notableQuote), so each reflection is already reviewed, links to that
 * Father's profile, and the rotation grows automatically as Fathers are
 * added. No cron, no fetch, no storage — the day-of-year seed makes the
 * pick deterministic, so every visitor sees the same reflection on a given
 * day and it stays stable across reloads.
 */
const REFLECTIONS = FATHERS
  .filter((f) => f.notableQuote?.text)
  .map((f) => ({
    id: f.id,
    name: f.name,
    text: f.notableQuote.text,
    source: f.notableQuote.source,
  }));

function reflectionForToday(date = new Date()) {
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 0);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dayOfYear = Math.floor((today - yearStart) / 86400000);
  return REFLECTIONS[dayOfYear % REFLECTIONS.length];
}

export default function ReflectionOfTheDay() {
  const reflection = reflectionForToday();
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
