import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gregorianToCoptic } from './saints.js';

const coptic = (y, m, d) => {
  const { month, day } = gregorianToCoptic(new Date(y, m - 1, d));
  return `${day}/${month}`;
};

test('gregorianToCoptic converts across the whole year', () => {
  assert.equal(coptic(2026, 9, 11), '1/1');    // 1 Tout (Nayrouz)
  assert.equal(coptic(2026, 10, 8), '28/1');   // was returned as Nasi before
  assert.equal(coptic(2026, 11, 25), '16/3');  // 16 Hatour — Nativity Fast begins
  assert.equal(coptic(2026, 1, 7), '29/4');    // 29 Kiahk — Nativity
  assert.equal(coptic(2026, 1, 19), '11/5');   // 11 Tobi — Theophany
  assert.equal(coptic(2026, 4, 12), '4/8');    // 4 Baramouda
  assert.equal(coptic(2026, 9, 10), '5/13');   // last day of Nasi
});

test('gregorianToCoptic handles the sixth day of Nasi in Coptic leap years', () => {
  assert.equal(coptic(2027, 9, 11), '6/13');
  assert.equal(coptic(2027, 9, 12), '1/1');
});
