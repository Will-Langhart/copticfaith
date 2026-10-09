import { Link } from 'react-router-dom';
import { getFast } from '../data/fasts';

/** Header pill naming today's fast; renders nothing on non-fasting days. */
export default function FastBadge() {
  const fast = getFast(new Date());
  if (!fast) return null;

  return (
    <Link to="/daily-readings" className="fast-badge" title={`Today: ${fast} — see the daily readings`}>
      {fast}
    </Link>
  );
}
