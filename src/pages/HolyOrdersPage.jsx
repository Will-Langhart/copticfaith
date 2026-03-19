import PageShell from '../components/PageShell';
import FatherQuote from '../components/FatherQuote';

export default function HolyOrdersPage() {
  return (
    <PageShell>
      <div className="page-content">
        <div className="page-content__header">
          <h1>THE SACRAMENT OF HOLY ORDERS</h1>
          <p className="page-content__subtitle">
            سر الكهنوت — Apostolic Succession and Ordained Ministry in the Coptic Orthodox Church
          </p>
        </div>

        {/* ─── INTRODUCTION ─── */}
        <p>
          The Sacrament of Holy Orders (<em>Rasm al-Kahnut</em> in Arabic; <em>Cheirotonía</em> in
          Greek — "laying on of hands") is the sacrament through which the Holy Spirit descends
          upon an elected candidate, ordaining him into one of the ranks of the sacred ministry.
          Through the bishop's laying on of hands — itself an unbroken chain stretching to the
          Apostles — the ordained receives not merely a functional appointment but an ontological
          transformation: he becomes Christ's minister in a specific, irrevocable way.
        </p>
        <p>
          The Coptic word for priest, <em>Ooab</em>, means "righteous" or "saintly." The sacrament
          is defined by Bishop Mettaous as <em>"a holy sacrament through which the bishop lays
          his hands on the head of the elected candidate, so that the Holy Spirit will descend on
          him and grant him one of the priestly ranks."</em> Like Baptism and Chrismation, Holy
          Orders leaves an indelible spiritual seal — a priest is always a priest.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 1: THEOLOGY ─── */}
        <h2>I. What Holy Orders Accomplishes</h2>

        <h3>1.1 Transmission of Apostolic Authority</h3>
        <p>
          The primary effect of Holy Orders is the transmission of apostolic authority from bishop
          to candidate. This authority — to teach, to sanctify, to govern, and to administer the
          sacraments — originates with Christ ("As the Father has sent Me, I also send you,"
          John 20:21), was given to the Apostles, and has been transmitted through an unbroken
          chain of episcopal ordination across twenty centuries.
        </p>
        <p>
          The Coptic apostolic succession runs specifically through St. Mark the Evangelist, who
          founded the Church of Alexandria c. 42 AD and ordained its first bishop, Ananianus.
          The current Pope of Alexandria is the <strong>118th successor of St. Mark</strong> —
          one of the oldest continuous episcopal successions in Christianity.
        </p>

        <h3>1.2 Sacramental Power</h3>
        <p>
          The ordained minister receives specific sacramental capacities appropriate to his rank:
          a deacon assists at the altar; a priest administers all sacraments except ordination;
          a bishop administers all sacraments including ordination. Without validly ordained
          priests, the Eucharist cannot be celebrated, sins cannot be absolved, the sick cannot
          be anointed — the entire sacramental life of the Church depends on the continuity
          of Holy Orders.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 2: BIBLICAL BASIS ─── */}
        <h2>II. The Biblical Foundation</h2>
        <blockquote className="scripture-block">
          <span className="ref">Luke 6:13</span>
          "And when it was day, He called His disciples to Himself; and from them He chose twelve
          whom He also named apostles."
        </blockquote>
        <blockquote className="scripture-block">
          <span className="ref">Acts 6:2–6</span>
          "Then the twelve summoned the multitude of the disciples and said, '…seek out from among
          you seven men of good reputation, full of the Holy Spirit and wisdom, whom we may appoint
          over this business.' … And they chose Stephen… whom they set before the apostles; and
          when they had prayed, they laid hands on them."
        </blockquote>
        <blockquote className="scripture-block">
          <span className="ref">1 Timothy 4:14</span>
          "Do not neglect the gift that is in you, which was given to you by prophecy with the
          laying on of the hands of the eldership."
        </blockquote>
        <blockquote className="scripture-block">
          <span className="ref">2 Timothy 1:6</span>
          "Therefore I remind you to stir up the gift of God which is in you through the laying
          on of my hands."
        </blockquote>
        <blockquote className="scripture-block">
          <span className="ref">Titus 1:5</span>
          "For this reason I left you in Crete, that you should set in order the things that are
          lacking, and appoint elders in every city as I commanded you."
        </blockquote>
        <blockquote className="scripture-block">
          <span className="ref">Hebrews 5:4</span>
          "And no man takes this honor to himself, but he who is called by God, just as Aaron was."
        </blockquote>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 3: THE THREE ORDERS ─── */}
        <h2>III. The Three Orders of the Coptic Priesthood</h2>

        <h3>3.1 The Diaconate — Five Ranks</h3>
        <p>
          The Coptic Church maintains one of the most elaborated diaconal structures in all of
          Christendom — five distinct ranks forming a living catechetical system:
        </p>
        <div className="mystery-comparison-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Coptic Name</th>
                <th>Role &amp; Minimum Age</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cantor / Hymnist</td>
                <td><em>Epsaltos</em></td>
                <td>Children ordained to chant hymns; entry into clerical formation</td>
              </tr>
              <tr>
                <td>Reader</td>
                <td><em>Ognostis / Anagnostis</em></td>
                <td>Reads Scripture and Epistles; must be literate in liturgical texts</td>
              </tr>
              <tr>
                <td>Sub-deacon</td>
                <td><em>Epideacon</em></td>
                <td>Guards doors, prepares censers, maintains liturgical order</td>
              </tr>
              <tr>
                <td>Deacon</td>
                <td><em>Diakonos</em></td>
                <td>Full liturgical service; may carry the chalice; minimum age 25</td>
              </tr>
              <tr>
                <td>Archdeacon</td>
                <td><em>Archidiakonos</em></td>
                <td>Leads all deacons; bishop's representative; minimum age 28</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Deacons wear a white tunic and a red stole crossing the left shoulder — the red symbolizing
          Christ's blood; the left shoulder signifying the carrying of the cross.
        </p>

        <h3>3.2 The Presbyterate — Three Ranks</h3>
        <div className="mystery-comparison-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Priest (<em>Kassis / Presbyter</em>)</td>
                <td>Administers all sacraments except ordination; minimum age 30 (when Christ began His ministry); must be husband of one living wife</td>
              </tr>
              <tr>
                <td><em>Hegumen</em></td>
                <td>Senior priest; administrative promotion; common in monastic communities</td>
              </tr>
              <tr>
                <td><em>Khoori-Episcopos</em></td>
                <td>Village bishop; monastic rank assisting diocesan bishops; highest non-episcopal priestly rank</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Priests must be "blameless, the husband of one wife, temperate, sober-minded, of good
          behavior, hospitable, able to teach" (1 Timothy 3:2). A widowed priest may not remarry.
          They wear a white tunic and black cloak.
        </p>

        <h3>3.3 The Episcopate — Three Ranks</h3>
        <div className="mystery-comparison-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bishop (<em>Episcopos</em>)</td>
                <td>Ordains deacons and priests; governs a diocese; must be celibate (monk or widower)</td>
              </tr>
              <tr>
                <td>Metropolitan</td>
                <td>Bishop of a major city or province; wider pastoral authority</td>
              </tr>
              <tr>
                <td>Patriarch / Pope</td>
                <td>Ordains bishops; prepares Holy Myron; 118th successor of St. Mark; See of Alexandria</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          A critical Coptic distinctive: <strong>all bishops must come from the monastic ranks</strong>.
          Every Coptic bishop is a celibate monk before his consecration. The episcopate is completely
          separated from the parish priesthood in terms of life commitment. This requirement is stricter
          than most other Orthodox churches.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 4: THE RITE ─── */}
        <h2>IV. The Rite of Ordination</h2>

        <h3>4.1 The Laying on of Hands</h3>
        <p>
          The bishop places his right hand on the candidate's head while praying for the descent
          of the Holy Spirit and the specific gifts of the rank being conferred. Three signs of
          the cross are made, invoking the Father, Son, and Holy Spirit. The congregation
          responds <em>"Axios"</em> (Greek: "He is worthy").
        </p>

        <h3>4.2 The Breath of the Holy Spirit (for Priests)</h3>
        <p>
          For priestly ordination, the bishop breathes the Holy Spirit into the mouth of the
          newly-ordained — directly re-enacting Christ's post-resurrection act in John 20:22
          ("He breathed on them and said, 'Receive the Holy Spirit'"). Five crosses are cut
          in the hair of newly-ordained priests, symbolizing the five wounds of Christ.
        </p>

        <h3>4.3 The Forty-Day Retreat</h3>
        <p>
          After ordination, new priests undergo a <strong>forty-day monastic retreat</strong> to
          "stir up the gift of God" (2 Timothy 1:6) through daily liturgical practice, prayer,
          and Scripture study. This mirrors Christ's forty days in the wilderness and Moses's
          forty days on Sinai — a unique Coptic tradition preparing the newly-ordained for the
          weight of priestly ministry.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 5: PATRISTIC WITNESS ─── */}
        <h2>V. The Church Fathers on Holy Orders</h2>

        <FatherQuote author="St. Ignatius of Antioch" work="Epistle to the Trallians 3" year="c. 107 AD">
          "Let no man do anything connected with the Church without the bishop. Let that be deemed
          a proper Eucharist, which is either under the bishop, or one to whom he shall have
          entrusted it. Without these [bishop, presbytery, deacons] it cannot be called a church."
        </FatherQuote>
        <FatherQuote author="St. Clement of Rome" work="Epistle to the Corinthians 44" year="c. 96 AD">
          "Our apostles also knew, through our Lord Jesus Christ, and there would be strife on
          account of the office of the episcopate. For this reason, therefore, since they had
          obtained a perfect foreknowledge of this, they appointed those [ministers] already
          mentioned, and afterwards gave instructions that when these should fall asleep, other
          approved men should succeed them in their ministry."
        </FatherQuote>
        <FatherQuote author="St. John Chrysostom" work="On the Priesthood VI:3" year="c. 390 AD">
          "Priests have received a power which God has given neither to angels nor archangels.
          It was said to them: 'Whatsoever ye shall bind on earth shall be bound in heaven;
          and whatsoever ye shall loose, shall be loosed.' Temporal rulers have indeed the power
          of binding; but they can only bind the body. Priests can bind with a bond which
          pertains to the soul itself and reaches up to heaven."
        </FatherQuote>
        <FatherQuote author="St. Hippolytus of Rome" work="Apostolic Tradition 3" year="c. 215 AD">
          "Let the bishop be ordained after he has been chosen by all the people… and when he
          has been named and shall please all, let him, on the Lord's Day, assemble with the
          presbytery and such bishops as may be present. All giving assent, the bishops shall
          lay hands upon him."
        </FatherQuote>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 6: PROTESTANT CONTRAST ─── */}
        <h2>VI. Holy Orders vs. Protestant Ministry</h2>

        <h3>6.1 Ontological vs. Functional</h3>
        <p>
          The Protestant Reformers — particularly Luther — rejected the Catholic and Orthodox
          theology of a distinct ordained priesthood through his doctrine of the{' '}
          <strong>"Priesthood of all believers"</strong> (1 Peter 2:9). In this view, all
          baptized Christians share equally in Christ's priesthood; ordained ministers are
          distinguished only functionally (by appointment to preach and administer sacraments),
          not ontologically (in their very being). Ordination does not change who the person is;
          it merely designates what they do.
        </p>
        <p>
          The Coptic Church holds the opposite: ordination confers an <em>indelible character</em>,
          a permanent ontological change. A priest who leaves the ministry is still a priest —
          as a baptized person who abandons faith is still baptized. The sacrament leaves an
          irrevocable mark. The Anglican Articles of Religion (Article XXV) explicitly name Holy
          Orders as one of the "five commonly called Sacraments… [that] are not to be counted
          for Sacraments of the Gospel" — the direct contrast to the Coptic position.
        </p>

        <h3>6.2 Apostolic Succession</h3>
        <p>
          Most Protestant denominations do not require or claim apostolic succession — an
          unbroken chain of episcopal ordination from the Apostles. For many, a church is
          validly constituted wherever two or three believers gather in Christ's name
          (Matthew 18:20).
        </p>
        <p>
          The Coptic Church holds that apostolic succession is essential to the validity of
          the sacraments. A Eucharist celebrated by a pastor with no valid apostolic ordination
          is, in the Coptic view, not a valid Eucharist. The chain of hands — bishop to bishop,
          stretching back to St. Mark and to the Lord's own command — is not a human institution.
          It is the means by which Christ's authority remains incarnate in the Church.
        </p>

        <h3>6.3 Sacramental Authority</h3>
        <p>
          In most Protestant traditions, any baptized believer may baptize, administer Communion,
          or pray for the sick. In the Coptic Church, only a validly ordained priest may
          administer the sacraments (except in emergencies where baptism may be administered
          by any believer). This is not clericalism — it is the recognition that Christ, who
          chose specific men and breathed His Spirit upon them, entrusted the stewardship of
          the mysteries to ordained ministers.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SOURCES NOTE ─── */}
        <p className="protestant-note">
          <strong>Primary sources consulted:</strong> CopticChurch.net sacrament of priesthood;{' '}
          <em>Sacramental Rites in the Coptic Orthodox Church</em> by H.G. Bishop Mettaous;
          copticheritage.org (Holy Ordination); wiki.suscopts.org (Sacrament of Priesthood);{' '}
          St. Ignatius of Antioch, <em>Epistle to the Trallians</em> (ANF Vol. I); St. Clement
          of Rome, <em>Epistle to the Corinthians</em> (ANF Vol. I); St. John Chrysostom,{' '}
          <em>On the Priesthood</em> (NPNF Series I, Vol. IX); St. Hippolytus,{' '}
          <em>Apostolic Tradition</em>.
        </p>
      </div>
    </PageShell>
  );
}
