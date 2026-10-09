import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getFast } from './fasts.js';

// 2026: Pascha 12 April, Pentecost 31 May.
const fast = (y, m, d) => getFast(new Date(y, m - 1, d));

test("Jonah's Fast is Mon–Wed two weeks before Great Lent", () => {
  assert.equal(fast(2026, 2, 1), null);
  assert.equal(fast(2026, 2, 2), "Jonah's Fast");
  assert.equal(fast(2026, 2, 4), "Jonah's Fast");
  assert.equal(fast(2026, 2, 5), null); // Feast of Jonah (a Thursday)
});

test('Great Lent and Holy Week run 55 days up to Pascha', () => {
  assert.equal(fast(2026, 2, 16), 'Great Lent');
  assert.equal(fast(2026, 4, 4), 'Great Lent');
  assert.equal(fast(2026, 4, 5), 'Holy Week');  // Palm Sunday
  assert.equal(fast(2026, 4, 11), 'Holy Week'); // Holy Saturday
  assert.equal(fast(2026, 4, 12), null);        // Pascha
});

test('no fasting in the Holy Fifty Days, even on Wednesday and Friday', () => {
  assert.equal(fast(2026, 4, 15), null); // Wednesday
  assert.equal(fast(2026, 5, 29), null); // Friday
});

test("Apostles' Fast runs from the day after Pentecost to 4 Abib", () => {
  assert.equal(fast(2026, 6, 1), "Apostles' Fast");
  assert.equal(fast(2026, 7, 11), "Apostles' Fast"); // 4 Abib
  assert.equal(fast(2026, 7, 12), null);             // 5 Abib, Sts. Peter & Paul (a Sunday)
});

test('fixed fasts follow the Coptic calendar', () => {
  assert.equal(fast(2026, 8, 7), 'Fast of the Virgin');   // 1 Misra
  assert.equal(fast(2026, 8, 21), 'Fast of the Virgin');  // 15 Misra
  assert.equal(fast(2026, 8, 22), null);                  // Assumption (a Saturday)
  assert.equal(fast(2026, 11, 25), 'Nativity Fast');      // 16 Hatour
  assert.equal(fast(2027, 1, 6), 'Nativity Fast');        // 28 Kiahk
  assert.equal(fast(2026, 1, 18), 'Paramoun of Theophany');
});

test('Wednesday and Friday fasts, except on Nativity and Theophany', () => {
  assert.equal(fast(2026, 10, 7), 'Wednesday Fast');
  assert.equal(fast(2026, 10, 8), null);
  assert.equal(fast(2026, 10, 9), 'Friday Fast');
  assert.equal(fast(2026, 1, 7), null); // Nativity, a Wednesday
});
