import { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts } from './theme.js';
import { chunkWords } from './chunkWords.js';

/** Word-by-word captions: the current line, with the spoken word in gold. */
export function Captions({ words, skip, until }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const chunks = useMemo(() => chunkWords(words, skip), [words, skip]);

  if (now >= until) return null;
  const chunk = chunks.find((c) => now >= c[0].start && now < c[c.length - 1].end + 0.25);
  if (!chunk) return null;

  return (
    <div style={{ position: 'absolute', left: 80, right: 80, top: 1390, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          fontFamily: fonts.body, fontWeight: 600, fontSize: 56, lineHeight: 1.3, textAlign: 'center',
          padding: '18px 34px', borderRadius: 24, background: 'rgba(10, 14, 23, 0.78)',
        }}
      >
        {chunk.map((w) => (
          <span key={w.index} style={{ color: now >= w.start && now < w.end + 0.05 ? colors.gold : colors.text }}>
            {w.text}{' '}
          </span>
        ))}
      </div>
    </div>
  );
}
