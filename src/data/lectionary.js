/**
 * Coptic Daily Lectionary
 *
 * FEAST_READINGS: keyed by `${copticMonth}-${copticDay}` for fixed feast days.
 * WEEKLY_READINGS: fallback cycle by day-of-week (0=Sun … 6=Sat).
 * SEASON_READINGS: overrides for major liturgical seasons (Holy Week, etc.)
 *
 * Scripture references use bible-api.com format: "Book chapter:verse[-verse]"
 * Multiple passages separated by semicolons (fetched individually).
 */

export const FEAST_READINGS = {

  /* ── GREAT FEASTS OF THE LORD ──────────────────────────────── */

  // Annunciation — 29 Baramhat
  '7-29': {
    feast: 'Annunciation of the Archangel Gabriel',
    season: 'Great Feast of the Lord',
    pauline: 'Hebrews 2:14-18',
    catholic: '1 John 4:2-4',
    acts: 'Acts 1:6-14',
    gospel: 'Luke 1:26-38',
    note: 'The Archangel Gabriel announces to the Virgin Mary that she will bear the Son of God.',
  },

  // Nativity — 29 Kiahk
  '4-29': {
    feast: 'Nativity of our Lord Jesus Christ',
    season: 'Great Feast of the Lord',
    pauline: 'Galatians 4:1-7',
    catholic: '1 John 4:9-14',
    acts: 'Acts 13:16-26',
    gospel: 'Matthew 1:18-25',
    note: 'The eternal Word takes flesh and dwells among us.',
  },

  // Theophany / Epiphany — 11 Tobi
  '5-11': {
    feast: 'Theophany (Epiphany) — Baptism of our Lord',
    season: 'Great Feast of the Lord',
    pauline: 'Titus 2:11-14',
    catholic: '1 John 5:4-10',
    acts: 'Acts 19:1-7',
    gospel: 'Matthew 3:13-17',
    note: 'The Holy Trinity is revealed at the baptism of Christ in the Jordan.',
  },

  // Entry into Egypt — 24 Bashans
  '9-24': {
    feast: 'Entry of the Holy Family into Egypt',
    season: 'Feast of the Lord',
    pauline: 'Hebrews 11:8-10',
    catholic: 'James 1:2-8',
    acts: 'Acts 7:9-15',
    gospel: 'Matthew 2:13-23',
    note: 'Christ hallows the land of Egypt, fulfilling "Out of Egypt I called my Son."',
  },

  // Palm Sunday — moveable, but fixed in Coptic reckoning to 1 day before Pascha week
  // We approximate: Baramouda 8 in a typical year (use season override for Holy Week)
  '8-8': {
    feast: 'Palm Sunday — Entry into Jerusalem',
    season: 'Holy Week',
    pauline: 'Philippians 2:5-11',
    catholic: 'Hebrews 9:11-14',
    acts: 'Acts 2:36-41',
    gospel: 'John 12:12-19',
    note: 'Christ enters Jerusalem as King, riding on a donkey in fulfillment of the prophet Zechariah.',
  },

  // Good Friday — approximate Baramouda 13
  '8-13': {
    feast: 'Great Friday (Good Friday)',
    season: 'Holy Week',
    pauline: 'Hebrews 10:1-10',
    catholic: '1 Peter 2:19-25',
    acts: 'Acts 3:12-26',
    gospel: 'John 19:17-37',
    note: 'The Lamb of God is crucified for the sins of the world.',
  },

  // Holy Saturday — Baramouda 14
  '8-14': {
    feast: 'Holy Saturday — The Resurrection Vigil',
    season: 'Holy Week',
    pauline: 'Romans 6:3-11',
    catholic: '1 Peter 3:18-22',
    acts: 'Acts 2:22-32',
    gospel: 'Matthew 28:1-10',
    note: 'Christ descends to Hades and rises, trampling death by death.',
  },

  // Feast of Resurrection (Pascha) — Baramouda 15 (approximate)
  '8-15': {
    feast: 'The Holy Resurrection (Pascha)',
    season: 'Great Feast of the Lord',
    pauline: '1 Corinthians 15:20-28',
    catholic: '1 John 1:1-4',
    acts: 'Acts 10:34-43',
    gospel: 'John 20:1-18',
    note: 'Christ is risen from the dead, trampling down death by death, and upon those in the tombs bestowing life.',
  },

  // Ascension — 40 days after Pascha, approximately Bashans 25
  '9-25': {
    feast: 'Ascension of our Lord Jesus Christ',
    season: 'Great Feast of the Lord',
    pauline: 'Ephesians 4:7-13',
    catholic: '1 Peter 3:18-22',
    acts: 'Acts 1:1-11',
    gospel: 'Luke 24:44-53',
    note: 'Christ ascends in glory to the right hand of the Father, promising the Spirit.',
  },

  // Pentecost — 50 days after Pascha, approximately Ba\'ouna 5
  '10-5': {
    feast: 'Pentecost — Descent of the Holy Spirit',
    season: 'Great Feast of the Lord',
    pauline: 'Ephesians 1:13-23',
    catholic: '1 John 4:1-6',
    acts: 'Acts 2:1-21',
    gospel: 'John 14:15-26',
    note: 'The Holy Spirit descends on the Apostles, and the Church is born.',
  },

  // Transfiguration — 13 Misra
  '12-13': {
    feast: 'Transfiguration of our Lord',
    season: 'Great Feast of the Lord',
    pauline: '2 Peter 1:16-19',
    catholic: '2 Peter 1:16-19',
    acts: 'Acts 6:8-15',
    gospel: 'Matthew 17:1-9',
    note: 'Christ is transfigured before the disciples on Mount Tabor, revealing His divine glory.',
  },

  /* ── GREAT FEASTS OF THE VIRGIN ─────────────────────────────── */

  // Nativity of the Virgin — 1 Tout
  '1-1': {
    feast: 'Coptic New Year (Nayrouz) & Feast of the Martyrs',
    season: 'Feast Day',
    pauline: 'Hebrews 11:32-40',
    catholic: 'Revelation 7:9-17',
    acts: 'Acts 7:54-60',
    gospel: 'Matthew 5:1-12',
    note: 'The Coptic year begins with the commemoration of the thousands martyred under Diocletian.',
  },

  // Presentation of Christ — 8 Amshir
  '6-8': {
    feast: 'Presentation of Christ in the Temple',
    season: 'Feast of the Lord',
    pauline: 'Galatians 4:4-7',
    catholic: 'Hebrews 2:14-18',
    acts: 'Acts 13:26-33',
    gospel: 'Luke 2:22-35',
    note: 'Simeon takes the child Jesus in his arms: "Now let your servant depart in peace."',
  },

  // Assumption of the Virgin — 16 Misra
  '12-16': {
    feast: 'Dormition (Assumption) of the Virgin Mary',
    season: 'Great Feast of the Virgin',
    pauline: 'Philippians 2:5-11',
    catholic: 'James 5:7-11',
    acts: 'Acts 1:12-14',
    gospel: 'Luke 1:39-56',
    note: 'The Theotokos falls asleep and is taken body and soul into heavenly glory.',
  },

  /* ── APOSTLES & MAJOR SAINTS ────────────────────────────────── */

  // St. Mark — 30 Bashans
  '9-30': {
    feast: 'Martyrdom of St. Mark the Evangelist',
    season: 'Apostle\'s Feast',
    pauline: '2 Timothy 4:1-8',
    catholic: '1 Peter 5:1-7',
    acts: 'Acts 12:25-13:5',
    gospel: 'John 15:17-27',
    note: 'Our father Mark, Apostle and Evangelist, founder of the Church of Alexandria.',
  },

  // Sts. Peter & Paul — 5 Abib
  '11-5': {
    feast: 'Sts. Peter and Paul, Princes of the Apostles',
    season: 'Apostle\'s Feast',
    pauline: '2 Timothy 1:8-14',
    catholic: '1 Peter 1:1-12',
    acts: 'Acts 3:1-10',
    gospel: 'Matthew 16:13-20',
    note: '"Thou art Peter, and upon this rock I will build my Church."',
  },

  // St. John the Baptist — 30 Ba\'ouna
  '10-30': {
    feast: 'Birth of St. John the Baptist (Forerunner)',
    season: 'Feast Day',
    pauline: 'Romans 10:14-17',
    catholic: 'James 5:13-20',
    acts: 'Acts 13:24-26',
    gospel: 'Luke 1:57-80',
    note: '"He must increase, but I must decrease." — John 3:30',
  },

  // St. Anthony — 22 Tobi
  '5-22': {
    feast: 'Repose of St. Anthony the Great, Father of All Monks',
    season: 'Monk\'s Feast',
    pauline: '2 Corinthians 6:4-10',
    catholic: 'James 5:16-20',
    acts: 'Acts 5:12-16',
    gospel: 'Matthew 19:27-30',
    note: '"Go sell what you have… and come, follow me." — Matthew 19:21',
  },

  // St. George — 23 Baramouda
  '8-23': {
    feast: 'St. George the Great Martyr',
    season: 'Martyr\'s Feast',
    pauline: 'Romans 8:35-39',
    catholic: '1 Peter 4:12-19',
    acts: 'Acts 6:8-7:2',
    gospel: 'John 15:1-8',
    note: 'St. George surrendered military rank to gain an eternal crown.',
  },

  // St. Athanasius — 7 Baba
  '2-7': {
    feast: 'St. Athanasius the Apostolic',
    season: 'Father\'s Feast',
    pauline: 'Galatians 1:6-12',
    catholic: '2 John 1:7-11',
    acts: 'Acts 20:28-32',
    gospel: 'John 10:1-16',
    note: '"Athanasius against the world" — he stood alone for the Nicene faith.',
  },

  // St. Cyril of Alexandria — 3 Baba
  '2-3': {
    feast: 'St. Cyril of Alexandria, Pillar of the Faith',
    season: 'Father\'s Feast',
    pauline: 'Colossians 1:15-20',
    catholic: '1 John 4:1-6',
    acts: 'Acts 15:1-11',
    gospel: 'Luke 1:43-48',
    note: 'Defender of the Theotokos at Ephesus (431): "God the Word was incarnate."',
  },

  // St. Dimiana — 12 Tobi
  '5-12': {
    feast: 'St. Dimiana and her 40 Virgins',
    season: 'Martyr\'s Feast',
    pauline: 'Romans 8:18-25',
    catholic: 'Revelation 14:1-5',
    acts: 'Acts 21:7-14',
    gospel: 'Matthew 10:34-42',
    note: 'She chose death with her 40 companions rather than deny Christ.',
  },

  // St. Menas — 15 Hator
  '3-15': {
    feast: 'St. Menas of Egypt, Great Martyr',
    season: 'Martyr\'s Feast',
    pauline: '2 Corinthians 4:7-15',
    catholic: '1 Peter 2:19-25',
    acts: 'Acts 7:54-8:3',
    gospel: 'Matthew 10:16-28',
    note: 'His shrine at Abu Mena was one of the greatest pilgrimage sites of the ancient world.',
  },
};

/**
 * Day-of-week fallback readings (0 = Sunday … 6 = Saturday).
 * These rotate through major NT themes across the week.
 */
export const WEEKLY_READINGS = [
  {
    // Sunday — Resurrection
    theme: 'The Resurrection',
    pauline: 'Romans 6:3-11',
    catholic: '1 Peter 1:3-9',
    acts: 'Acts 2:22-36',
    gospel: 'John 20:1-18',
  },
  {
    // Monday — The Kingdom
    theme: 'The Kingdom of Heaven',
    pauline: 'Colossians 1:9-20',
    catholic: 'James 2:14-26',
    acts: 'Acts 3:12-26',
    gospel: 'Matthew 13:44-52',
  },
  {
    // Tuesday — Repentance
    theme: 'Repentance and the Prodigal Son',
    pauline: '2 Corinthians 7:9-16',
    catholic: '1 John 1:5-2:2',
    acts: 'Acts 3:17-26',
    gospel: 'Luke 15:11-32',
  },
  {
    // Wednesday — The Cross (fasting day)
    theme: 'The Cross and Fasting',
    pauline: '1 Corinthians 1:18-25',
    catholic: 'Hebrews 12:1-13',
    acts: 'Acts 10:34-43',
    gospel: 'John 19:17-37',
  },
  {
    // Thursday — The Eucharist
    theme: 'The Holy Eucharist',
    pauline: '1 Corinthians 11:23-32',
    catholic: '1 John 1:1-4',
    acts: 'Acts 2:42-47',
    gospel: 'John 6:51-58',
  },
  {
    // Friday — Martyrdom and Sacrifice (fasting day)
    theme: 'Martyrdom and Sacrifice',
    pauline: 'Philippians 1:21-30',
    catholic: '1 Peter 4:12-19',
    acts: 'Acts 6:8-7:2',
    gospel: 'John 15:18-27',
  },
  {
    // Saturday — The Saints and Resurrection of the Body
    theme: 'The Communion of Saints',
    pauline: '1 Thessalonians 4:13-18',
    catholic: 'Hebrews 11:32-12:2',
    acts: 'Acts 7:55-60',
    gospel: 'John 11:23-27',
  },
];

/**
 * Get the readings for a given Coptic date + Gregorian day-of-week.
 * Returns the readings object (feast or weekly fallback) plus metadata.
 */
export function getReadingsForDay(copticMonth, copticDay, dayOfWeek, copticMonthName) {
  const key = `${copticMonth}-${copticDay}`;
  const feast = FEAST_READINGS[key];

  if (feast) {
    return {
      ...feast,
      isFeast: true,
      label: feast.feast,
      dayOfWeek,
    };
  }

  const weekly = WEEKLY_READINGS[dayOfWeek];
  const isFastDay = dayOfWeek === 3 || dayOfWeek === 5; // Wed & Fri
  return {
    ...weekly,
    isFeast: false,
    label: weekly.theme,
    season: isFastDay ? 'Fasting Day' : 'Ordinary Day',
    isFastDay,
    dayOfWeek,
  };
}

/** Parse a bible-api.com reference string into a display label. */
export function refToLabel(ref) {
  return ref
    .replace(/(\d)\s*:\s*(\d)/g, '$1:$2')
    .replace(/\s+/g, ' ')
    .trim();
}
