const MAX_WORDS = 5;

/** Split word timings into short caption lines, breaking after punctuation. */
export function chunkWords(words, skip) {
  const chunks = [];
  let current = [];
  words.forEach((w, i) => {
    if (i >= skip[0] && i <= skip[1]) {
      if (current.length) chunks.push(current);
      current = [];
      return;
    }
    current.push({ ...w, index: i });
    if (current.length >= MAX_WORDS || /[.,;:?!]$/.test(w.text)) {
      chunks.push(current);
      current = [];
    }
  });
  if (current.length) chunks.push(current);
  return chunks;
}
