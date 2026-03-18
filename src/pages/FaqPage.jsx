import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell';

const FAQS = [
  {
    q: 'Doesn\'t Sola Scriptura make church tradition unnecessary?',
    a: `The Coptic Church affirms the supreme authority of Scripture. But consider: the Reformers themselves relied on the decisions of the early Church. Luther, Calvin, and Zwingli all affirmed the Nicene Creed, the doctrine of the Trinity, and the canon of the New Testament—all of which were defined by church councils and church fathers, many of them Alexandrian.

Scripture itself commends apostolic tradition: "Stand fast and hold the traditions which you were taught, whether by word or our epistle" (2 Thessalonians 2:15). Paul distinguishes between "traditions of men" (Mark 7:8) and apostolic tradition that he commands the Church to preserve. The Coptic Church claims to be a faithful guardian of the latter—and the historical record supports that claim.`,
    ref: '2 Thessalonians 2:15 / 2 Timothy 2:2',
    sectionId: 'conclusion',
  },
  {
    q: 'What about the Council of Chalcedon (451 AD)?',
    a: `The Coptic Church separated from the Chalcedonian churches after 451 AD—but not because it denied that Christ has two natures. The Coptic position, called Miaphysitism, holds that Christ has one united nature from two natures (divine and human)—without confusion, mixture, and without change. This is crucially different from Monophysitism (the heresy that Christ has only one nature), with which the Coptic Church has been wrongly confused.

In modern ecumenical dialogues, both sides have acknowledged that the disagreement was largely terminological rather than substantive. The Coptic Church and the Eastern Orthodox churches issued joint declarations in 1989 and 1990 recognizing that they share the same Christological faith expressed in different terms.`,
    ref: 'Joint Declarations 1989–1990 (Chambesy, Switzerland)',
    sectionId: 'doctrines',
  },
  {
    q: 'Why should I trust non-biblical historical sources?',
    a: `For the same reason you trust that the books of the New Testament were written by their traditional authors, that the early Church existed and grew, and that the doctrines you hold were taught from the beginning. Even the most committed Protestant relies on historical evidence to confirm that the Bible was accurately transmitted.

The historical sources cited in this document—Eusebius, Papias, Jerome, and others—are the very sources that Protestant scholars use to establish the reliability of the New Testament itself. If we trust Eusebius to document which books are authentically apostolic, we should also trust what he says about the Alexandrian church.`,
    ref: null,
    sectionId: 'historical',
  },
  {
    q: 'Isn\'t asking saints to pray for us a form of idolatry?',
    a: `The Coptic Church explicitly forbids the worship of any creature, including saints and the Virgin Mary. Official Coptic teaching: "The worship of Saints is expressly forbidden by the Church; however, asking for their intercessions is central in any Coptic service." (copticcentre.com)

This is no different from asking a living Christian to pray for you—it is a request for prayer, not an act of worship. Worship belongs to God alone. The New Testament shows the saints in heaven interceding: in Revelation 5:8, the elders offer "golden bowls full of incense, which are the prayers of the saints" to God.`,
    ref: 'Revelation 5:8 / Hebrews 12:1',
    sectionId: 'saints',
  },
  {
    q: 'Doesn\'t 1 Timothy 2:5 rule out saintly intercession?',
    a: `Read the full context. In the very same passage where Paul affirms Christ as the one Mediator (verse 5), he commands Christians to make "supplications, prayers, intercessions… for all men" (verse 1). If any form of intercessory prayer violated Christ's unique mediation, Paul would be contradicting himself in the span of four verses.

The Coptic Church understands, as Paul does, that Christ is the sole Mediator of redemption—but that within the Body of Christ, members pray for one another. This distinction between mediating salvation (Christ alone) and offering intercessory prayer (all believers, living and departed) is biblical, logical, and consistent.`,
    ref: '1 Timothy 2:1, 5',
    sectionId: 'saints',
  },
  {
    q: 'Isn\'t the Eucharist just a memorial meal?',
    a: `The earliest Christian sources—all written within living memory of the Apostles—uniformly describe the Eucharist as the actual Body and Blood of Christ, not merely a symbol. Ignatius of Antioch (107 AD): "The Eucharist is the flesh of our Savior Jesus Christ, flesh which suffered for our sins." Justin Martyr (151 AD): "The food which has been made into the Eucharist by the Eucharistic prayer set down by Him is both the flesh and blood of that incarnated Jesus." These men were discipled by the Apostles' immediate successors.

Jesus's own words in John 6:53—"Unless you eat the flesh of the Son of Man and drink His blood, you have no life in you"—were taken literally by the earliest Christians, causing many disciples to leave (John 6:66). If it were merely symbolic, there would be no reason to leave.`,
    ref: 'John 6:53–56 / 1 Corinthians 11:23–30',
    sectionId: 'eucharist',
  },
  {
    q: 'What is the historical connection between Saint Mark and Alexandria?',
    a: `Multiple independent ancient sources document Saint Mark's founding of the Church of Alexandria: Eusebius of Caesarea (c. 324 AD) in his Ecclesiastical History (II.16), Jerome (c. 393 AD) in De Viris Illustribus, and Clement of Alexandria (c. 190 AD) all testify to Mark's presence and ministry in Egypt. These are the same sources Protestant scholars trust for establishing the authorship of the New Testament books.

Saint Mark is mentioned in the New Testament as a companion of both Peter (1 Peter 5:13) and Paul (Acts 13:5; Colossians 4:10), making his Alexandrian mission historically plausible and well-attested.`,
    ref: 'Eusebius, Ecclesiastical History II.16 / 1 Peter 5:13',
    sectionId: 'historical',
  },
  {
    q: 'Was the New Testament canon really first listed by the Coptic Church?',
    a: `Yes. The 27-book New Testament canon that all Christians use—including all Protestants—was first listed in exactly its current form in the Festal Letter 39 of Athanasius of Alexandria, written in 367 AD. No earlier document lists all 27 books as the exclusive canon.

Athanasius was the Bishop of Alexandria, the same church that produced Saint Mark, Clement, Origen, and Cyril. Protestant scholars F.F. Bruce (The Canon of Scripture) and Bruce Metzger (The Canon of the New Testament) both acknowledge Athanasius's decisive role.`,
    ref: 'Athanasius, Festal Letter 39 (367 AD)',
    sectionId: 'doctrines',
  },
  {
    q: 'What is Miaphysitism and why does it matter?',
    a: `Miaphysitism (from the Greek mia, "one," and physis, "nature") is the Christological position of the Coptic and other Oriental Orthodox churches. It holds that Christ has one united nature from two complete natures—divine and human—"without confusion, without mixture, without alteration, without division, and without separation."

This is distinct from Monophysitism (which denies Christ's full humanity) and Dyophysitism (which may imply a divided person). In 1989 and 1990, joint commissions of Eastern Orthodox and Oriental Orthodox theologians concluded that both sides confess the same faith. The split at Chalcedon was primarily terminological and political, not theological.`,
    ref: 'Joint Commission Agreed Statement (1990), Chambesy',
    sectionId: 'doctrines',
  },
];

function FaqItem({ faq, sectionId }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button
        className="faq-item__question"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{faq.q}</span>
        <span className="faq-item__chevron" aria-hidden>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="faq-item__answer">
          {faq.a.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {faq.ref && (
            <p className="protestant-note">Key references: {faq.ref}</p>
          )}
          {faq.sectionId && (
            <p className="faq-item__link">
              <Link to={`/#${faq.sectionId}`}>Read the full section →</Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const { t } = useTranslation();

  return (
    <PageShell>
      <div className="page-content">
        <div className="page-content__header">
          <h1>{t('pages.faq.title')}</h1>
          <p className="page-content__subtitle">{t('pages.faq.subtitle')}</p>
          <p className="page-content__back">
            <Link to="/">{t('pages.faq.back')}</Link>
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} faq={faq} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
