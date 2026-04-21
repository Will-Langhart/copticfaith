import PageShell from '../components/PageShell';
import './ChurchHistoryPage.css';

/* ── Palette ────────────────────────────────────────────────── */
const C = {
  coptic:        '#e8834a',
  undivided:     '#8a8a9a',
  nestorian:     '#e85090',
  orthodox:      '#40c8a0',
  catholic:      '#d4aa30',
  protestant:    '#7878d0',
  coe:           '#a858d0',
  martyrdom:     '#e84040',
  reconciliation:'#60c0d8',
};

/* ── Timeline SVG ───────────────────────────────────────────── */
function ChurchTimeline() {
  const yearLabels = [
    ['33 AD',  40],
    ['c. 68',  68],
    ['431',   215],
    ['451',   258],
    ['553',   308],
    ['641',   345],
    ['1054',  468],
    ['1517',  562],
    ['1534',  578],
    ['2026',  730],
  ];

  const font = 'DM Sans, system-ui, sans-serif';

  return (
    <div className="cht__svg-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 880 790"
        className="cht__svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── time axis ── */}
        <line x1="92" y1="22" x2="92" y2="752"
          stroke="#3a3a4a" strokeWidth="1" strokeDasharray="3 5" />

        {/* ── year labels ── */}
        {yearLabels.map(([lbl, y]) => (
          <text key={lbl} x="84" y={y + 4}
            textAnchor="end" fill="#6a6a7a"
            fontSize="11" fontFamily={font}>
            {lbl}
          </text>
        ))}

        {/* ════════════════════════════════════════════
            COPTIC / ORIENTAL main trunk  (orange)
            ════════════════════════════════════════════ */}
        <line x1="350" y1="40" x2="350" y2="742"
          stroke={C.coptic} strokeWidth="2.5" />

        {/* dots on trunk */}
        <circle cx="350" cy="40"  r="5"   fill={C.undivided} />
        <circle cx="350" cy="68"  r="5"   fill={C.coptic} />
        <circle cx="350" cy="215" r="4.5" fill={C.undivided} />
        <circle cx="350" cy="258" r="4.5" fill={C.coptic} />

        {/* trunk labels */}
        <text x="362" y="44"  fill="#e8e0d0" fontSize="10.5" fontFamily={font} fontWeight="600">The Apostolic Church</text>
        <text x="362" y="57"  fill="#5e5e6e" fontSize="9.5"  fontFamily={font}>Pentecost · one faith · one body</text>
        <text x="362" y="72"  fill="#e8e0d0" fontSize="10.5" fontFamily={font} fontWeight="600">St. Mark founds Alexandria</text>
        <text x="362" y="85"  fill="#5e5e6e" fontSize="9.5"  fontFamily={font}>The See that never moved</text>
        <text x="362" y="219" fill="#c0b8a8" fontSize="10"   fontFamily={font}>Ephesus · Cyril defends the faith</text>
        <text x="362" y="263" fill="#c0b8a8" fontSize="10"   fontFamily={font}>Chalcedon · Rome and Constantinople depart</text>

        {/* ════════════════════════════════════════════
            CHURCH OF THE EAST departure (431)  — pink
            ════════════════════════════════════════════ */}
        <path d="M 350,215 C 460,220 570,228 665,242"
          stroke={C.nestorian} strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
        <circle cx="665" cy="242" r="4" fill={C.nestorian} />
        <text x="470" y="236" fill={C.nestorian} fontSize="10" fontFamily={font}>Nestorians depart</text>
        <line x1="665" y1="242" x2="654" y2="742"
          stroke={C.nestorian} strokeWidth="1.5" />

        {/* ════════════════════════════════════════════
            CHALCEDONIAN branch (451) — gray
            ════════════════════════════════════════════ */}
        <path d="M 350,258 C 420,264 478,272 528,282"
          stroke="#9a9aaa" strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
        <circle cx="528" cy="282" r="4" fill="#9a9aaa" />
        {/* Chalcedonian trunk down to Great Schism */}
        <line x1="528" y1="282" x2="528" y2="468"
          stroke="#9a9aaa" strokeWidth="1.5" />
        <text x="540" y="378" fill="#7a7a8a" fontSize="10" fontFamily={font}>Chalcedonians</text>

        {/* ════════════════════════════════════════════
            GREAT SCHISM (1054) — splits into EO + Catholic
            ════════════════════════════════════════════ */}
        <circle cx="528" cy="468" r="5.5" fill={C.orthodox} />
        <text x="540" y="473" fill="#e8e0d0" fontSize="10.5" fontFamily={font} fontWeight="600">Great Schism</text>

        {/* EO line (teal) */}
        <line x1="528" y1="468" x2="458" y2="742"
          stroke={C.orthodox} strokeWidth="1.8" />
        <text x="462" y="530" fill={C.orthodox} fontSize="9.5" fontFamily={font}>Eastern Orthodox</text>

        {/* Catholic departure dashes then solid (gold) */}
        <path d="M 528,468 C 556,481 578,496 600,510"
          stroke={C.catholic} strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
        <circle cx="600" cy="510" r="4" fill={C.catholic} />
        <line x1="600" y1="510" x2="600" y2="742"
          stroke={C.catholic} strokeWidth="1.8" />

        {/* ════════════════════════════════════════════
            REFORMATION (1517) — Protestant branch (purple)
            ════════════════════════════════════════════ */}
        <circle cx="600" cy="562" r="4" fill={C.catholic} />
        <text x="545" y="558" fill="#c0b8a8" fontSize="9.5" fontFamily={font}>Reformation</text>
        <path d="M 600,562 C 638,572 674,580 712,592"
          stroke={C.protestant} strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
        <circle cx="712" cy="592" r="4" fill={C.protestant} />
        <line x1="712" y1="592" x2="712" y2="742"
          stroke={C.protestant} strokeWidth="1.8" />

        {/* ════════════════════════════════════════════
            CHURCH OF ENGLAND (1534) — CoE branch
            ════════════════════════════════════════════ */}
        <path d="M 600,578 C 658,587 718,594 784,603"
          stroke={C.coe} strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
        <circle cx="784" cy="603" r="3.5" fill={C.coe} />
        <line x1="784" y1="603" x2="784" y2="742"
          stroke={C.coe} strokeWidth="1.5" />
        <text x="792" y="658" fill={C.coe} fontSize="9.5" fontFamily={font}>CoE</text>

        {/* ════════════════════════════════════════════
            BOTTOM LABELS
            ════════════════════════════════════════════ */}
        <text x="350" y="760" textAnchor="middle" fill={C.coptic}    fontSize="11" fontFamily={font} fontWeight="700">Oriental/Coptic</text>
        <text x="350" y="774" textAnchor="middle" fill="#5e5e6e"      fontSize="9"  fontFamily={font}>the unmoved See</text>
        <text x="458" y="760" textAnchor="middle" fill={C.orthodox}   fontSize="11" fontFamily={font} fontWeight="600">EO</text>
        <text x="600" y="760" textAnchor="middle" fill={C.catholic}   fontSize="11" fontFamily={font} fontWeight="600">Rome</text>
        <text x="712" y="760" textAnchor="middle" fill={C.protestant} fontSize="11" fontFamily={font} fontWeight="600">Prot.</text>
        <text x="784" y="760" textAnchor="middle" fill={C.coe}        fontSize="11" fontFamily={font} fontWeight="600">CoE</text>
      </svg>
    </div>
  );
}

/* ── Legend ─────────────────────────────────────────────────── */
const LEGEND = [
  [C.coptic,         'Oriental/Coptic (See of St. Mark)'],
  [C.undivided,      'Undivided'],
  [C.nestorian,      'Church of the East'],
  [C.orthodox,       'Eastern Orthodox'],
  [C.catholic,       'Catholic'],
  [C.protestant,     'Protestant'],
  [C.coe,            'Anglican (CoE)'],
  [C.martyrdom,      'Martyrdom'],
  [C.reconciliation, 'Reconciliation'],
];

/* ── History data ───────────────────────────────────────────── */
const SECTIONS = [
  {
    id: 'apostolic',
    label: 'APOSTOLIC FOUNDATION · THE SEE OF ST. MARK',
    events: [
      {
        year: 'c. 33',
        title: 'Pentecost — the Church is one',
        tag: 'one faith',
        borderColor: C.undivided,
        tagColor: C.undivided,
        body: 'The Holy Spirit descends on the apostles. There is no Catholic, no Protestant, no Eastern Orthodox. There is one Church, one faith, one baptism, one Lord. Everything that follows is either faithfulness to that deposit or departure from it.',
      },
      {
        year: 'c. 49',
        title: 'St. Mark founds the See of Alexandria',
        tag: 'the unmoved see',
        borderColor: C.coptic,
        tagColor: C.coptic,
        body: 'The Evangelist, companion of Peter, brings the Gospel to Egypt. He establishes the Coptic Orthodox patriarchate and is martyred in Alexandria around 68 AD. His throne is unbroken to this day — 118 popes of Alexandria in direct succession. No branch. No drift. The original.',
      },
      {
        year: 'c. 180',
        title: 'Catechetical School of Alexandria',
        borderColor: C.coptic,
        body: 'Under Pantaenus, Clement, and Origen, Alexandria becomes the theological center of Christendom. The methods, the vocabulary, the Christological instincts that will later be called "orthodoxy" are forged here. When Rome and Constantinople need theology, they come to Alexandria.',
      },
      {
        year: '284',
        title: 'The Era of Martyrs begins',
        tag: 'anno martyrum',
        borderColor: C.martyrdom,
        tagColor: C.martyrdom,
        body: "Diocletian's persecution falls hardest on Egypt. So many Copts are killed that the Coptic calendar — still in use today — begins from this year as Anno Martyrum. The Church that would later be slandered as heretical is the one that first bled for Christ in numbers the rest of Christendom did not.",
      },
    ],
  },
  {
    id: 'councils',
    label: 'ALEXANDRIA DEFENDS THE TRINITY — THE FOUR FOUNDATIONAL COUNCILS',
    events: [
      {
        year: '325',
        title: 'Nicaea I — Athanasius holds the line',
        tag: 'ecumenical 1',
        borderColor: C.coptic,
        tagColor: C.coptic,
        body: 'Arius, a priest of Alexandria, denies the full divinity of the Son. It is Alexandria that answers him. St. Athanasius, still a deacon, champions the homoousios. When the empire later caves to Arianism, Athanasius is exiled five times. The saying becomes proverbial: Athanasius contra mundum — Athanasius against the world. The faith survives because Alexandria refuses to blink.',
      },
      {
        year: '381',
        title: 'Constantinople I',
        tag: 'ecumenical 2',
        borderColor: C.undivided,
        tagColor: C.undivided,
        body: "The full divinity of the Holy Spirit is confessed against the Pneumatomachians. The Creed we still pray is completed. The Alexandrian Trinitarian settlement becomes the Church's settled language.",
      },
      {
        year: '431',
        title: "Ephesus — Cyril's Christology vindicated",
        tag: 'ecumenical 3',
        borderColor: C.coptic,
        tagColor: C.coptic,
        body: 'St. Cyril of Alexandria leads the Church against Nestorius, who refused Theotokos — Mother of God — for the Virgin. Cyril\'s Twelve Anathemas and his formula "one incarnate nature of God the Word" (mia physis tou Theou Logou sesarkomene) become the standard of orthodox Christology. This is the Christology the Coptic Church holds to this day. Everything that follows depends on Cyril.',
      },
    ],
  },
  {
    id: 'nestorian',
    label: 'FIRST DEPARTURE · THE NESTORIANS REJECT EPHESUS',
    events: [
      {
        year: '431',
        title: 'Church of the East rejects Ephesus',
        tag: 'first departure',
        borderColor: C.nestorian,
        tagColor: C.nestorian,
        body: "The Persian-based church refuses Cyril's condemnation of Nestorius and holds to a Christology that effectively divides Christ into two sons — one divine, one human, loosely joined. Alexandria did not move. Nestorius and his successors walked away from the faith Cyril had preserved. This is the first break.",
      },
    ],
  },
  {
    id: 'chalcedon',
    label: 'CHALCEDON · ALEXANDRIA HOLDS, THE REST DRIFT',
    events: [
      {
        year: '444',
        title: 'St. Dioscorus succeeds St. Cyril',
        borderColor: C.coptic,
        body: "Cyril's personal secretary and archdeacon, present at Ephesus in 431, becomes the 25th Pope of Alexandria. He inherits Cyril's throne and Cyril's theology. He will defend both at cost of exile and death. The Coptic Church venerates him as Dioscorus the Great.",
      },
      {
        year: '449',
        title: 'Second Council of Ephesus',
        borderColor: C.coptic,
        body: "Convened by Emperor Theodosius II with Dioscorus presiding. Eutyches is rehabilitated on profession of repentance; the Cyrillian formula is upheld. Leo of Rome's Tome — which the East reads as crypto-Nestorian — is not received. Leo later brands it the \"Robber Synod\" when he has the political muscle to do so. The Copts remember it as a council that kept the faith.",
      },
      {
        year: '450',
        title: 'The empire changes hands',
        tag: 'politics, not theology',
        borderColor: C.undivided,
        tagColor: C.undivided,
        body: "Theodosius II dies in a riding accident. His sister Pulcheria, long aligned with Leo of Rome, takes the throne with her new husband Marcian. The imperial court flips. Overnight, what had been orthodox at Ephesus II is to be reversed at a new council. The theology did not change. The emperor did.",
      },
      {
        year: '451',
        title: "Chalcedon — the formula Cyril would not sign",
        tag: 'second departure',
        borderColor: '#9a9aaa',
        tagColor: '#9a9aaa',
        body: 'Under imperial pressure, with Leo\'s Tome as the imposed text, the council defines Christ "in two natures." To Alexandrian ears this is the language of Nestorius dressed in new clothes — a formula that divides what Cyril had taught the Church to confess as united. The Copts, the Syriacs, the Armenians, the Ethiopians, and later the Malankara refuse to sign what would undo Ephesus. They are not leaving. They are holding.',
      },
      {
        year: '451',
        title: 'St. Dioscorus deposed unjustly',
        tag: 'confessor',
        borderColor: C.martyrdom,
        tagColor: C.martyrdom,
        body: "The council's own minutes show Dioscorus was deposed on procedural grounds — his refusal to accept a rigged process — not for heresy. The Fifth Ecumenical Council itself would later confirm no heresy was found against him. He confessed Cyril's faith plainly: \"I receive 'from two natures'; the two I do not receive.\" Exiled to Gangra. He dies there in 454, clutching his faith. The Coptic Church names him Dioscorus the Great and commemorates him as a saint.",
      },
      {
        year: '457',
        title: 'Imperial persecution of the Copts begins',
        tag: 'persecution',
        borderColor: C.martyrdom,
        tagColor: C.martyrdom,
        body: "Proterius, the emperor's man installed over Alexandria against the will of the people, is killed by the faithful. Byzantine troops massacre monks and laity who will not receive the Chalcedonian formula. The word Melkite — \"king's men\" — enters Coptic usage to describe those who took the emperor's side against the faith. For the next two centuries, Copts will be hunted in their own land by fellow Christians.",
      },
    ],
  },
  {
    id: 'splinter',
    label: 'THE CHALCEDONIANS SPLINTER · ALEXANDRIA DOES NOT',
    events: [
      {
        year: '553',
        title: 'Constantinople II — Cyril quietly vindicated',
        tag: 'vindication',
        borderColor: C.coptic,
        tagColor: C.coptic,
        body: "Emperor Justinian, desperate to heal what Chalcedon broke, convenes this council to condemn the Three Chapters — Nestorian-leaning writings Chalcedon had tolerated. The council effectively concedes what the Copts said all along: Chalcedon's language had drifted, and it needed Cyril to correct it. The effort at reunion fails only because Chalcedon itself cannot be withdrawn.",
      },
      {
        year: '641',
        title: 'The Arab conquest of Egypt',
        tag: 'end of Byzantine rule',
        borderColor: C.martyrdom,
        tagColor: C.martyrdom,
        body: "The Copts do not resist. After two centuries of Melkite persecution, Byzantine rule feels worse than foreign conquest. The Coptic patriarch Benjamin, hidden in the desert, returns to Alexandria. The Church that held the apostolic faith now holds it under Islamic rule — and will for the next fourteen hundred years, through jizya, through pogroms, through martyrdom, without flinching.",
      },
      {
        year: '680',
        title: 'Constantinople III — another Chalcedonian correction',
        borderColor: '#9a9aaa',
        body: "Monothelitism — a Chalcedonian attempt to smuggle back something closer to the Cyrillian instinct — is condemned. The Chalcedonian churches keep having to patch their formula. Alexandria has needed no patching.",
      },
      {
        year: '787',
        title: 'Nicaea II — icons defended',
        borderColor: '#9a9aaa',
        body: "The Chalcedonian east wrestles with iconoclasm, which never gained ground in Egypt. The Coptic iconographic tradition, Alexandrian in root, had simply continued the practice the apostles began.",
      },
    ],
  },
  {
    id: 'medieval',
    label: 'THE MEDIEVAL PERIOD · THE SEE ENDURES',
    events: [
      {
        year: '988',
        title: 'Baptism of Kievan Rus',
        tag: 'Chalcedonian expansion',
        borderColor: C.orthodox,
        tagColor: C.orthodox,
        body: 'Prince Vladimir of Kiev is baptized into Eastern Christianity, planting the Chalcedonian Orthodox faith across the Slavic world. The Eastern church expands north and east while the Copts hold steadily in Egypt under Islamic rule, maintaining the apostolic throne without political power or imperial backing.',
      },
      {
        year: '1054',
        title: 'The Great Schism — Rome and Constantinople divide',
        tag: 'third departure',
        borderColor: '#9a9aaa',
        tagColor: '#9a9aaa',
        body: "The Chalcedonian church — which had already departed from Alexandria in 451 — now fractures within itself. Rome and Constantinople exchange mutual anathemas over papal primacy and the filioque clause. What had been one Chalcedonian communion becomes two. The Coptic Church, long outside both Rome and Constantinople, watches from outside: this is not their schism. They had never joined the new formula.",
      },
      {
        year: '1204',
        title: 'The Fourth Crusade sacks Constantinople',
        tag: 'internal fracture',
        borderColor: '#9a9aaa',
        tagColor: '#9a9aaa',
        body: "Western Crusaders, supposedly en route to the Holy Land, sack the Christian city of Constantinople. The Latin Empire is imposed. Eastern Orthodox Christians experience Roman Catholic rule as conquest. The wounds of 1054 become permanent. Meanwhile the Coptic patriarch sits in Alexandria, unaffected by the politics of two branches that had departed from his See six centuries prior.",
      },
    ],
  },
  {
    id: 'reformation',
    label: 'THE REFORMATION · ROME FRACTURES FURTHER',
    events: [
      {
        year: '1517',
        title: 'The Reformation — Luther breaks from Rome',
        tag: 'fourth departure',
        borderColor: C.protestant,
        tagColor: C.protestant,
        body: "Martin Luther's 95 Theses spark a fracture in the Western church over indulgences, papal authority, and soteriology. What began as reform becomes a new tradition. The Protestant churches — Lutheran, Reformed, Anglican, and their countless descendants — emerge from Rome as Rome had emerged from Alexandria in 451. The Coptic Church, 1,484 years into its unbroken succession, receives the news from across the Mediterranean.",
      },
      {
        year: '1534',
        title: 'The Church of England separates',
        tag: 'political schism',
        borderColor: C.coe,
        tagColor: C.coe,
        body: "Henry VIII's Act of Supremacy creates the Church of England — not for theological reasons but for the king's need of an annulment. A church born of politics, paralleling in a strange way how Chalcedon itself had been a political council. The See of Canterbury claims apostolic succession; the See of Alexandria has never doubted its own.",
      },
    ],
  },
  {
    id: 'modern',
    label: 'THE MODERN ERA · MARTYRDOM AND RENEWAL',
    events: [
      {
        year: '1798',
        title: "Napoleon invades Egypt — the world rediscovers Alexandria",
        borderColor: C.coptic,
        body: "French forces arrive in Egypt. Napoleon initially courts the Copts, recognizing their ancient claim. The invasion disrupts Ottoman rule but brings Western attention to the ancient church. Coptic scholars and manuscripts come to the attention of European academics. The world begins to rediscover what Alexandria had never forgotten.",
      },
      {
        year: '1959',
        title: 'Pope Cyril VI enthroned',
        tag: 'Coptic renewal',
        borderColor: C.coptic,
        tagColor: C.coptic,
        body: "The 116th Pope of Alexandria, a desert monk renowned for prayer and healing, leads a profound spiritual revival. He reestablishes the Coptic Theological Seminary and oversees the canonization of ancient saints. Under his papacy, the Ethiopian Orthodox Church receives its own patriarch — ending centuries of dependence and formalizing the Oriental Orthodox family of churches.",
      },
      {
        year: '1971',
        title: 'Pope Shenouda III enthroned',
        tag: 'ecumenical era',
        borderColor: C.coptic,
        tagColor: C.coptic,
        body: "The 117th Pope of Alexandria shepherds the Church through 41 years of extraordinary challenge and growth. Imprisoned by Sadat from 1981 to 1985. Author of over 100 theological books. He oversees the global expansion of the Coptic diaspora across every continent, while maintaining the theological positions held since Ephesus.",
      },
      {
        year: '1973',
        title: 'Joint Christological Declaration with Rome',
        tag: 'reconciliation',
        borderColor: C.reconciliation,
        tagColor: C.reconciliation,
        body: 'Pope Shenouda III and Pope Paul VI sign a common declaration on the nature of Christ: "the same perfect God and the same perfect man." After 1,522 years of separation since Chalcedon, Rome and Alexandria formally acknowledge they confess the same faith in different words. The anathemas have not been lifted, but the theological distance is named as smaller than fifteen centuries of silence had suggested.',
      },
      {
        year: '2012',
        title: 'Pope Tawadros II — 118th Pope of Alexandria',
        tag: 'present succession',
        borderColor: C.coptic,
        tagColor: C.coptic,
        body: "The 118th Pope of Alexandria, elected by the hand of a blindfolded child drawing from three finalists — a practice traced to the earliest days of the Church. The method of selection itself is ancient testimony: the See of St. Mark is not filled by politics or synodal vote but by the will of God. The Coptic Church enters the 21st century holding the same faith Mark brought to Alexandria nearly two thousand years prior.",
      },
      {
        year: '2017',
        title: 'Palm Sunday martyrs — Tanta and Alexandria',
        tag: 'martyrdom',
        borderColor: C.martyrdom,
        tagColor: C.martyrdom,
        body: "Bombings in two Coptic churches on Palm Sunday kill 49 faithful. Pope Tawadros II had been present at St. Mark's Cathedral in Alexandria. The Coptic response is characteristic: no riots, no retaliation — only the funerals, the prayers, and the ancient words: \"Truly this is a martyr.\" The Church that began with martyrs continues to bear witness with blood.",
      },
      {
        year: '2026',
        title: 'The See of St. Mark — unbroken',
        tag: 'the unmoved see',
        borderColor: C.coptic,
        tagColor: C.coptic,
        body: "One hundred and eighteen popes. Nearly two thousand years. Through Roman persecution, Chalcedonian exile, Arab conquest, Mamluk rule, Ottoman occupation, and modern terrorism — the throne of St. Mark has never been vacant by abandonment, never moved by political pressure, never revised its Christology to please an emperor. The Coptic Orthodox Church is not a branch of something older. It is the original. Still here. Still holding.",
      },
    ],
  },
];

/* ── EventCard ──────────────────────────────────────────────── */
function EventCard({ event }) {
  return (
    <div className="ch-event" style={{ borderLeftColor: event.borderColor }}>
      <div className="ch-event__year">{event.year}</div>
      <div className="ch-event__content">
        <h3 className="ch-event__title">
          {event.title}
          {event.tag && (
            <span
              className="ch-event__tag"
              style={{
                background:   event.tagColor + '28',
                color:        event.tagColor,
                borderColor:  event.tagColor + '55',
              }}
            >
              {event.tag}
            </span>
          )}
        </h3>
        <p className="ch-event__body">{event.body}</p>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function ChurchHistoryPage() {
  return (
    <PageShell title="Church History">
      <div className="church-history">

        <p className="church-history__intro">
          The Oriental Orthodox churches — the Copts, the Syriacs, the Armenians,
          the Ethiopians, the Eritreans, and the Malankara — hold the original
          Christology of Ephesus 431. Every other tradition is younger, having
          departed or reformed from something older. This is the timeline of that
          departure and that continuity.
        </p>

        {/* ── Visual timeline ── */}
        <section className="church-history__timeline-section" aria-label="Visual church history timeline">
          <h2 className="church-history__section-title">The Unbroken Line</h2>
          <ChurchTimeline />

          <div className="ch-legend" role="list">
            {LEGEND.map(([color, label]) => (
              <div key={label} className="ch-legend__item" role="listitem">
                <span className="ch-legend__dot" style={{ background: color }} />
                <span className="ch-legend__label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Detailed events ── */}
        <section className="church-history__events" aria-label="Detailed church history events">
          {SECTIONS.map((section) => (
            <div key={section.id} className="ch-section">
              <h2 className="ch-section__header">{section.label}</h2>
              {section.events.map((event, i) => (
                <EventCard key={`${section.id}-${i}`} event={event} />
              ))}
            </div>
          ))}
        </section>

      </div>
    </PageShell>
  );
}
