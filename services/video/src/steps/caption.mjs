// Step 7 — the post caption for Instagram / Facebook.
import { SITE_URL } from './shots.mjs';

const BASE_TAGS = ['#CopticOrthodox', '#Synaxarium', '#SaintOfTheDay', '#DailyGospel', '#OrthodoxChristianity'];

/** "St. Luke the Apostle & Evangelist" → "#StLuke" */
export function saintHashtag(name) {
  const short = name.replace(/^St\.?\s+/, '').split(/\s+(?:the|of|&|and)\s+|,/)[0];
  return `#St${short.replace(/[^A-Za-z]/g, '')}`;
}

export function buildCaption(coptic, content, script) {
  const { saint } = content;
  const heading = saint ? `${saint.name} — ${coptic.day} ${coptic.monthName}` : `${script.title} — ${coptic.day} ${coptic.monthName}`;
  const tags = saint ? [...BASE_TAGS, saintHashtag(saint.name)] : BASE_TAGS;
  return [
    heading,
    saint ? saint.subtitle : coptic.feast ?? coptic.readings.theme,
    '',
    `Today's Gospel: ${content.gospel.ref}`,
    `“${script.verseText}” (${script.verseRef}, WEB)`,
    '',
    `Read more on copticfaith: ${SITE_URL}${content.paths.saint}`,
    '',
    tags.join(' '),
  ].join('\n');
}
