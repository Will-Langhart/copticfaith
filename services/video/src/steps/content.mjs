// Step 2 — the day's Synaxarium commemoration and Gospel reading, from the repo's data,
// with the Gospel text fetched in the World English Bible (public domain).
import { getSaintsForDay } from '../../../../src/data/saints.js';
import { FATHERS } from '../../../../src/data/fathers.js';

// Same service and translation the Daily Readings page uses.
const BIBLE_API = 'https://bible-api.com';
const TRANSLATION = 'web';

/** Site path that best matches a saint: a Father profile if one exists, else the calendar. */
export function saintPath(saint) {
  if (saint && FATHERS.some((f) => f.id === saint.id)) return `/fathers/${saint.id}`;
  return '/saints-calendar';
}

export async function fetchPassage(ref) {
  const res = await fetch(`${BIBLE_API}/${encodeURIComponent(ref)}?translation=${TRANSLATION}`);
  if (!res.ok) throw new Error(`bible-api.com ${res.status} for "${ref}"`);
  const data = await res.json();
  if (data.translation_id !== TRANSLATION) {
    throw new Error(`Expected the WEB translation, got "${data.translation_id}"`);
  }
  return {
    ref: data.reference,
    translation: data.translation_name,
    verses: data.verses.map((v) => ({
      book: v.book_name,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text.replace(/\s+/g, ' ').trim(),
    })),
  };
}

export async function getDayContent(coptic) {
  const [saint, ...alsoCommemorated] = getSaintsForDay(coptic.month, coptic.day);
  const { readings } = coptic;
  const gospel = await fetchPassage(readings.gospel);
  return {
    saint: saint ?? null,
    alsoCommemorated: alsoCommemorated.map((s) => s.name),
    gospelRef: readings.gospel,
    // Fixed feasts carry their own readings; other days use the site's weekly cycle.
    readingSource: readings.isFeast ? `Feast: ${readings.feast}` : `Weekly cycle: ${readings.theme}`,
    gospel,
    paths: { saint: saintPath(saint), readings: '/daily-readings', home: '/' },
  };
}
