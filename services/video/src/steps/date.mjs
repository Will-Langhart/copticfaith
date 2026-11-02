// Step 1 — Gregorian → Coptic date, feast and fast season.
// Reuses the site's own calendar code so the video always agrees with copticfaith.
import { gregorianToCoptic } from '../../../../src/data/saints.js';
import { getReadingsForDay } from '../../../../src/data/lectionary.js';

/** Parse "YYYY-MM-DD" into a local-midnight Date (the site's data works in local dates). */
export function parseDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`--date must be YYYY-MM-DD, got "${iso}"`);
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (date.getMonth() !== Number(m[2]) - 1) throw new Error(`Invalid date: ${iso}`);
  return date;
}

export function toISODate(date) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

/**
 * Coptic year (Anno Martyrum). 1 Tout falls on Sept 11/12, so Sept–Dec dates in
 * months Tout…Kiahk belong to the year that began this autumn.
 */
export function copticYear(date, copticMonth) {
  const y = date.getFullYear();
  return date.getMonth() >= 8 && copticMonth <= 4 ? y - 283 : y - 284;
}

export function getCopticDay(date) {
  const { month, day, monthName } = gregorianToCoptic(date);
  const year = copticYear(date, month);
  const readings = getReadingsForDay(date, month, day);
  return {
    gregorian: toISODate(date),
    month,
    day,
    monthName,
    year,
    label: `${day} ${monthName} ${year} A.M.`,
    feast: readings.isFeast ? readings.feast : null,
    fast: readings.fast ?? null,
    season: readings.isFeast ? readings.season : (readings.fast ?? null),
    readings,
  };
}
