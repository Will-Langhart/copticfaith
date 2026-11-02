import { colors } from './theme.js';

/** A simple Coptic cross (four equal arms, each ending in three points). Our own drawing. */
export function CopticCross({ size = 200 }) {
  const arm = (rotate) => (
    <g transform={`rotate(${rotate} 50 50)`}>
      <rect x="44" y="14" width="12" height="30" rx="2" />
      <circle cx="50" cy="10" r="5" />
      <circle cx="40" cy="16" r="4" />
      <circle cx="60" cy="16" r="4" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={colors.gold} style={{ display: 'block', margin: '0 auto' }}>
      {[0, 90, 180, 270].map((r) => <g key={r}>{arm(r)}</g>)}
      <circle cx="50" cy="50" r="10" />
      <circle cx="50" cy="50" r="5" fill={colors.bg} />
    </svg>
  );
}
