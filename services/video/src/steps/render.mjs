// Step 6 — render the Remotion composition to an mp4 sized to the narration.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { SITE_URL } from './shots.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FPS = 30;
const TAIL_SECONDS = 1.5; // hold the end card after the last word

export function buildProps({ coptic, content, script, timings, images }) {
  const verseSeg = script.segments.find((s) => s.id === 'verse');
  const verseOffset = script.narration.indexOf(verseSeg.text) + verseSeg.text.length - script.verseText.length;
  const verseEnd = verseOffset + script.verseText.length;
  const inVerse = timings.words.map((w, i) => (w.charStart >= verseOffset && w.charStart < verseEnd ? i : -1)).filter((i) => i >= 0);

  return {
    coptic: { day: coptic.day, monthName: coptic.monthName, year: coptic.year, feast: coptic.feast, fast: coptic.fast },
    title: script.title,
    saintName: content.saint?.name ?? null,
    subtitle: content.saint?.subtitle ?? null,
    verse: { ref: script.verseRef, wordRange: [inVerse[0], inVerse[inVerse.length - 1]] },
    words: timings.words.map(({ text, start, end }) => ({ text, start, end })),
    segments: timings.segments,
    images,
    siteLabel: new URL(SITE_URL).host,
    durationInFrames: Math.ceil((timings.duration + TAIL_SECONDS) * FPS),
  };
}

export async function renderVideo(props, outDir, file) {
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, 'remotion/index.jsx'),
    publicDir: path.join(outDir, 'public'),
  });
  const composition = await selectComposition({ serveUrl, id: 'DailyReel', inputProps: props });
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    inputProps: props,
    outputLocation: file,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== last) process.stdout.write(`  render ${(last = pct)}%\r`);
    },
  });
  process.stdout.write('\n');
  return { durationSeconds: props.durationInFrames / FPS };
}
