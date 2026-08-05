// Per-route SEO metadata. Consumed by RootLayout, which updates the
// document title, description, canonical link, and Open Graph / Twitter
// tags on every navigation (the static defaults live in index.html for
// non-JS crawlers and social scrapers).
import { FATHERS } from './fathers';

export const SITE = {
  name: 'CopticFaith',
  baseUrl: 'https://copticfaith.app',
  ogImage: 'https://copticfaith.app/og-image.png',
  defaultTitle: 'The Ancient Faith | Coptic Orthodoxy',
  defaultDescription:
    'The Ancient Faith: building the Biblical and historical case for Coptic Orthodoxy — Scripture, the Church Fathers, and primary sources, for Protestant readers.',
};

// Path → { title, description }. Titles are page-specific; the home
// route uses the full brand title from SITE.
const ROUTES = {
  '/': {
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
  },
  '/sacraments': {
    title: 'The Seven Holy Mysteries — CopticFaith',
    description:
      'The seven sacraments (Holy Mysteries) of the Coptic Orthodox Church — Baptism, Chrismation, Eucharist, Confession, Unction, Matrimony, and Holy Orders.',
  },
  '/baptism': {
    title: 'Holy Baptism — CopticFaith',
    description:
      'Why the Coptic Church baptizes by triple immersion and welcomes infants — grounded in John 3:5, Romans 6, and the witness of Origen, Chrysostom, and Cyril of Jerusalem.',
  },
  '/chrismation': {
    title: 'Chrismation (Holy Myron) — CopticFaith',
    description:
      'Chrismation with Holy Myron as the sealing of the Holy Spirit — the Coptic Orthodox sacrament of confirmation, in Scripture and the Fathers.',
  },
  '/eucharist': {
    title: 'The Holy Eucharist — CopticFaith',
    description:
      'The real presence of the Body and Blood of Christ in the Coptic Orthodox Eucharist — from John 6, the Last Supper, Ignatius, and the Divine Liturgy.',
  },
  '/confession': {
    title: 'Confession & Repentance — CopticFaith',
    description:
      'The sacrament of Confession and priestly absolution in the Coptic Orthodox Church — grounded in John 20:23 and the practice of the early Church.',
  },
  '/unction': {
    title: 'Unction of the Sick — CopticFaith',
    description:
      'The sacrament of the Anointing of the Sick (Unction) in the Coptic Orthodox Church — healing of body and soul, from James 5:14 and the Fathers.',
  },
  '/matrimony': {
    title: 'Holy Matrimony — CopticFaith',
    description:
      'The Coptic Orthodox sacrament of Holy Matrimony — the crowning of marriage as an image of Christ and His Church.',
  },
  '/holy-orders': {
    title: 'Holy Orders — CopticFaith',
    description:
      'The sacrament of Holy Orders and apostolic succession in the Coptic Orthodox Church — deacons, priests, and bishops in unbroken continuity from the Apostles.',
  },
  '/salvation': {
    title: 'Salvation & Theosis — CopticFaith',
    description:
      'Salvation as an ongoing journey of deification (theosis), not a one-time forensic declaration — Athanasius, Cyril of Alexandria, and 2 Peter 1:4.',
  },
  '/fathers': {
    title: 'The Church Fathers — CopticFaith',
    description:
      'The great Fathers of the Church — Athanasius, Cyril, Chrysostom, Basil, and more — their lives, teachings, and Coptic Orthodox witness.',
  },
  '/church-history': {
    title: 'Church History — CopticFaith',
    description:
      'The history of the Coptic Orthodox Church — from Saint Mark and the School of Alexandria through the Ecumenical Councils to the present day.',
  },
  '/intercession-of-saints': {
    title: 'Intercession of the Saints — CopticFaith',
    description:
      'The Coptic Orthodox understanding of the communion and intercession of the saints — grounded in Scripture and the ancient Church.',
  },
  '/saints-calendar': {
    title: 'Saints Calendar — CopticFaith',
    description:
      'A calendar of saints commemorated in the Coptic Orthodox Church — their lives, feasts, and witness to the faith.',
  },
  '/daily-readings': {
    title: 'Daily Readings — CopticFaith',
    description:
      "The Coptic Orthodox lectionary — daily Scripture readings from the Katameros for the Church's liturgical year.",
  },
  '/books': {
    title: 'Popular Patristics Series — CopticFaith',
    description:
      'A catalog of the Popular Patristics Series and other primary-source works of the Church Fathers, for study of the ancient faith.',
  },
  '/reading-list': {
    title: 'Reading List — CopticFaith',
    description:
      'A curated reading list for exploring Coptic Orthodox theology, the Church Fathers, and Church history.',
  },
  '/scripture-index': {
    title: 'Scripture Index — CopticFaith',
    description:
      'An index of Scripture references used across CopticFaith — find where each passage supports the teaching of the Coptic Orthodox Church.',
  },
  '/glossary': {
    title: 'Glossary — CopticFaith',
    description:
      'A glossary of Coptic Orthodox and patristic terms — theosis, homoousios, Theotokos, miaphysitism, and more, defined plainly.',
  },
  '/faq': {
    title: 'Frequently Asked Questions — CopticFaith',
    description:
      'Answers to common questions about the Coptic Orthodox Church — its beliefs, practices, sacraments, and relationship to other Christian traditions.',
  },
  '/contact': {
    title: 'Contact — CopticFaith',
    description: 'Get in touch with CopticFaith.',
  },
};

/**
 * Resolve SEO metadata for a pathname, including dynamic Father profiles.
 * Always returns a title, description, and absolute canonical URL.
 */
export function resolveMeta(pathname) {
  // Normalize trailing slash (except root)
  const path = pathname !== '/' ? pathname.replace(/\/$/, '') : '/';

  let meta = ROUTES[path];

  // Dynamic Father profile: /fathers/:id
  if (!meta) {
    const match = path.match(/^\/fathers\/([^/]+)$/);
    if (match) {
      const father = FATHERS.find((f) => f.id === match[1]);
      if (father) {
        meta = {
          title: `${father.name} — CopticFaith`,
          description:
            father.tagline ||
            `The life, teachings, and Coptic Orthodox witness of ${father.name}.`,
        };
      }
    }
  }

  if (!meta) meta = { title: SITE.defaultTitle, description: SITE.defaultDescription };

  return {
    title: meta.title,
    description: meta.description,
    canonical: `${SITE.baseUrl}${path === '/' ? '/' : path}`,
  };
}
