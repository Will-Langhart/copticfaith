// Step 3 — narration script from Claude. Claude writes the framing lines and picks
// which verses to quote; the verse text itself is always the exact WEB text.
import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';
export const CLOSING = 'Read more on copticfaith.';

// ~2.5 spoken words per second → 35–45 seconds.
export const WORDS_MIN = 88;
export const WORDS_MAX = 115;
const VERSE_WORDS_MAX = 40;

const SYSTEM = `You write short daily narrations for copticfaith, a Coptic Orthodox Christian reference site, voiced as 35–45 second vertical videos.

Voice: reverent, calm, warm and plain. No hype, no exclamation marks, no emojis, no hashtags, no rhetorical hooks like "you won't believe". Speak as a quiet guide, not a preacher.

Faithfulness: stay within Coptic Orthodox teaching. Use only the facts in the saint record you are given — do not add dates, miracles, places or titles that are not in it. If something is uncertain in the record (e.g. "c." dates, "tradition holds"), keep that hedge. Refer to saints as "Saint …".

Write for the ear: short sentences, no parentheses, no abbreviations ("Saint", not "St."; "around the year 84", not "c. 84 AD"), no Bible-reference punctuation like "1:35".`;

function countWords(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'opening', 'saint', 'verse_intro', 'verse_numbers', 'reflection'],
  properties: {
    title: { type: 'string', description: 'On-screen title, at most 6 words: the saint\'s name, or the feast or theme when there is no saint.' },
    opening: { type: 'string', description: 'One opening sentence naming the Coptic date and who or what is remembered today.' },
    saint: { type: 'string', description: 'Two or three sentences: who the saint was and why the Church remembers them.' },
    verse_intro: { type: 'string', description: 'A short lead-in to the Gospel verse, e.g. "From today\'s Gospel, according to Saint John:"' },
    verse_numbers: { type: 'array', items: { type: 'integer' }, description: 'One to three consecutive verse numbers from the provided passage.' },
    reflection: { type: 'string', description: 'One sentence of quiet reflection connecting the saint and the verse.' },
  },
};

function buildPrompt(coptic, content, feedback) {
  const { saint, gospel } = content;
  const lines = [
    `Coptic date: ${coptic.day} ${coptic.monthName} (Gregorian ${coptic.gregorian}).`,
    coptic.feast ? `Feast: ${coptic.feast}.` : null,
    coptic.fast ? `Fast: ${coptic.fast}.` : null,
    '',
    saint
      ? [
          'Saint record (the only facts you may use about the saint):',
          `- Name: ${saint.name}`,
          `- Title: ${saint.subtitle}`,
          `- Died: ${saint.died}`,
          `- Commemoration: ${saint.feast}`,
          `- Life: ${saint.bio}`,
          content.alsoCommemorated.length ? `Also commemorated today (mention at most in passing): ${content.alsoCommemorated.join(', ')}` : null,
        ].filter(Boolean).join('\n')
      : `There is no saint record for this day. In the "saint" field, speak instead about ${coptic.feast ? 'the feast' : `the day's theme, "${coptic.readings.theme}"`}, and do not name any saint.`,
    '',
    `Today's Gospel: ${gospel.ref} (${gospel.translation}). Verses:`,
    ...gospel.verses.map((v) => `${v.verse}. ${v.text}`),
    '',
    `Pick one to three consecutive verses (at most ${VERSE_WORDS_MAX} words in total) that speak to the day. The verse text will be read exactly as given, so do not quote it in other fields.`,
    `The narration is: opening, saint, verse_intro, the verses, reflection, then the fixed closing "${CLOSING}". The whole narration including the verses and closing must be ${WORDS_MIN}–${WORDS_MAX} words.`,
  ];
  if (feedback) lines.push('', `Your previous attempt had a problem: ${feedback} Please fix it.`);
  return lines.filter((l) => l !== null).join('\n');
}

/** Turn Claude's fields into ordered narration segments, inserting the exact verse text. */
export function assembleSegments(fields, gospel) {
  const nums = fields.verse_numbers;
  const verses = nums.map((n) => gospel.verses.find((v) => v.verse === n));
  if (!nums.length || nums.length > 3) throw new Error('pick one to three verses');
  if (verses.some((v) => !v)) throw new Error(`verse numbers ${nums.join(', ')} are not all in the passage`);
  if (nums.some((n, i) => i > 0 && n !== nums[i - 1] + 1)) throw new Error('verses must be consecutive');
  const verseText = verses.map((v) => v.text).join(' ');
  if (countWords(verseText) > VERSE_WORDS_MAX) throw new Error(`the verses are over ${VERSE_WORDS_MAX} words`);

  const first = verses[0];
  const last = verses[verses.length - 1];
  const verseRef = `${first.book} ${first.chapter}:${first.verse}${last.verse !== first.verse ? `–${last.verse}` : ''}`;
  return {
    verseRef,
    verseText,
    segments: [
      { id: 'opening', text: fields.opening },
      { id: 'saint', text: fields.saint },
      { id: 'verse', text: `${fields.verse_intro} ${verseText}` },
      { id: 'reflection', text: fields.reflection },
      { id: 'closing', text: CLOSING },
    ],
  };
}

export async function writeScript(coptic, content) {
  const client = new Anthropic();
  let feedback = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
      system: SYSTEM,
      messages: [{ role: 'user', content: buildPrompt(coptic, content, feedback) }],
    });
    if (response.stop_reason === 'refusal') {
      throw new Error(`Claude declined the script request (${response.stop_details?.category ?? 'no category'})`);
    }
    const text = response.content.find((b) => b.type === 'text')?.text;
    const fields = JSON.parse(text);

    try {
      const assembled = assembleSegments(fields, content.gospel);
      const narration = assembled.segments.map((s) => s.text).join(' ');
      const words = countWords(narration);
      if (words < WORDS_MIN || words > WORDS_MAX) {
        throw new Error(`the narration is ${words} words; it must be ${WORDS_MIN}–${WORDS_MAX}`);
      }
      return { model: response.model, title: fields.title, ...assembled, narration, words };
    } catch (err) {
      feedback = `${err.message}.`;
      console.warn(`  script attempt ${attempt}: ${feedback}`);
    }
  }
  throw new Error(`Could not get a valid script after 3 attempts (${feedback})`);
}
