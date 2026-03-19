import PageShell from '../components/PageShell';
import FatherQuote from '../components/FatherQuote';

export default function MatrimonyPage() {
  return (
    <PageShell>
      <div className="page-content">
        <div className="page-content__header">
          <h1>THE SACRAMENT OF HOLY MATRIMONY</h1>
          <p className="page-content__subtitle">
            الزواج المقدس — Marriage as Sacred Mystery in the Coptic Orthodox Church
          </p>
        </div>

        {/* ─── INTRODUCTION ─── */}
        <p>
          Holy Matrimony is the sacrament in which a man and a woman are united by a priest in the
          presence of God, becoming — through the action of the Holy Spirit — "one flesh" in an
          indissoluble bond that images the eternal union of Christ and His Church. It is not a
          civil contract blessed by the Church, not a private agreement between two individuals,
          and not a ceremony of societal recognition. It is a <em>mysterion</em> — the very word
          Paul uses in Ephesians 5:32 — a sacred mystery through which invisible divine grace
          transforms and elevates the human covenant of love.
        </p>
        <p>
          Bishop Mettaous defines the sacrament as{' '}
          <em>"a holy sacrament, officiated by a priest, of uniting a man to a woman, so that
          through the Holy Spirit they become one flesh, enjoying the blessings of love, children,
          and mutual support, and helping each other in the way of righteousness and holiness."</em>
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 1: THEOLOGY ─── */}
        <h2>I. Marriage as a Sacrament: The Theological Case</h2>

        <h3>1.1 The Word "Mysterion" in Ephesians 5:32</h3>
        <p>
          The theological warrant for marriage as a sacrament is found in a single word of Paul's:
        </p>
        <blockquote className="scripture-block">
          <span className="ref">Ephesians 5:31–32</span>
          "'For this reason a man shall leave his father and mother and be joined to his wife,
          and the two shall become one flesh.' This is a great mystery (<em>mysterion</em>), but
          I speak concerning Christ and the Church."
        </blockquote>
        <p>
          The Greek word <em>mysterion</em> — translated in the Latin Vulgate as <em>sacramentum</em>{' '}
          — is the same word the Church uses for all seven sacraments. Paul is not merely saying
          marriage is a profound metaphor for Christ's love. He is declaring that the marital union
          participates in and enacts the divine reality it signifies: the union of the eternal
          Bridegroom with His Bride.
        </p>

        <h3>1.2 Three Purposes of Christian Marriage</h3>
        <ol>
          <li>
            <strong>Cooperation (mutual support):</strong> The equal partnership of husband and
            wife in bearing the burdens of life — "a helper comparable to him" (Genesis 2:18)
          </li>
          <li>
            <strong>Procreation:</strong> Bearing children who will be raised in the knowledge
            of God — "children are a heritage from the LORD" (Psalm 127:3)
          </li>
          <li>
            <strong>Protection against immorality:</strong> Channeling human sexuality within the
            sanctified bond — "to avoid sexual immorality, let each man have his own wife"
            (1 Corinthians 7:2)
          </li>
        </ol>

        <h3>1.3 Indissolubility</h3>
        <p>
          The Coptic Church holds marriage to be indissoluble for its duration, dissolved only
          by death, or in exceptional cases (adultery, apostasy) with full ecclesiastical
          permission. Christ's words are unambiguous:
        </p>
        <blockquote className="scripture-block">
          <span className="ref">Matthew 19:6</span>
          "So then, they are no longer two but one flesh. Therefore what God has joined together,
          let not man separate."
        </blockquote>
        <p>
          The Coptic tradition speaks of "the Nazarene knot" — an unbreakable bond tied at the
          altar. It can only be broken by "a strange person who entered and corrupted the holy
          unity" — that is, adultery or apostasy — and only by formal ecclesiastical process,
          not by civil divorce alone.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 2: BIBLICAL BASIS ─── */}
        <h2>II. The Biblical Foundation</h2>
        <blockquote className="scripture-block">
          <span className="ref">Genesis 2:18–24</span>
          "And the LORD God said, 'It is not good that man should be alone; I will make him a
          helper comparable to him.'… Therefore a man shall leave his father and mother and be
          joined to his wife, and they shall become one flesh."
        </blockquote>
        <blockquote className="scripture-block">
          <span className="ref">John 2:1–11</span>
          "On the third day there was a wedding in Cana of Galilee, and the mother of Jesus was
          there. Now both Jesus and His disciples were invited to the wedding. And when they ran
          out of wine, the mother of Jesus said to Him, 'They have no wine'… This beginning of
          signs Jesus did in Cana of Galilee, and manifested His glory."
        </blockquote>
        <p>
          Christ's choice to attend a wedding and to perform His first miracle there is not
          incidental. He consecrated marriage by His presence, elevated it by His miracle,
          and demonstrated its sacred character by blessing it with the very sign of His
          divine glory. The Coptic rite explicitly recalls Cana in its liturgical prayers.
        </p>
        <blockquote className="scripture-block">
          <span className="ref">Hebrews 13:4</span>
          "Marriage is honorable among all, and the bed undefiled."
        </blockquote>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 3: THE THREE STAGES OF THE RITE ─── */}
        <h2>III. The Rite of Holy Matrimony: Three Stages</h2>

        <h3>Stage One: Betrothal (الخطوبة)</h3>
        <p>
          The Coptic rite distinguishes carefully between betrothal and marriage — a distinction
          with profound theological significance:
        </p>
        <ul>
          <li>
            At betrothal, the <strong>couple themselves</strong> place rings on each other (not
            the priest) — the ring of engagement is a pledge, not yet an unbreakable bond
          </li>
          <li>Minimum duration: a fortnight, to allow reflection and consent</li>
          <li>Official betrothal document signed by couple, witnesses, and priest</li>
          <li>Betrothal prayers and Thanksgiving are offered</li>
          <li>
            Betrothal may be dissolved without sin — it is a promise, not yet a sacramental bond
          </li>
        </ul>

        <h3>Stage Two: The Marriage Ceremony (القران المقدس)</h3>
        <p>
          The marriage ceremony is performed in the church — the house of God — with the
          following elements:
        </p>
        <ul>
          <li>
            <strong>Processional entry</strong> with liturgical chanting, led by the priest
          </li>
          <li>
            <strong>Marriage vows</strong> with the Sign of the Cross made on both foreheads,
            invoking the Trinity
          </li>
          <li>
            <strong>Ring placement by the priest:</strong> Gold rings (imperishable, inscribed
            with each spouse's name) are placed on the left hand (near the heart). The PRIEST
            places them — not the couple. This act by the priest makes the bond permanent and
            sacramental; it cannot be undone by the couple's own decision
          </li>
          <li>
            <strong>Red silk ribbon:</strong> Tied around the couple's clasped hands using three
            knots during three Signs of the Cross — symbolizing the bond to Christ's blood and
            to the Holy Trinity. The ribbon unites them to each other and to God
          </li>
          <li>
            <strong>White veil</strong> covering joined hands — originally the veil for receiving
            Holy Communion, symbolizing purity and the covering of Christ
          </li>
          <li>
            <strong>Pauline reading:</strong> Ephesians 5:22–6:3 — "Husbands, love your wives
            as Christ loved the Church"
          </li>
          <li>
            <strong>Gospel reading:</strong> Matthew 19:2–6 — "What God has joined together,
            let not man separate"
          </li>
          <li>
            <strong>Anointing with oil:</strong> For sanctification and protection against
            lustful thoughts and temptations
          </li>
        </ul>

        <h3>Stage Three: The Crowning (التيجان)</h3>
        <p>
          For couples who are both entering marriage as virgins, the rite includes a crowning —
          one of the most ancient and beautiful elements of Eastern Christian matrimony:
        </p>
        <ul>
          <li>Crowns are placed on the head of husband and wife</li>
          <li>
            They become king and queen of their household — a domestic church under Christ's
            lordship
          </li>
          <li>
            The crowning prayer: <em>"Crown them with glory and honor"</em> (Psalm 8:5)
          </li>
          <li>
            The crowns also anticipate the eternal crowns of glory for which the couple run
            together toward God
          </li>
          <li>
            The bride stands at the groom's <em>right</em> side (Psalm 45:9: "At Your right
            hand stands the queen")
          </li>
        </ul>

        <h3>The Tagleesa: Post-Nuptial Rite</h3>
        <p>
          The <em>Tagleesa</em> ("untying of the ribbon") is celebrated three days to a week
          after the ceremony, historically marking the end of the nuptial period and the
          beginning of ordinary married life. It is unique to the Coptic tradition and reflects
          the liturgical completeness of the sacrament.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 4: PATRISTIC WITNESS ─── */}
        <h2>IV. The Church Fathers on Holy Matrimony</h2>

        <FatherQuote author="St. John Chrysostom" work="Homily 20 on Ephesians" year="c. 390 AD">
          "There is no relationship between human beings so close as that of husband and wife, if
          they are united as they ought to be… Paul speaks of Christ as the greater mystery; for
          He left the Father and came down to us, and married His Bride, the Church, and became
          one spirit with her."
        </FatherQuote>
        <FatherQuote author="St. John Chrysostom" work="Homily 19 on 1 Corinthians" year="c. 392 AD">
          "Marriage is a serious thing, and a mystery of no small account, being a type of the
          presence of Christ… Where Christ is present, there all is made pure."
        </FatherQuote>
        <FatherQuote author="St. Gregory the Theologian" work="Oration 40" year="c. 381 AD">
          "The first marriage is a law, the second marriage is forgiveness, the third is
          transgression, and any beyond that is swine-like."
        </FatherQuote>
        <FatherQuote author="St. Ignatius of Antioch" work="Epistle to Polycarp 5" year="c. 107 AD">
          "It is right for men and women who marry to be united with the knowledge of the bishop,
          so that their marriage may be according to the Lord and not according to lust."
        </FatherQuote>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SECTION 5: PROTESTANT CONTRAST ─── */}
        <h2>V. Holy Matrimony vs. Protestant Marriage</h2>

        <h3>5.1 Sacrament vs. Covenant</h3>
        <p>
          The Protestant Reformers rejected marriage as a sacrament on the grounds that it lacks
          a dominical institution in the New Testament with a visible sign. Luther regarded
          marriage as a "worldly matter" — an honorable estate blessed by God, but not a vehicle
          of saving grace. Calvin similarly denied its sacramental character.
        </p>
        <p>
          The Coptic Church holds that Paul's use of <em>mysterion</em> (Ephesians 5:32) is
          itself the dominical warrant — and that the Incarnation, in which Christ took a Body
          and became one with humanity, is the foundation that gives marriage its sacramental
          depth. If the union of Christ and the Church is a <em>mysterion</em>, and if marriage
          images that union, then marriage participates in the divine mystery it represents.
        </p>

        <h3>5.2 Divorce and Remarriage</h3>
        <p>
          Perhaps the most practically significant contrast: many Protestant denominations permit
          divorce and remarriage with relative freedom, citing Matthew 19:9 (the "exception
          clause" for marital unfaithfulness) and pastoral compassion for those in difficult
          circumstances.
        </p>
        <p>
          The Coptic Church holds marriage as indissoluble, permitting ecclesiastical dissolution
          only for adultery or apostasy, and requiring formal permission for any remarriage.
          A widow or widower who remarries receives a different, lesser blessing than a first
          marriage — not as condemnation, but as an acknowledgment that the first bond was
          permanent in its character.
        </p>

        <h3>5.3 The Role of the Priest</h3>
        <p>
          In Protestant theology, the minister of marriage is the couple themselves — the pastor
          is merely a legal witness and liturgical officiant. The consent of the couple
          constitutes the marriage.
        </p>
        <p>
          In the Coptic sacramental theology, the priest is the minister of the sacrament — he
          places the rings (making the bond permanent), ties the ribbon, administers the
          anointing with oil, pronounces the blessings, and crowns the couple. It is the priestly
          act, joined to the couple's consent, that elevates the human covenant to a sacramental
          union. This is why the placement of rings by the priest (unlike betrothal, where the
          couple place their own rings) is theologically determinative.
        </p>

        <div className="section-divider section-divider--rule">─────  ✦  ─────</div>

        {/* ─── SOURCES NOTE ─── */}
        <p className="protestant-note">
          <strong>Primary sources consulted:</strong> CopticChurch.net sacrament of matrimony;{' '}
          <em>Sacramental Rites in the Coptic Orthodox Church</em> by H.G. Bishop Mettaous;
          copticheritage.org (Sacrament of Holy Matrimony); St. John Chrysostom,{' '}
          <em>Homily 20 on Ephesians</em> (NPNF Series I, Vol. XIII); St. Ignatius of Antioch,{' '}
          <em>Epistle to Polycarp</em> (ANF Vol. I); stmaryandstjohn.org; ukmidcopts.org.
        </p>
      </div>
    </PageShell>
  );
}
