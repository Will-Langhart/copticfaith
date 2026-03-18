import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell';

const DIOCESES = [
  {
    name: 'Coptic Orthodox Metropolis of the Southern United States',
    url: 'suscopts.org',
    description: 'Official theological resources, clergy directory, and church locator for the Southern US diocese.',
    region: 'United States (South)',
  },
  {
    name: 'Coptic Orthodox Diocese of Los Angeles, Southern California, and Hawaii',
    url: 'lacopts.org',
    description: 'Diocese serving the Western United States.',
    region: 'United States (West)',
  },
  {
    name: 'Coptic Orthodox Diocese of New York and New England',
    url: 'copticdioceseny.org',
    description: 'Diocese serving the Northeastern United States.',
    region: 'United States (Northeast)',
  },
  {
    name: 'Coptic Orthodox Diocese of the Mideast and Affiliated Regions',
    url: 'copticmideast.org',
    description: 'Diocese serving the Midwestern United States.',
    region: 'United States (Midwest)',
  },
  {
    name: 'Coptic Orthodox Diocese of London and the British Isles',
    url: 'copticdiocese.org.uk',
    description: 'The UK and British Isles diocese.',
    region: 'United Kingdom',
  },
  {
    name: 'Coptic Orthodox Diocese of Sydney, New South Wales, and Affiliated Regions',
    url: 'stmarymonastery.org.au',
    description: 'Australian diocese.',
    region: 'Australia',
  },
  {
    name: 'Coptic Orthodox Patriarchate of Alexandria (Official)',
    url: 'copticpope.org',
    description: 'The official website of the Coptic Orthodox Patriarchate and Pope Tawadros II.',
    region: 'Global / Egypt',
  },
  {
    name: 'CopticChurch.net',
    url: 'copticchurch.net',
    description: 'Find a Coptic church near you; official theological library and resources.',
    region: 'Church Locator',
  },
];

const ONLINE_RESOURCES = [
  {
    name: 'CopticChurch.net — Church Finder',
    url: 'copticchurch.net',
    description: 'Official church finder with locations worldwide. Search by city, state, or country.',
  },
  {
    name: 'St. Takla Haymanout Coptic Orthodox Church Library',
    url: 'st-takla.org',
    description: 'The largest Coptic theological library online — patristics, liturgy, theology, all in English.',
  },
  {
    name: 'Coptic Orthodox Wiki',
    url: 'wiki.suscopts.org',
    description: 'Peer-reviewed theological reference on Coptic doctrine, history, worship, and saints.',
  },
  {
    name: 'Archive of Contemporary Coptic Orthodox Theology',
    url: 'accot.stcyrils.edu.au',
    description: 'Academic archive of Coptic theological scholarship.',
  },
  {
    name: 'Pope Shenouda III Books (Full Library)',
    url: 'copticchurch.net/books',
    description: 'Over 101 books by the 117th Pope of Alexandria, many in English, all free.',
  },
  {
    name: 'Agpeya Online (Coptic Book of Hours)',
    url: 'agpeya.org',
    description: 'Pray the ancient Coptic daily prayer offices in English, Coptic, and Arabic.',
  },
];

const VISITING_NOTES = [
  'Coptic churches welcome inquirers and visitors at any service. You do not need to be Orthodox to attend.',
  'Sunday Liturgy typically begins early (6–8am) and lasts 2–3 hours. Many churches also have English translations available.',
  'The Divine Liturgy is the central act of worship. Even as a visitor, you will experience the ancient prayer of the Church.',
  'Most Coptic churches have a priest or deacon who would be glad to answer questions. Consider emailing or calling ahead.',
  'Many dioceses host inquirer programs, catechesis, and Q&A evenings specifically for those from Protestant backgrounds.',
];

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <PageShell>
      <div className="page-content">
        <div className="page-content__header">
          <h1>{t('pages.contact.title')}</h1>
          <p className="page-content__subtitle">{t('pages.contact.subtitle')}</p>
          <div className="contact-note">{t('pages.contact.note')}</div>
        </div>

        <section className="reading-section">
          <h2>{t('pages.contact.dioceses')}</h2>
          <div className="diocese-grid">
            {DIOCESES.map(d => (
              <div key={d.name} className="diocese-card">
                <div className="diocese-card__region">{d.region}</div>
                <div className="diocese-card__name">{d.name}</div>
                <p className="diocese-card__desc">{d.description}</p>
                <span className="diocese-card__url">{d.url}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="reading-section">
          <h2>Visiting a Coptic Church</h2>
          <ul className="visiting-list">
            {VISITING_NOTES.map((note, i) => (
              <li key={i} className="visiting-list__item">{note}</li>
            ))}
          </ul>
        </section>

        <section className="reading-section">
          <h2>{t('pages.contact.resources')}</h2>
          <div className="diocese-grid">
            {ONLINE_RESOURCES.map(r => (
              <div key={r.name} className="diocese-card">
                <div className="diocese-card__name">{r.name}</div>
                <p className="diocese-card__desc">{r.description}</p>
                <span className="diocese-card__url">{r.url}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
