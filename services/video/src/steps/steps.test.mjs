import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copticYear, getCopticDay, parseDate } from './date.mjs';
import { charsToWords, segmentTimings } from './voice.mjs';
import { assembleSegments } from './script.mjs';
import { saintHashtag } from './caption.mjs';
import { chunkWords } from '../../remotion/chunkWords.js';

test('Coptic date and year', () => {
  const day = getCopticDay(parseDate('2026-11-01'));
  assert.equal(day.label, '22 Baba 1743 A.M.');
  assert.equal(copticYear(parseDate('2027-01-07'), 4), 1743); // Nativity, 29 Kiahk
  assert.equal(copticYear(parseDate('2026-09-11'), 1), 1743); // 1 Tout
  assert.equal(copticYear(parseDate('2026-09-10'), 13), 1742); // Nasi
});

test('rejects malformed dates', () => {
  assert.throws(() => parseDate('2026-13-01'));
  assert.throws(() => parseDate('11/01/2026'));
});

function alignmentFor(text) {
  const chars = [...text];
  return {
    characters: chars,
    character_start_times_seconds: chars.map((_, i) => i * 0.5),
    character_end_times_seconds: chars.map((_, i) => i * 0.5 + 0.5),
  };
}

test('character timings group into words and segments', () => {
  const segments = [{ id: 'a', text: 'Peace be' }, { id: 'b', text: 'with you.' }];
  const words = charsToWords(alignmentFor(segments.map((s) => s.text).join(' ')));
  assert.deepEqual(words.map((w) => w.text), ['Peace', 'be', 'with', 'you.']);
  assert.equal(words[1].start, 3);
  const timings = segmentTimings(segments, words);
  assert.deepEqual(timings.map((t) => t.id), ['a', 'b']);
  assert.equal(timings[1].start, 4.5);
});

const gospel = {
  verses: [
    { book: 'John', chapter: 20, verse: 1, text: 'Now on the first day of the week...' },
    { book: 'John', chapter: 20, verse: 2, text: 'Therefore she ran.' },
    { book: 'John', chapter: 20, verse: 3, text: 'Therefore Peter went out.' },
  ],
};
const fields = { opening: 'O.', saint: 'S.', verse_intro: 'From John:', reflection: 'R.' };

test('verse text comes from the passage, not the model', () => {
  const out = assembleSegments({ ...fields, verse_numbers: [2, 3] }, gospel);
  assert.equal(out.verseRef, 'John 20:2–3');
  assert.equal(out.verseText, 'Therefore she ran. Therefore Peter went out.');
  assert.equal(out.segments.at(-1).text, 'Read more on copticfaith.');
});

test('rejects verses outside the passage or out of order', () => {
  assert.throws(() => assembleSegments({ ...fields, verse_numbers: [9] }, gospel));
  assert.throws(() => assembleSegments({ ...fields, verse_numbers: [1, 3] }, gospel));
});

test('caption hashtag from saint name', () => {
  assert.equal(saintHashtag('St. Luke the Apostle & Evangelist'), '#StLuke');
  assert.equal(saintHashtag('St. Cyril of Alexandria'), '#StCyril');
});

test('caption lines skip the on-screen verse', () => {
  const words = 'One two. Three four five six seven eight'.split(' ').map((text, i) => ({ text, start: i, end: i + 1 }));
  const chunks = chunkWords(words, [2, 3]);
  assert.deepEqual(chunks.map((c) => c.map((w) => w.text).join(' ')), ['One two.', 'five six seven eight']);
});
