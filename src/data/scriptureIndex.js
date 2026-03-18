// Scripture references cited in the document, organized by book
// Each entry: { ref, text (short excerpt), sectionId, sectionTitle }
export const SCRIPTURE_INDEX = {
  'Genesis': [
    { ref: 'Genesis 14:18', text: 'Melchizedek offered bread and wine — OT type of the Eucharist', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'Genesis 22:1–14', text: 'Abraham and Isaac — the Akedah as type of Christ\'s sacrifice', sectionId: 'types', sectionTitle: 'Parts Eight & Nine: OT Types & Monasticism' },
    { ref: 'Genesis 28:12', text: 'Jacob\'s ladder — type of the Theotokos', sectionId: 'types', sectionTitle: 'Parts Eight & Nine: OT Types & Monasticism' },
  ],
  'Exodus': [
    { ref: 'Exodus 3:1–5', text: 'The burning bush — type of the Theotokos', sectionId: 'types', sectionTitle: 'Parts Eight & Nine: OT Types & Monasticism' },
    { ref: 'Exodus 12', text: 'The Passover lamb — type of Christ and the Eucharist', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'Exodus 16:14–15', text: 'The manna — type of the Eucharist', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'Exodus 17:6', text: 'Water from the rock — "the rock was Christ" (1 Cor 10:4)', sectionId: 'foundation', sectionTitle: 'Part One: Biblical Foundation' },
    { ref: 'Exodus 30', text: 'The anointing oil of Moses — type of the holy Myron', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'Exodus 30:23–25', text: 'Ingredients of the holy anointing oil', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'Exodus 40:9', text: 'Moses anoints the tabernacle — type of Chrismation', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
  ],
  'Leviticus': [
    { ref: 'Leviticus 16', text: 'The Day of Atonement — type of Christ\'s sacrifice and the Eucharist', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
  ],
  'Numbers': [
    { ref: 'Numbers 21:8–9', text: 'The bronze serpent — type of the Crucifixion (John 3:14)', sectionId: 'types', sectionTitle: 'Parts Eight & Nine: OT Types & Monasticism' },
  ],
  'Isaiah': [
    { ref: 'Isaiah 19:19', text: '"In that day there will be an altar to the LORD in the midst of the land of Egypt"', sectionId: 'foundation', sectionTitle: 'Part One: Biblical Foundation' },
    { ref: 'Isaiah 19:21', text: '"The Egyptians will know the LORD… they will make vow and perform it"', sectionId: 'foundation', sectionTitle: 'Part One: Biblical Foundation' },
    { ref: 'Isaiah 19:25', text: '"Egypt My people"', sectionId: 'foundation', sectionTitle: 'Part One: Biblical Foundation' },
    { ref: 'Isaiah 53', text: 'The Suffering Servant — the sacrificial context of the Eucharist', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'Isaiah 62:5', text: 'Marriage imagery — type of the sacrament of Matrimony', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
  ],
  'Jeremiah': [
    { ref: 'Jeremiah 6:16', text: '"Ask for the old paths, where the good way is"', sectionId: 'conclusion', sectionTitle: 'Conclusion & Appendices' },
  ],
  'Hosea': [
    { ref: 'Hosea 11:1', text: '"Out of Egypt I called My Son"', sectionId: 'foundation', sectionTitle: 'Part One: Biblical Foundation' },
  ],
  'Matthew': [
    { ref: 'Matthew 2:13–15', text: 'The flight to Egypt — fulfillment of Hosea 11:1', sectionId: 'foundation', sectionTitle: 'Part One: Biblical Foundation' },
    { ref: 'Matthew 3:11', text: 'Baptism in the Holy Spirit — sacramental basis for Chrismation', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'Matthew 16:18–19', text: '"On this rock I will build my Church… I will give you the keys"', sectionId: 'historical', sectionTitle: 'Part Two: Historical Evidence' },
    { ref: 'Matthew 18:18', text: '"Whatever you bind on earth will be bound in heaven" — basis for Confession', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'Matthew 26:26–28', text: 'Words of Institution: "This is My body… this is My blood"', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'Matthew 28:19', text: 'The Great Commission: baptism in the Trinitarian name', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
  ],
  'Mark': [
    { ref: 'Mark 7:8', text: 'Jesus condemns the "tradition of men" — Paul distinguishes from apostolic tradition', sectionId: 'conclusion', sectionTitle: 'Conclusion & Appendices' },
    { ref: 'Mark 14:22–24', text: 'Words of Institution — parallel account', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'Mark 16:15–18', text: 'Commission to preach; signs following — apostolic mission of the Coptic Church', sectionId: 'historical', sectionTitle: 'Part Two: Historical Evidence' },
  ],
  'Luke': [
    { ref: 'Luke 22:19–20', text: '"Do this in remembrance of Me" — the Eucharistic command', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'Luke 24:13–35', text: 'The Road to Emmaus — the disciples recognized Christ "in the breaking of bread"', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
  ],
  'John': [
    { ref: 'John 1:1, 14', text: '"The Word was God… became flesh" — Incarnation proof text', sectionId: 'doctrines', sectionTitle: 'Part Three: The Doctrines' },
    { ref: 'John 3:5', text: '"Born of water and the Spirit" — basis for Baptism', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'John 6:51–56', text: '"My flesh is real food and My blood is real drink" — Eucharistic discourse', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'John 6:53', text: '"Unless you eat the flesh of the Son of Man… you have no life in you"', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'John 19:23', text: 'The seamless tunic — type of the Church\'s unity', sectionId: 'types', sectionTitle: 'Parts Eight & Nine: OT Types & Monasticism' },
    { ref: 'John 20:22–23', text: '"Receive the Holy Spirit. If you forgive sins… they are forgiven" — Sacrament of Confession', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
  ],
  'Acts': [
    { ref: 'Acts 2:38', text: '"Repent and be baptized… and you shall receive the gift of the Holy Spirit"', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'Acts 2:42', text: '"They continued steadfastly in… the breaking of bread and prayers"', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'Acts 6:6', text: 'The Apostles laid hands on the seven deacons — basis for Holy Orders', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'Acts 8:17', text: 'Peter and John lay hands on believers who then received the Holy Spirit — Chrismation', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'Acts 13:2–3', text: '"Set apart Barnabas and Saul… they laid hands on them and sent them off"', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'Acts 14:23', text: 'Paul and Barnabas appointed elders in every church', sectionId: 'historical', sectionTitle: 'Part Two: Historical Evidence' },
    { ref: 'Acts 19:1–6', text: 'Disciples of John baptized; Paul laid hands; they received the Holy Spirit', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
  ],
  'Romans': [
    { ref: 'Romans 6:3–5', text: 'Baptism as participation in Christ\'s death and resurrection', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'Romans 8:34', text: '"Christ… who also makes intercession for us"', sectionId: 'saints', sectionTitle: 'Part Seven: Intercession of Saints' },
    { ref: 'Romans 15:30', text: 'Paul asks for intercessory prayer — model for asking saints to pray', sectionId: 'saints', sectionTitle: 'Part Seven: Intercession of Saints' },
  ],
  '1 Corinthians': [
    { ref: '1 Corinthians 10:16–17', text: '"The cup of blessing… is it not communion in the blood of Christ?"', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: '1 Corinthians 11:23–30', text: 'Paul\'s Eucharistic teaching — "he who eats and drinks unworthily…"', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
  ],
  '2 Corinthians': [
    { ref: '2 Corinthians 1:21–22', text: '"He who establishes us… and has given us the Spirit as a guarantee" — Chrismation', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: '2 Corinthians 5:20', text: '"We are ambassadors for Christ" — apostolic ministry and succession', sectionId: 'liturgy', sectionTitle: 'Parts Ten & Eleven: Liturgy & Unbroken Chain' },
  ],
  'Ephesians': [
    { ref: 'Ephesians 4:11–12', text: 'God gives apostles, prophets, evangelists, pastors — Holy Orders', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'Ephesians 5:25–32', text: 'Marriage as image of Christ and the Church — Sacrament of Matrimony', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
  ],
  'Philippians': [
    { ref: 'Philippians 4:6', text: '"In everything by prayer and supplication… make your requests known to God"', sectionId: 'fasting', sectionTitle: 'Part Six: Fasting' },
  ],
  '1 Thessalonians': [
    { ref: '1 Thessalonians 5:17', text: '"Pray without ceasing" — foundation of the Agpeya prayer hours', sectionId: 'liturgy', sectionTitle: 'Parts Ten & Eleven: Liturgy & Unbroken Chain' },
  ],
  '2 Thessalonians': [
    { ref: '2 Thessalonians 2:15', text: '"Hold the traditions which you were taught"', sectionId: 'conclusion', sectionTitle: 'Conclusion & Appendices' },
  ],
  '1 Timothy': [
    { ref: '1 Timothy 2:1, 5', text: 'Paul commands intercessions for all; Christ is the one Mediator', sectionId: 'saints', sectionTitle: 'Part Seven: Intercession of Saints' },
    { ref: '1 Timothy 4:14', text: '"Do not neglect the gift… given to you through the laying on of hands" — Holy Orders', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
  ],
  '2 Timothy': [
    { ref: '2 Timothy 1:6', text: '"Stir up the gift of God which is in you through the laying on of my hands"', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: '2 Timothy 2:2', text: '"Commit these to faithful men who will be able to teach others also"', sectionId: 'conclusion', sectionTitle: 'Conclusion & Appendices' },
  ],
  'Hebrews': [
    { ref: 'Hebrews 7:3', text: 'Melchizedek as type of Christ\'s eternal priesthood', sectionId: 'eucharist', sectionTitle: 'Part Four: Holy Eucharist' },
    { ref: 'Hebrews 12:1', text: '"We are surrounded by so great a cloud of witnesses"', sectionId: 'saints', sectionTitle: 'Part Seven: Intercession of Saints' },
    { ref: 'Hebrews 13:8', text: '"Jesus Christ is the same yesterday, today, and forever"', sectionId: 'liturgy', sectionTitle: 'Parts Ten & Eleven: Liturgy & Unbroken Chain' },
  ],
  'James': [
    { ref: 'James 5:14–15', text: '"Call for the elders… anoint him with oil… the prayer of faith will save the sick" — Holy Unction', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: 'James 5:16', text: '"Confess your sins to one another… pray for one another" — Sacrament of Confession', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
  ],
  '1 Peter': [
    { ref: '1 Peter 2:5', text: '"You also, as living stones, are being built up a spiritual house, a holy priesthood"', sectionId: 'mysteries', sectionTitle: 'Part Five: Seven Holy Mysteries' },
    { ref: '1 Peter 5:1–2', text: 'Peter addresses the elders — apostolic oversight of the Church', sectionId: 'historical', sectionTitle: 'Part Two: Historical Evidence' },
  ],
  'Revelation': [
    { ref: 'Revelation 5:8', text: 'The elders offer bowls of incense = prayers of the saints', sectionId: 'saints', sectionTitle: 'Part Seven: Intercession of Saints' },
    { ref: 'Revelation 8:3–4', text: 'An angel offers incense with the prayers of all the saints before God', sectionId: 'saints', sectionTitle: 'Part Seven: Intercession of Saints' },
  ],
  'Jude': [
    { ref: 'Jude 1:3', text: '"Contend earnestly for the faith which was once for all delivered to the saints" — the site\'s foundation verse', sectionId: 'hero', sectionTitle: 'Home' },
  ],
};

export const SCRIPTURE_BOOKS = Object.keys(SCRIPTURE_INDEX);
