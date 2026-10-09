/**
 * Coptic (Alexandrian) Paschalion.
 *
 * The Coptic Church reckons Pascha with the Julian computus, then the date is
 * shifted into the Gregorian calendar. All moveable feasts are fixed offsets
 * (in days) from Pascha.
 */

/** Gregorian Date (local midnight) of Coptic Pascha for a Gregorian year. */
export function getCopticPascha(year) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31); // Julian month (3 = March, 4 = April)
  const day = ((d + e + 114) % 31) + 1;          // Julian day of month

  // Julian → Gregorian offset (13 days for 1900–2099).
  const offset = Math.floor(year / 100) - Math.floor(year / 400) - 2;
  return new Date(year, month - 1, day + offset);
}

/** Whole days from Pascha (of the same Gregorian year) to `date`. Negative = before. */
export function daysFromPascha(date) {
  const pascha = getCopticPascha(date.getFullYear());
  const toUTC = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((toUTC(date) - toUTC(pascha)) / 86400000);
}
