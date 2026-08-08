/**
 * Corpus exporter — Phase 1 of the LangGraph "ask-father" upgrade.
 *
 * Reads the curated content in src/data/*.js and emits chunked JSON retrieval
 * records for the Python/LangGraph service to embed and index.
 *
 * Outputs (written to corpus/):
 *   - corpus.jsonl        one JSON record per line (canonical ingestion format)
 *   - verified_quotes.json  the subset the Citation Verifier gates against
 *   - manifest.json       counts, char stats, and schema notes
 *
 * Run:  node scripts/export-corpus.mjs
 *
 * Chunk record schema:
 *   {
 *     id:        stable unique id  "<type>:<slug>[:<index>]"
 *     type:      father_bio | father_teaching | father_quote | father_work |
 *                glossary | saint | saint_quote | scripture |
 *                lectionary_feast | lectionary_weekly | reading
 *     title:     human-readable label (for citation display)
 *     text:      the embeddable content (self-contained; names inlined)
 *     source:    provenance string for quotes/works ("" when n/a)
 *     verified:  true only for real, attributable quotations
 *     metadata:  type-specific fields for filtering / display
 *   }
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA = resolve(ROOT, 'src', 'data');
const OUT = resolve(ROOT, 'abba', 'corpus');  // inside abba/ so it ships with the deployment

const load = (file) => import(new URL(`file://${resolve(DATA, file)}`).href);

// ── helpers ───────────────────────────────────────────────────
const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();

/** Split a saint/quote string like `"...text..." — Attribution` */
function splitQuote(raw) {
  const s = clean(raw);
  const m = s.match(/^["“](.+?)["”]\s*[—–-]\s*(.+)$/);
  if (m) return { quote: m[1].trim(), attribution: m[2].trim() };
  // No clear attribution — keep whole thing as the quote.
  return { quote: s.replace(/^["“]|["”]$/g, '').trim(), attribution: '' };
}

const chunks = [];
const push = (rec) => chunks.push({ source: '', verified: false, metadata: {}, ...rec });

// ── FATHERS (fathers.js + fathersExtended.js) ─────────────────
async function exportFathers() {
  const { FATHERS } = await load('fathers.js');
  const { FATHERS_EXTENDED } = await load('fathersExtended.js');

  for (const f of FATHERS) {
    const ext = FATHERS_EXTENDED[f.id] ?? {};
    const meta = {
      id: f.id, name: f.name, dates: f.dates, feast: f.feast,
      era: ext.era, location: ext.location, school: ext.school,
      copticRelevance: f.copticRelevance,
    };

    // Biography (+ contextNote when present)
    push({
      id: `father_bio:${f.id}`,
      type: 'father_bio',
      title: `${f.name} — Biography`,
      text: clean(`${f.name} (${f.dates}), ${f.title}. ${f.bio}${ext.contextNote ? ' ' + ext.contextNote : ''}`),
      metadata: meta,
    });

    // Key teachings (grouped — individual bullets are too short to embed alone)
    if (Array.isArray(f.keyTeachings) && f.keyTeachings.length) {
      push({
        id: `father_teaching:${f.id}`,
        type: 'father_teaching',
        title: `${f.name} — Key Teachings`,
        text: clean(`Key teachings of ${f.name}: ${f.keyTeachings.join(' • ')}`),
        metadata: meta,
      });
    }

    // Notable quote — a VERIFIED, attributable quotation
    if (f.notableQuote?.text) {
      push({
        id: `father_quote:${f.id}`,
        type: 'father_quote',
        title: `${f.name} — Quotation`,
        text: clean(f.notableQuote.text),
        source: clean(f.notableQuote.source),
        verified: true,
        metadata: { ...meta, attribution: f.name },
      });
    }

    // Works (from extended)
    (ext.works ?? []).forEach((w, i) => {
      push({
        id: `father_work:${f.id}:${i}`,
        type: 'father_work',
        title: `${f.name} — ${w.title}`,
        text: clean(`${w.title} (${w.date ?? 'date unknown'}) by ${f.name}: ${w.description}`),
        source: clean(w.title),
        metadata: { ...meta, work_title: w.title, date: w.date },
      });
    });
  }
}

// ── GLOSSARY ──────────────────────────────────────────────────
async function exportGlossary() {
  const { GLOSSARY } = await load('glossary.js');
  for (const g of GLOSSARY) {
    push({
      id: `glossary:${slug(g.term)}`,
      type: 'glossary',
      title: g.term,
      text: clean(`${g.term}${g.pronunciation ? ` (${g.pronunciation})` : ''}: ${g.definition}`),
      metadata: { term: g.term, category: g.category, ar: g.ar },
    });
  }
}

// ── SAINTS ────────────────────────────────────────────────────
async function exportSaints() {
  const { SAINTS } = await load('saints.js');
  for (const s of SAINTS) {
    const meta = {
      id: s.id, name: s.name, category: s.category,
      copticMonth: s.copticMonth, copticDay: s.copticDay,
      feast: s.feast, died: s.died,
    };
    push({
      id: `saint:${s.id}`,
      type: 'saint',
      title: s.name,
      text: clean(`${s.name}, ${s.subtitle} (died ${s.died}). Feast: ${s.feast}. ${s.bio}`),
      metadata: meta,
    });

    if (s.quote) {
      const { quote, attribution } = splitQuote(s.quote);
      push({
        id: `saint_quote:${s.id}`,
        type: 'saint_quote',
        title: `${s.name} — Quotation`,
        text: quote,
        source: attribution,
        verified: true,
        metadata: { ...meta, attribution: attribution || s.name },
      });
    }
  }
}

// ── SCRIPTURE INDEX ───────────────────────────────────────────
async function exportScripture() {
  const { SCRIPTURE_INDEX } = await load('scriptureIndex.js');
  for (const [book, entries] of Object.entries(SCRIPTURE_INDEX)) {
    entries.forEach((e, i) => {
      push({
        id: `scripture:${slug(e.ref)}:${i}`,
        type: 'scripture',
        title: e.ref,
        text: clean(`${e.ref} — ${e.text}`),
        source: e.ref,
        metadata: { ref: e.ref, book, sectionId: e.sectionId, sectionTitle: e.sectionTitle },
      });
    });
  }
}

// ── LECTIONARY ────────────────────────────────────────────────
async function exportLectionary() {
  const { FEAST_READINGS, WEEKLY_READINGS } = await load('lectionary.js');
  const readingsLine = (r) =>
    [`Pauline: ${r.pauline}`, `Catholic: ${r.catholic}`, `Acts: ${r.acts}`, `Gospel: ${r.gospel}`]
      .filter((x) => !/undefined/.test(x)).join('; ');

  for (const [key, r] of Object.entries(FEAST_READINGS)) {
    push({
      id: `lectionary_feast:${key}`,
      type: 'lectionary_feast',
      title: r.feast,
      text: clean(`${r.feast}${r.season ? ` (${r.season})` : ''}. Readings — ${readingsLine(r)}.${r.note ? ' ' + r.note : ''}`),
      metadata: { key, feast: r.feast, season: r.season, refs: { pauline: r.pauline, catholic: r.catholic, acts: r.acts, gospel: r.gospel } },
    });
  }

  const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  WEEKLY_READINGS.forEach((r, i) => {
    push({
      id: `lectionary_weekly:${i}`,
      type: 'lectionary_weekly',
      title: `${DOW[i] ?? `Day ${i}`} — ${r.theme}`,
      text: clean(`${DOW[i] ?? `Day ${i}`} weekly readings, theme "${r.theme}" — ${readingsLine(r)}.`),
      metadata: { dayOfWeek: i, day: DOW[i], theme: r.theme, refs: { pauline: r.pauline, catholic: r.catholic, acts: r.acts, gospel: r.gospel } },
    });
  });
}

// ── READING LIST ──────────────────────────────────────────────
async function exportReadingList() {
  const { READING_LIST } = await load('readingList.js');
  for (const [group, items] of Object.entries(READING_LIST)) {
    items.forEach((it, i) => {
      const label = it.title ?? it.name;
      push({
        id: `reading:${group}:${i}`,
        type: 'reading',
        title: label,
        text: clean(`${label}${it.author ? ` by ${it.author}` : ''}${it.year ? ` (${it.year})` : ''}. ${it.note ?? ''}`),
        source: [it.author, it.publisher].filter(Boolean).join(', '),
        metadata: { group, category: it.category, author: it.author, year: it.year, publisher: it.publisher, available: it.available },
      });
    });
  }
}

function slug(s) {
  return clean(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── main ──────────────────────────────────────────────────────
async function main() {
  await exportFathers();
  await exportGlossary();
  await exportSaints();
  await exportScripture();
  await exportLectionary();
  await exportReadingList();

  // Guard against duplicate ids (would collide on upsert).
  const seen = new Set();
  for (const c of chunks) {
    if (seen.has(c.id)) throw new Error(`Duplicate chunk id: ${c.id}`);
    seen.add(c.id);
  }

  await mkdir(OUT, { recursive: true });

  const jsonl = chunks.map((c) => JSON.stringify(c)).join('\n') + '\n';
  await writeFile(resolve(OUT, 'corpus.jsonl'), jsonl);

  const quotes = chunks.filter((c) => c.verified);
  await writeFile(resolve(OUT, 'verified_quotes.json'), JSON.stringify(quotes, null, 2));

  const byType = {};
  let maxChars = 0, totalChars = 0;
  for (const c of chunks) {
    byType[c.type] = (byType[c.type] ?? 0) + 1;
    totalChars += c.text.length;
    if (c.text.length > maxChars) maxChars = c.text.length;
  }
  const manifest = {
    generatedAt: new Date().toISOString(),
    totalChunks: chunks.length,
    verifiedQuotes: quotes.length,
    byType,
    charStats: { total: totalChars, avg: Math.round(totalChars / chunks.length), max: maxChars },
    schema: 'id, type, title, text, source, verified, metadata',
  };
  await writeFile(resolve(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // ── report ──
  console.log(`\n  Corpus exported → ${OUT}\n`);
  console.log(`  ${'type'.padEnd(20)} count`);
  console.log(`  ${'─'.repeat(20)} ─────`);
  for (const [t, n] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t.padEnd(20)} ${String(n).padStart(5)}`);
  }
  console.log(`  ${'─'.repeat(20)} ─────`);
  console.log(`  ${'TOTAL'.padEnd(20)} ${String(chunks.length).padStart(5)}`);
  console.log(`\n  Verified quotes: ${quotes.length}`);
  console.log(`  Chars: avg ${manifest.charStats.avg}, max ${manifest.charStats.max}\n`);
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
