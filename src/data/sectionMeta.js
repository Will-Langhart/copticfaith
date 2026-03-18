// Reading times estimated at 200 wpm for dense theological text
export const SECTIONS = [
  { id: 'hero',       title: 'Home',                                              wordCount: 80,   readingMinutes: 1  },
  { id: 'note',       title: 'A Note to the Protestant Reader',                   wordCount: 220,  readingMinutes: 2  },
  { id: 'foundation', title: 'Part One: Biblical Foundation',                     wordCount: 680,  readingMinutes: 4  },
  { id: 'historical', title: 'Part Two: Historical Evidence',                     wordCount: 720,  readingMinutes: 4  },
  { id: 'doctrines',  title: 'Part Three: The Doctrines',                         wordCount: 760,  readingMinutes: 4  },
  { id: 'eucharist',  title: 'Part Four: Holy Eucharist',                         wordCount: 900,  readingMinutes: 5  },
  { id: 'mysteries',  title: 'Part Five: Seven Holy Mysteries',                   wordCount: 860,  readingMinutes: 5  },
  { id: 'fasting',    title: 'Part Six: Fasting',                                 wordCount: 600,  readingMinutes: 3  },
  { id: 'saints',     title: 'Part Seven: Intercession of Saints',                wordCount: 640,  readingMinutes: 4  },
  { id: 'types',      title: 'Parts Eight & Nine: OT Types & Monasticism',        wordCount: 700,  readingMinutes: 4  },
  { id: 'liturgy',    title: 'Parts Ten & Eleven: Liturgy & Unbroken Chain',      wordCount: 740,  readingMinutes: 4  },
  { id: 'conclusion', title: 'Conclusion & Appendices',                           wordCount: 1400, readingMinutes: 7  },
];

export const TOTAL_READING_MINUTES = SECTIONS.reduce((sum, s) => sum + s.readingMinutes, 0);

// Short labels used in the header nav tabs
export const SHORT_LABELS = {
  hero:       'Home',
  note:       'Note',
  foundation: 'Biblical',
  historical: 'History',
  doctrines:  'Doctrines',
  eucharist:  'Eucharist',
  mysteries:  'Mysteries',
  fasting:    'Fasting',
  saints:     'Saints',
  types:      'Types',
  liturgy:    'Liturgy',
  conclusion: 'Conclusion',
};
