import PageShell from '../components/PageShell';
import FatherQuote from '../components/FatherQuote';

export default function ConfessionPage() {
  return (
    <PageShell>
      <div className="page-content">
        <div className="page-content__header">
          <h1>THE SACRAMENT OF REPENTANCE &amp; CONFESSION</h1>
          <p className="page-content__subtitle">
            التوبة والاعتراف — Priestly Absolution in the Coptic Orthodox Church
          </p>
        </div>

        {/* ─── INTRODUCTION ─── */}
        <p>
          For the Coptic Orthodox Church, repentance and confession are not two separate acts but
          one inseparable sacrament with two dimensions. <strong>Repentance</strong>{' '}
          (<em>metanoia</em>) is the interior transformation — genuine contrition, resolve to
          change, and faith in God's mercy. <strong>Confession</strong> is its exterior expression:
          the verbal acknowledgment of specific sins before an ordained priest who holds, by
          Christ's own delegation, the authority to forgive or retain those sins.
        </p>
        <p>
          Neither half is sufficient alone. Pope Shenouda III, in{' '}
          <em>The Spiritual Means of Salvation</em>, writes: "Repentance without confession is an
          incomplete act." And confession without genuine repentance is an empty ritual. Together
          they constitute the sacrament through which the Christian, having fallen, is restored to
          full communion with God and with the Church — and re-qualified to receive the Holy
          Eucharist.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 1: THEOLOGY ─── */}
        <h2>I. What the Sacrament Accomplishes</h2>

        <h3>1.1 Forgiveness of Post-Baptismal Sin</h3>
        <p>
          Baptism washes away the inherited corruption of Adam and all pre-baptismal sins. But what
          happens when the baptized person sins after baptism? The Church's answer — consistent from
          the apostolic age — is the Sacrament of Repentance and Confession. Through the priest's
          absolution, Christ's authority to forgive sins is exercised, and the specific confessed
          sins are truly remitted.
        </p>
        <p>
          The Coptic Church teaches that absolution does not merely declare what has already happened
          in a private spiritual transaction between the soul and God. The priest's pronouncement of
          absolution is itself efficacious — it is Christ acting through His ordained minister.
        </p>

        <h3>1.2 Restoration to Communion</h3>
        <p>
          Unconfessed mortal sin breaks communion with God and with the Church. The penitent who has
          not confessed cannot validly receive the Holy Eucharist. Confession restores this communion,
          re-opening the way to the sacramental life. This is why the Coptic tradition prescribes
          confession before every Communion — not as a burdensome legalism, but as a recognition
          that one should approach the Lord's Body and Blood only in a state of restored relationship.
        </p>

        <h3>1.3 Healing of the Soul</h3>
        <p>
          Beyond forgiveness, the sacrament provides ongoing spiritual direction through the
          confessor. The priest is not merely a judge pronouncing acquittal; he is a physician
          diagnosing the soul's wounds and prescribing remedies — fasting, prayer, acts of charity,
          spiritual reading — tailored to the penitent's specific struggle. St. Gregory of Nyssa
          calls the confessor the "spiritual physician."
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 2: BIBLICAL BASIS ─── */}
        <h2>II. The Biblical Foundation</h2>

        <h3>2.1 The Institution by Christ</h3>
        <blockquote className="scripture-block">
          <span className="ref">John 20:21–23</span>
          "So Jesus said to them again, 'Peace to you! As the Father has sent Me, I also send you.'
          And when He had said this, He breathed on them, and said to them, 'Receive the Holy
          Spirit. If you forgive the sins of any, they are forgiven them; if you retain the sins
          of any, they are retained.'"
        </blockquote>
        <p>
          This passage is the direct institution of the sacrament of confession. Christ, on the
          evening of His resurrection, breathes the Holy Spirit upon the Apostles and explicitly
          grants them the authority to forgive or retain sins. This authority presupposes that
          someone must hear the sins — you cannot "forgive the sins of any" if no sins have been
          disclosed. The confession of sins to the minister is therefore not a human invention but
          an apostolic necessity flowing directly from Christ's command.
        </p>
        <blockquote className="scripture-block">
          <span className="ref">Matthew 18:18</span>
          "Assuredly, I say to you, whatever you bind on earth will be bound in heaven, and whatever
          you loose on earth will be loosed in heaven."
        </blockquote>
        <p>
          The "binding and loosing" authority — given first to Peter (Matthew 16:19) and then to all
          the Apostles — is the apostolic basis for priestly absolution. The Coptic Church reads this
          in continuity with John 20:23: to "loose" a sin is to forgive it through priestly
          absolution; to "bind" a sin is to retain it.
        </p>

        <h3>2.2 Old and New Testament Witness</h3>
        <blockquote className="scripture-block">
          <span className="ref">James 5:16</span>
          "Confess your trespasses to one another, and pray for one another, that you may be
          healed. The effective, fervent prayer of a righteous man avails much."
        </blockquote>
        <blockquote className="scripture-block">
          <span className="ref">Leviticus 5:5–6</span>
          "And it shall be, when he is guilty in any of these matters, that he shall confess that
          he has sinned in that thing; and he shall bring his trespass offering to the LORD for
          his sin which he has committed."
        </blockquote>
        <p>
          The Old Testament pattern is clear: forgiveness from God requires verbal confession before
          a priest and the offering of a sacrifice. The New Testament fulfillment is Christic:
          the one sacrifice is Christ Himself; the priest is His ordained minister; and the
          confession is made not through blood of bulls and goats but through the sacramental
          authority of John 20:23.
        </p>
        <blockquote className="scripture-block">
          <span className="ref">Acts 19:18</span>
          "And many who had believed came confessing and telling their deeds."
        </blockquote>
        <p>
          The early Church's practice of public confession before the bishop confirms the
          sacramental character of the act. The Coptic Church teaches that early Christian
          confession was public — before the assembly — and that the current private form is a
          development of the same apostolic reality, not a departure from it.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 3: THE RITE ─── */}
        <h2>III. The Rite of Confession: How the Coptic Church Confesses</h2>

        <h3>3.1 Preparation</h3>
        <p>
          The penitent prepares by examining the conscience thoroughly — many Copts do this monthly,
          tracing sins against God, neighbor, and self. Some write the sins down (the list is
          destroyed after confession). The examination is accompanied by private prayer asking God to
          reveal hidden or forgotten sins.
        </p>

        <h3>3.2 The Three-Fold Requirement</h3>
        <p>
          The Coptic tradition teaches that complete repentance has three dimensions:
        </p>
        <ol>
          <li>
            <strong>To the wronged person:</strong> Reconciliation with the neighbor — "if you bring
            your gift to the altar and there remember that your brother has something against you,
            leave your gift there and go be reconciled" (Matthew 5:23–24)
          </li>
          <li>
            <strong>To God:</strong> Acknowledgment of having offended the divine majesty — "Against
            You, You only, have I sinned" (Psalm 51:4)
          </li>
          <li>
            <strong>To the priest:</strong> Ecclesiastical confession for sacramental absolution —
            John 20:23
          </li>
        </ol>
        <p>
          All three are required. A person who has confessed to God alone but not to the priest has
          not received the sacrament. A person who has confessed to the priest without inner
          repentance has made an invalid confession.
        </p>

        <h3>3.3 The Ceremony</h3>
        <p>
          The penitent kneels; the priest stands (in a quiet corner of the church). Both make the
          Sign of the Cross; both pray the Lord's Prayer. The penitent confesses all sins, beginning
          with the most serious. The priest listens — neither condemning harshly nor being lax —
          and offers spiritual counsel.
        </p>
        <p>
          The priest then pronounces <strong>three prayers of absolution:</strong>
        </p>
        <ol>
          <li>
            <strong>First absolution:</strong> Petitions God to crush Satan's deceptions and free
            the penitent
          </li>
          <li>
            <strong>Second absolution:</strong> Asks God to restore the peace lost through sin,
            instill the fear of God, and "adorn them with virtues"
          </li>
          <li>
            <strong>Third absolution:</strong> Invokes the Holy Spirit to remit sins "knowingly or
            unknowingly, in deed or in word"
          </li>
        </ol>
        <p>
          The priest places the cross on the penitent's <em>head</em> (not on another priest, who
          would receive it on the shoulder). The penitent performs a <em>metania</em> (prostration —
          literally "repentance"), kisses the priest's cross and hand, and prays a thanksgiving
          prayer. The rite concludes with reception of the Holy Eucharist as soon as possible.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 4: THE CONFESSION FATHER ─── */}
        <h2>IV. The Abu'l-I'tiraf: The Father of Confession</h2>
        <p>
          A distinctive feature of Coptic spirituality is the institution of the{' '}
          <strong><em>Abu'l-I'tiraf</em></strong> (Arabic: "Father of Confession") — the personal
          spiritual director to whom every Copt confesses. This relationship is considered sacred,
          permanent, and quasi-parental. The confessor knows the penitent's full spiritual history,
          recurring struggles, and particular temptations. He guides the soul with a consistency
          that an anonymous confessor cannot provide.
        </p>
        <p>
          The Coptic Church recommends that a married couple share the same Confession Father, so
          that their household receives unified spiritual direction. The Abu'l-I'tiraf system
          reflects the Coptic understanding that Christianity is not merely a private transaction
          between the soul and God but a relationship mediated and sustained within the Body of
          Christ through its ordained ministers.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 5: PATRISTIC WITNESS ─── */}
        <h2>V. The Church Fathers on Confession</h2>

        <FatherQuote author="St. Athanasius of Alexandria" work="Festal Letter 7" year="c. 335 AD">
          "As the baptized is enlightened by the grace of the Holy Spirit, by means of the priest,
          the repentant is granted forgiveness of his sins by the grace of Christ, also through
          the priest."
        </FatherQuote>
        <FatherQuote author="St. John Chrysostom" work="On the Priesthood VI:5" year="c. 390 AD">
          "Priests have received a power which God has given neither to angels nor archangels…
          Whatsoever [the priest] has bound, is bound; and what he has loosed, is loosed. For
          that power affects the soul itself and reaches up to heaven."
        </FatherQuote>
        <FatherQuote author="St. Gregory of Nyssa" work="Catechetical Oration" year="c. 385 AD">
          "Regard the church priest as a spiritual father for you, reveal to him your secrets
          openly, just as a patient reveals his hidden wounds to the physician, and so is healed."
        </FatherQuote>
        <FatherQuote author="The Didache" work="Chapter 14" year="c. 90–110 AD">
          "But before breaking bread, confess your sins so that your sacrifice may be pure. But
          if anyone has a dispute with his companion, let him not come with you until they have
          been reconciled, so that your sacrifice may not be polluted."
        </FatherQuote>
        <FatherQuote author="St. Basil the Great" work="On the True Faith" year="c. 374 AD">
          "As we bear the scalpel of the physician to remedy the body and the medicine's bitterness,
          we also should bear the suffering of rebuke, chastisement and various practices so that
          the soul may be remedied."
        </FatherQuote>
        <FatherQuote author="Origen of Alexandria" work="Homilies on Leviticus 2:4" year="c. 248 AD">
          "Consider carefully whether one of the ways of obtaining forgiveness of sins is not this:
          when the sinner, not blushing to confess his sins to a priest of the Lord, seeks the
          remedy… For if 'the sick man is ashamed to confess his wound to the physician, the art
          of medicine cannot cure what it does not know.'"
        </FatherQuote>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 6: PROTESTANT CONTRAST ─── */}
        <h2>VI. Confession in the Coptic Church vs. Protestant Practice</h2>

        <h3>6.1 The Protestant Position</h3>
        <p>
          The Protestant Reformers rejected auricular (ear) confession to a priest as a human
          invention without scriptural warrant. Luther, Calvin, and Zwingli all held that sins must
          be confessed directly to God (1 John 1:9), and that Christ alone is the one Mediator
          (1 Timothy 2:5). A pastor may offer counsel and assurance, but has no authority to
          pronounce absolution that objectively effects forgiveness.
        </p>
        <p>
          Pope Shenouda III, in <em>Comparative Theology</em>, identifies two Protestant groups:
          those who openly deny confession to a priest as idolatrous, and those who subtly replace
          it with pietistic language about "casting yourself at God's feet" — which sounds devout
          but removes the sacramental element entirely.
        </p>

        <h3>6.2 The Coptic Response</h3>
        <p>
          The Coptic Church's response is threefold:
        </p>
        <ol>
          <li>
            <strong>John 20:23 is explicit.</strong> Christ gave specific authority to forgive or
            retain sins to ordained ministers. If this authority is real, then the minister must
            hear the sins — a silent absolution is meaningless. Protestant exegesis that
            reads John 20:23 as merely "declaring" what God has already decided evacuates the
            passage of its plain meaning.
          </li>
          <li>
            <strong>1 Timothy 2:5 is not violated.</strong> The priest does not act as a second
            mediator independent of Christ. He acts as Christ's instrument — as a physician is
            the instrument of healing, though healing comes from God. There is one Mediator, and
            that Mediator chose to exercise His mediation through ordained ministers: "As the
            Father has sent Me, I also send you" (John 20:21).
          </li>
          <li>
            <strong>The Didache (c. 90–110 AD) demands it.</strong> The earliest post-apostolic
            document prescribes confession before Communion. If this was an apostolic-era
            innovation, the Reformers (who claimed to restore the apostolic church) should have
            embraced it. Their rejection of it reflects 16th-century hermeneutical assumptions,
            not apostolic practice.
          </li>
        </ol>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SOURCES NOTE ─── */}
        <p className="protestant-note">
          <strong>Primary sources consulted:</strong> CopticChurch.net sacraments section;{' '}
          <em>Sacramental Rites in the Coptic Orthodox Church</em> by H.G. Bishop Mettaous;{' '}
          <em>Comparative Theology</em> and <em>The Spiritual Means of Salvation</em> by Pope
          Shenouda III (available at st-takla.org); copticorthodoxanswers.org; Origen,{' '}
          <em>Homilies on Leviticus</em> (ANF Vol. IV); St. John Chrysostom,{' '}
          <em>On the Priesthood</em> (NPNF Series I, Vol. IX); <em>The Didache</em> (ANF Vol. VII).
        </p>
      </div>
    </PageShell>
  );
}
