import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';

const MYSTERIES = [
  {
    number: 'I',
    name: 'Holy Baptism',
    arabic: 'المعمودية',
    path: '/baptism',
    icon: '💧',
    tagline: 'New birth through water and the Holy Spirit',
    verse: 'John 3:5',
    verseText: '"Unless one is born of water and the Spirit, he cannot enter the kingdom of God."',
    summary:
      'Triple immersion in consecrated water effects genuine spiritual rebirth, remission of sins, union with Christ\'s death and resurrection, and adoption as a child of God. Administered to infants following the apostolic tradition received from the earliest Church.',
    copticDistinctive: 'Forty-day waiting period for males; eighty days for females — echoing Levitical purification law.',
    protestantContrast: 'Protestants generally view baptism as a symbolic ordinance following a prior inner conversion. The Coptic Church, with the whole ancient Church, holds it as the sacramental means of regeneration itself.',
  },
  {
    number: 'II',
    name: 'Holy Chrismation (Myron)',
    arabic: 'الميرون المقدس',
    path: '/chrismation',
    icon: '🕯️',
    tagline: 'The seal of the Holy Spirit upon the whole person',
    verse: '2 Cor 1:21–22',
    verseText: '"He who anoints us is God, who also sealed us and gave us the Spirit in our hearts as a guarantee."',
    summary:
      'Administered immediately after baptism, the priest anoints 36 specific points on the body with Holy Myron — a sacred oil tracing its composition to the apostolic era. Every sense, joint, and organ is sealed as a temple of the Holy Spirit.',
    copticDistinctive: 'The Holy Myron has been prepared only 40 times in Coptic history; each preparation adds a portion of the previous batch, creating unbroken physical continuity back to the Upper Room.',
    protestantContrast: 'Most Protestant traditions do not recognize Chrismation as a sacrament. Many defer a "confirmation" rite to adolescence; the ancient Church administered it inseparably from baptism, even for infants.',
  },
  {
    number: 'III',
    name: 'Repentance & Confession',
    arabic: 'التوبة والاعتراف',
    path: '/confession',
    icon: '✝️',
    tagline: 'Restoration of the soul through priestly absolution',
    verse: 'John 20:23',
    verseText: '"If you forgive the sins of any, they are forgiven them; if you retain the sins of any, they are retained."',
    summary:
      'Christ delegated to His apostles — and through them to ordained priests — the authority to forgive or retain sins. The Coptic penitent confesses to an ordained "Confession Father" who pronounces three prayers of absolution. Required before every reception of the Eucharist.',
    copticDistinctive: 'Every Copt is assigned a permanent Abu\'l-I\'tiraf (Father of Confession) who serves as spiritual director for life. Three-dimensional confession: to the wronged person, to God, and to the priest — all three are required.',
    protestantContrast: 'Protestants generally hold that sins are confessed directly to God without priestly mediation. Pope Shenouda III identifies two Protestant positions: outright denial, and a subtler view that replaces sacramental confession with pietistic self-examination — both incomplete.',
  },
  {
    number: 'IV',
    name: 'The Holy Eucharist',
    arabic: 'الإفخارستيا',
    path: '/#section5',
    icon: '☩',
    tagline: 'The Body and Blood of Christ — truly present',
    verse: 'John 6:55',
    verseText: '"My flesh is food indeed, and My blood is drink indeed."',
    summary:
      'The central sacrament of Coptic worship. In the Liturgy of Saint Basil (or Saint Cyril), the priest invokes the Holy Spirit upon the bread and wine — which truly become the Body and Blood of Christ. This is not symbolic memorial; it is the ongoing re-presentation of Calvary.',
    copticDistinctive: 'The Coptic Liturgy has been celebrated continuously since St. Mark established the Church of Alexandria c. 42 AD. The preparation rite (Prothesis), the three-hour Divine Liturgy, and the strict fasting discipline are unique in Christendom.',
    protestantContrast: 'Most Protestant traditions (following Zwingli or Calvin) hold the Eucharist as a memorial or spiritual participation. The Coptic Church, with Ignatius, Justin, Cyril, and Chrysostom, holds the Real Presence as the unbroken apostolic faith.',
  },
  {
    number: 'V',
    name: 'Unction of the Sick',
    arabic: 'مسحة المرضى',
    path: '/unction',
    icon: '🕊️',
    tagline: 'Healing of body and soul through anointing with oil',
    verse: 'James 5:14–15',
    verseText: '"Is anyone among you sick? Let him call for the elders… anointing him with oil in the name of the Lord. The prayer of faith will save the sick."',
    summary:
      'Seven complete cycles of prayer, Scripture, and anointing with consecrated oil. Forgives sins (including those forgotten or unconfessed) and channels divine healing to body and soul. Not reserved for the dying — any baptized person may receive it.',
    copticDistinctive: 'The Kandeel: an oil lamp with seven lit wicks arranged in a cross — unique to the Coptic rite. On the final Friday of Great Lent, the ENTIRE congregation receives communal anointing to prepare for Holy Week.',
    protestantContrast: 'Protestants view healing prayer as a petition to God\'s sovereign will, without a sacramental channel. The Coptic Church, following the Apostle James and the earliest Christian practice, holds that God works objectively through the consecrated oil.',
  },
  {
    number: 'VI',
    name: 'Holy Matrimony',
    arabic: 'الزواج المقدس',
    path: '/matrimony',
    icon: '💍',
    tagline: 'The sacred covenant imaging Christ and His Church',
    verse: 'Eph 5:32',
    verseText: '"This is a great mystery (mysterion), but I speak concerning Christ and the Church."',
    summary:
      'Marriage is elevated to a sacrament because St. Paul calls it a mysterion — the same Greek word for sacrament. The Coptic rite includes betrothal, ring-placing by the priest (making the bond permanent), crowning, anointing with oil, and the tying of a red silk ribbon in three knots.',
    copticDistinctive: 'Only the PRIEST places the rings (unlike betrothal, where the couple place their own rings). Marriage is forbidden during all major fasting seasons. A pre-nuptial vigil in the church traces to the Book of Tobit.',
    protestantContrast: 'Most Protestant traditions treat marriage as a covenant ordinance, not a sacrament. Divorce and remarriage are treated permissively. The Coptic Church holds marriage indissoluble except for death, adultery, or apostasy.',
  },
  {
    number: 'VII',
    name: 'Holy Orders',
    arabic: 'سر الكهنوت',
    path: '/holy-orders',
    icon: '⛪',
    tagline: 'Apostolic succession through the laying on of hands',
    verse: '1 Tim 4:14',
    verseText: '"Do not neglect the gift that is in you, which was given to you by prophecy with the laying on of the hands of the eldership."',
    summary:
      'Through the bishop\'s laying on of hands, the Holy Spirit descends upon the ordained and grants authority to administer the sacraments, teach, and govern. An unbroken chain of episcopal succession traces to St. Mark, the 42 AD founder of the Alexandrian Church.',
    copticDistinctive: 'Five deacon ranks (including the Epsaltos for children) form a living catechetical system. All bishops must come from the monastic ranks (celibate monks). The Pope of Alexandria is the 118th successor of St. Mark.',
    protestantContrast: 'Luther\'s "Priesthood of all believers" holds all baptized Christians equal in Christ\'s priesthood; ordained ministers are distinguished only functionally. The Coptic Church holds ordination as conferring an indelible ontological character — an irrevocable change of being, not merely a functional role.',
  },
];

export default function SacramentsPage() {
  return (
    <PageShell>
      <div className="page-content">
        <div className="page-content__header">
          <h1>THE SEVEN HOLY MYSTERIES</h1>
          <p className="page-content__subtitle">
            الأسرار السبعة المقدسة — The Seven Sacraments of the Coptic Orthodox Church
          </p>
        </div>

        {/* ─── INTRODUCTION ─── */}
        <p>
          The Coptic Orthodox Church, as heir of the Apostolic Church of Alexandria founded by St. Mark
          the Evangelist in c. 42 AD, recognizes <strong>Seven Holy Mysteries</strong> (Greek:{' '}
          <em>Mysteria</em>; Coptic: <em>Mystirion</em>; Arabic: <em>Asrar</em>) — sacred acts
          instituted by Christ and the Apostles through which the Holy Spirit imparts invisible divine
          grace through visible signs and elements.
        </p>
        <p>
          These are not merely rituals or symbolic ceremonies. They are channels of actual, objective,
          supernatural grace — transforming the soul, sealing the believer, forgiving sins, healing the
          body, and uniting the faithful to Christ's own death, resurrection, and ongoing intercession.
          To receive them worthily is to receive Christ Himself.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── WHY SEVEN? ─── */}
        <h2>Why Seven Sacraments — Not Two?</h2>
        <p>
          The dominant Protestant position (codified in the Anglican Articles of Religion, Article XXV,
          and followed by most Reformed traditions) recognizes only <strong>two sacraments</strong>:
          Baptism and the Lord's Supper — limiting sacraments to those with an explicit command from
          Christ accompanied by a visible sign. The remaining five are called "rites" or "ordinances"
          but not sacraments in the full sense.
        </p>
        <p>
          The Coptic Orthodox response is theological: a sacrament is a{' '}
          <em>
            "sacred action in which believers receive invisible grace through material or visible
            signs and elements"
          </em>{' '}
          (Bishop Mettaous, <em>Sacramental Rites in the Coptic Orthodox Church</em>). This definition
          — which the whole ancient Church held — does not require direct, explicit dominical institution
          in a Gospel pericope. It requires that the action:
        </p>
        <ul>
          <li>Was instituted by Christ or His Apostles acting under His authority</li>
          <li>Employs a visible, physical element (water, oil, bread, wine, laying on of hands)</li>
          <li>Conveys genuine invisible grace through the operation of the Holy Spirit</li>
          <li>Has been practiced continuously by the Church since the apostolic age</li>
        </ul>
        <p>
          By this standard — which the Church holds is the standard of Scripture, not of 16th-century
          hermeneutics — all seven are genuine sacraments, each attested by Scripture, by the
          apostolic writings, and by an unbroken chain of patristic witness.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── THE THREE PERMANENT SACRAMENTS ─── */}
        <h2>The Three Permanent vs. Four Repeatable Mysteries</h2>
        <p>
          Three sacraments leave an <strong>indelible spiritual seal</strong> and may never be
          repeated: <strong>Baptism</strong>, <strong>Chrismation</strong>, and{' '}
          <strong>Holy Orders</strong>. Like a brand upon the soul, they permanently mark the
          believer's identity in Christ.
        </p>
        <p>
          Four sacraments may be received repeatedly as the Christian journey unfolds:{' '}
          <strong>Confession</strong>, <strong>the Holy Eucharist</strong>,{' '}
          <strong>Unction of the Sick</strong>, and <strong>Holy Matrimony</strong> (once per
          spouse; a second marriage receives a lesser blessing).
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SEVEN MYSTERIES GRID ─── */}
        <h2>The Seven Holy Mysteries</h2>
        <div className="sacraments-grid">
          {MYSTERIES.map((m) => (
            <div key={m.number} className="sacrament-card">
              <div className="sacrament-card__header">
                <span className="sacrament-card__number">{m.number}</span>
                <span className="sacrament-card__icon">{m.icon}</span>
                <div>
                  <h3 className="sacrament-card__title">{m.name}</h3>
                  <p className="sacrament-card__arabic">{m.arabic}</p>
                </div>
              </div>
              <p className="sacrament-card__tagline">{m.tagline}</p>
              <blockquote className="sacrament-card__verse">
                <span className="ref">{m.verse}</span> {m.verseText}
              </blockquote>
              <p className="sacrament-card__summary">{m.summary}</p>
              <div className="sacrament-card__distinctions">
                <div className="sacrament-card__distinction sacrament-card__distinction--coptic">
                  <strong>Coptic Distinctive:</strong> {m.copticDistinctive}
                </div>
                <div className="sacrament-card__distinction sacrament-card__distinction--protestant">
                  <strong>vs. Protestant:</strong> {m.protestantContrast}
                </div>
              </div>
              {m.path.startsWith('/') && !m.path.includes('#') ? (
                <Link to={m.path} className="sacrament-card__link">
                  Read the full theology →
                </Link>
              ) : (
                <a href={m.path} className="sacrament-card__link">
                  Read the full theology →
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── APOSTOLIC SEQUENCE ─── */}
        <h2>The Apostolic Sequence of Initiation</h2>
        <p>
          The first three sacraments together constitute <strong>Christian initiation</strong> — the
          complete incorporation of a person into Christ and His Body. In the Coptic rite, all three
          are typically administered in a single liturgical event:
        </p>
        <ol>
          <li>
            <strong>Baptism</strong> — the new birth; sins washed away; union with Christ's death
            and resurrection
          </li>
          <li>
            <strong>Chrismation</strong> — the seal of the Holy Spirit; the 36-point anointing with
            Holy Myron immediately following immersion
          </li>
          <li>
            <strong>First Holy Communion</strong> — the newly baptized receives the Body and Blood
            of Christ before any other food; completing initiation into the covenant body
          </li>
        </ol>
        <p>
          This sequence — Baptism → Chrismation → Eucharist — is identical to what Tertullian,
          Cyril of Jerusalem, and Chrysostom describe in the 2nd–4th centuries. It has never changed
          in the Coptic Church.
        </p>
        <p>
          Confession and Unction of the Sick are the <strong>ongoing medicine</strong> of the soul:
          Confession restores communion after sin; Unction heals the wounds of body and spirit.
          Holy Orders perpetuates the chain of apostolic authority through which all sacraments are
          administered. Holy Matrimony hallows the family as a domestic church.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SOURCES NOTE ─── */}
        <p className="protestant-note">
          <strong>Primary sources for this overview:</strong>{' '}
          <em>Sacramental Rites in the Coptic Orthodox Church</em> by H.G. Bishop Mettaous;{' '}
          <em>Salvation in the Orthodox Concept</em> and{' '}
          <em>Comparative Theology</em> by Pope Shenouda III; copticchurch.net; copticheritage.org;
          st-takla.org; ukmidcopts.org; stmaryandstjohn.org. Patristic texts from Ante-Nicene
          Fathers and Nicene and Post-Nicene Fathers (Hendrickson Publishers).
        </p>
      </div>
    </PageShell>
  );
}
