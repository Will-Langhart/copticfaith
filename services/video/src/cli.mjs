// npm run daily -- --date YYYY-MM-DD [--publish]
// Runs every step and writes the mp4, caption and working files to out/<date>/.
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (existsSync(path.join(ROOT, '.env'))) process.loadEnvFile(path.join(ROOT, '.env'));

// Imported after .env is loaded, since some steps read env at module load.
const { getCopticDay, parseDate, toISODate } = await import('./steps/date.mjs');
const { getDayContent } = await import('./steps/content.mjs');
const { writeScript } = await import('./steps/script.mjs');
const { synthesize } = await import('./steps/voice.mjs');
const { takeShots, SITE_URL } = await import('./steps/shots.mjs');
const { buildProps, renderVideo } = await import('./steps/render.mjs');
const { buildCaption } = await import('./steps/caption.mjs');
const { publish } = await import('./steps/publish.mjs');

const { values: args } = parseArgs({
  options: {
    date: { type: 'string', default: toISODate(new Date()) },
    publish: { type: 'boolean', default: false },
  },
});

const json = (value) => JSON.stringify(value, null, 2);
const step = (n, label) => console.log(`\n[${n}/8] ${label}`);

const date = parseDate(args.date);
const outDir = path.join(ROOT, 'out', args.date);
await mkdir(path.join(outDir, 'public'), { recursive: true });

step(1, 'Coptic date');
const coptic = getCopticDay(date);
console.log(`  ${coptic.label}${coptic.feast ? ` · ${coptic.feast}` : ''}${coptic.fast ? ` · ${coptic.fast}` : ''}`);

step(2, 'Synaxarium and Gospel');
const content = await getDayContent(coptic);
console.log(`  Saint: ${content.saint?.name ?? '(none in src/data/saints.js for this day)'}`);
console.log(`  Gospel: ${content.gospel.ref} (${content.gospel.translation}) — ${content.readingSource}`);

step(3, 'Narration script (Claude)');
const script = await writeScript(coptic, content);
await writeFile(path.join(outDir, 'script.json'), json(script));
console.log(`  ${script.words} words, verse ${script.verseRef}\n  "${script.narration}"`);

step(4, 'Voice (ElevenLabs)');
const timings = await synthesize(script, outDir);
console.log(`  ${timings.duration.toFixed(1)}s of narration, ${timings.words.length} timed words`);
if (timings.duration < 33 || timings.duration > 47) console.warn(`  warning: narration is outside the 35–45s target`);

step(5, 'Screenshots (Playwright)');
const shots = await takeShots(date, content, outDir);
const credits = [
  ...shots.credits,
  { asset: 'public/narration.mp3', source: `ElevenLabs voice ${timings.voiceId}, model ${timings.modelId}`, license: 'generated for copticfaith' },
  { asset: 'scripture', source: `${content.gospel.ref}, World English Bible via bible-api.com`, license: 'public-domain' },
  { asset: 'fonts', source: 'Cormorant Garamond and DM Sans, Google Fonts', license: 'OFL-1.1' },
  { asset: 'Coptic cross graphic', source: 'remotion/CopticCross.jsx', license: 'own-work' },
];
await writeFile(path.join(outDir, 'credits.json'), json(credits));
console.log(`  ${Object.values(shots).filter((v) => typeof v === 'string').join(', ')} from ${SITE_URL}`);

step(6, 'Video (Remotion)');
const { credits: _unused, ...images } = shots;
const props = buildProps({ coptic, content, script, timings, images });
await writeFile(path.join(outDir, 'props.json'), json(props));
const videoFile = path.join(outDir, `copticfaith-${args.date}.mp4`);
const { durationSeconds } = await renderVideo(props, outDir, videoFile);
console.log(`  ${path.relative(ROOT, videoFile)} (${durationSeconds.toFixed(1)}s, 1080×1920, 30fps)`);

step(7, 'Caption');
const caption = buildCaption(coptic, content, script);
const captionFile = path.join(outDir, 'caption.txt');
await writeFile(captionFile, caption + '\n');
console.log(`  ${path.relative(ROOT, captionFile)}`);

step(8, args.publish ? 'Publish to Meta' : 'Publish to Meta (dry run)');
await publish({ videoFile, caption, live: args.publish });
