// Step 4 — ElevenLabs text-to-speech with character timestamps → mp3 + word timings.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const API = 'https://api.elevenlabs.io/v1/text-to-speech';

/**
 * Group ElevenLabs character timings into words.
 * alignment: { characters[], character_start_times_seconds[], character_end_times_seconds[] }
 * Returns [{ text, start, end, charStart }] where charStart indexes the narration text.
 */
export function charsToWords(alignment) {
  const { characters, character_start_times_seconds: starts, character_end_times_seconds: ends } = alignment;
  const words = [];
  let current = null;
  characters.forEach((ch, i) => {
    if (/\s/.test(ch)) {
      current = null;
      return;
    }
    if (!current) {
      current = { text: '', start: starts[i], end: ends[i], charStart: i };
      words.push(current);
    }
    current.text += ch;
    current.end = ends[i];
  });
  return words;
}

/** Start/end time of each script segment, from where its text sits in the narration. */
export function segmentTimings(segments, words) {
  let offset = 0;
  return segments.map((seg) => {
    const charStart = offset;
    const charEnd = offset + seg.text.length;
    offset = charEnd + 1; // segments are joined with a single space
    const inSeg = words.filter((w) => w.charStart >= charStart && w.charStart < charEnd);
    return { id: seg.id, start: inSeg[0].start, end: inSeg[inSeg.length - 1].end };
  });
}

export async function synthesize(script, outDir) {
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const modelId = process.env.ELEVENLABS_MODEL_ID;
  if (!process.env.ELEVENLABS_API_KEY || !voiceId || !modelId) {
    throw new Error('Set ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID and ELEVENLABS_MODEL_ID in .env');
  }
  const res = await fetch(`${API}/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ text: script.narration, model_id: modelId }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  const { audio_base64: audio, alignment } = await res.json();

  if (alignment.characters.join('') !== script.narration) {
    throw new Error('ElevenLabs alignment does not match the narration text');
  }
  const words = charsToWords(alignment);
  const timings = {
    voiceId,
    modelId,
    duration: words[words.length - 1].end,
    words,
    segments: segmentTimings(script.segments, words),
  };
  await writeFile(path.join(outDir, 'public/narration.mp3'), Buffer.from(audio, 'base64'));
  await writeFile(path.join(outDir, 'timings.json'), JSON.stringify(timings, null, 2));
  return timings;
}
