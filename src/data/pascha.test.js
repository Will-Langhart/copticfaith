import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCopticPascha, daysFromPascha } from './pascha.js';
import { getReadingsForDay } from './lectionary.js';

const ymd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Published Coptic / Eastern Orthodox Pascha dates.
const KNOWN_PASCHA = {
  2000: '2000-04-30',
  2010: '2010-04-04',
  2021: '2021-05-02',
  2022: '2022-04-24',
  2023: '2023-04-16',
  2024: '2024-05-05',
  2025: '2025-04-20',
  2026: '2026-04-12',
  2027: '2027-05-02',
  2028: '2028-04-16',
  2029: '2029-04-08',
  2030: '2030-04-28',
};

test('getCopticPascha matches published dates', () => {
  for (const [year, expected] of Object.entries(KNOWN_PASCHA)) {
    const pascha = getCopticPascha(Number(year));
    assert.equal(ymd(pascha), expected, `Pascha ${year}`);
    assert.equal(pascha.getDay(), 0, `Pascha ${year} is a Sunday`);
  }
});

test('daysFromPascha counts calendar days, ignoring time of day', () => {
  assert.equal(daysFromPascha(new Date(2026, 3, 12, 23, 59)), 0);
  assert.equal(daysFromPascha(new Date(2026, 3, 5)), -7);
  assert.equal(daysFromPascha(new Date(2026, 4, 31)), 49);
});

test('moveable feasts land on the right days', () => {
  // Coptic month/day args are irrelevant here; pass a date with no fixed feast.
  const feastOn = (y, m, d) => getReadingsForDay(new Date(y, m - 1, d), 1, 2).feast;
  assert.equal(feastOn(2026, 4, 5), 'Palm Sunday — Entry into Jerusalem');
  assert.equal(feastOn(2026, 4, 10), 'Great Friday (Good Friday)');
  assert.equal(feastOn(2026, 4, 11), 'Holy Saturday — The Resurrection Vigil');
  assert.equal(feastOn(2026, 4, 12), 'The Holy Resurrection (Pascha)');
  assert.equal(feastOn(2026, 5, 21), 'Ascension of our Lord Jesus Christ');
  assert.equal(feastOn(2026, 5, 31), 'Pentecost — Descent of the Holy Spirit');
  assert.equal(feastOn(2024, 5, 5), 'The Holy Resurrection (Pascha)');
});

test('the old fixed Coptic dates no longer produce Pascha', () => {
  // 15 Baramouda 1742 = 23 April 2026 — previously hardcoded as Pascha.
  const r = getReadingsForDay(new Date(2026, 3, 23), 8, 15);
  assert.equal(r.isFeast, false);
});
