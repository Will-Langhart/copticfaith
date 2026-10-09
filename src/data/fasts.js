/**
 * Coptic fasting calendar.
 *
 * Moveable fasts are reckoned from Pascha (see pascha.js); fixed fasts from
 * the Coptic calendar date.
 */

import { daysFromPascha } from './pascha.js';
import { gregorianToCoptic } from './saints.js';

/** Name of the fast observed on `date`, or null if it is not a fasting day. */
export function getFast(date) {
  const p = daysFromPascha(date);
  const { month, day } = gregorianToCoptic(date);

  // Moveable fasts
  if (p >= -69 && p <= -67) return "Jonah's Fast";        // Mon–Wed, two weeks before Lent
  if (p >= -55 && p <= -8) return 'Great Lent';            // with Holy Week, 55 days
  if (p >= -7 && p <= -1) return 'Holy Week';              // Palm Sunday – Holy Saturday
  if (p >= 0 && p <= 49) return null;                      // Holy Fifty Days: no fasting
  if (p >= 50 && (month === 9 || month === 10 || (month === 11 && day <= 4))) {
    return "Apostles' Fast";                               // Mon after Pentecost – 4 Abib
  }

  // Fixed fasts
  if ((month === 3 && day >= 16) || (month === 4 && day <= 28)) return 'Nativity Fast'; // 16 Hatour – 28 Kiahk
  if (month === 5 && day === 10) return 'Paramoun of Theophany';                         // 10 Tobi
  if (month === 12 && day <= 15) return 'Fast of the Virgin';                            // 1–15 Misra

  // Weekly fasts — not kept on the feasts of Nativity or Theophany
  const isNativityOrTheophany = (month === 4 && day === 29) || (month === 5 && day === 11);
  if (!isNativityOrTheophany) {
    if (date.getDay() === 3) return 'Wednesday Fast';
    if (date.getDay() === 5) return 'Friday Fast';
  }
  return null;
}
