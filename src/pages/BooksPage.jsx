import { useState, useEffect, useCallback, useRef } from 'react';
import PageShell from '../components/PageShell';

const BOOKS = [
  {vol:"1",title:"On the Priesthood",author:"St. John Chrysostom",trans:"Graham Neville",price:"$22",url:"on-the-priesthood-six-books-st-john-chrysostom",isbn:"9780881410389",cat:"Clergy & Ministry",best:false},
  {vol:"2",title:"Sermons from the Life of St. John Chrysostom",author:"St. John Chrysostom",trans:"David C. Ford",price:"$28",url:"sermons-from-the-life-of-st-john-chrysostom-pps-2",isbn:"9780881415896",cat:"Homilies",best:true},
  {vol:"4 New",title:"Behold the Thief with the Eyes of Faith",author:"Various (Gk. & Lat.)",trans:"Mark G. Bilby",price:"$26",url:"behold-the-thief-with-the-eyes-of-faith",isbn:"9780881415926",cat:"Christology",best:true},
  {vol:"6",title:"On the Holy Icons",author:"St. Theodore the Studite",trans:"Catharine P. Roth",price:"$20",url:"on-the-holy-icons-st-theodore-the-studite",isbn:"9780881410600",cat:"Iconography",best:false},
  {vol:"7",title:"On Marriage and Family Life",author:"St. John Chrysostom",trans:"C. Roth & D. Anderson",price:"$21",url:"on-marriage-and-family-life",isbn:"9780881410662",cat:"Pastoral & Ethics",best:true},
  {vol:"8",title:"On the Divine Liturgy",author:"St. Germanus of Constantinople",trans:"Paul Meyendorff",price:"$20",url:"on-the-divine-liturgy-st-germanus-of-constantinople",isbn:"9780881410754",cat:"Liturgy",best:false},
  {vol:"9",title:"On Wealth and Poverty",author:"St. John Chrysostom",trans:"Catharine P. Roth",price:"$26",url:"on-wealth-and-poverty-second-edition-pps9",isbn:"9780881415551",cat:"Pastoral & Ethics",best:false},
  {vol:"10",title:"Hymns on Paradise",author:"St. Ephrem the Syrian",trans:"Sebastian Brock",price:"$26",url:"hymns-on-paradise-st-ephrem-the-syrian",isbn:"9780881410839",cat:"Poetry & Hymns",best:true},
  {vol:"11",title:"On Ascetical Life",author:"St. Isaac of Nineveh",trans:"Mary T. Hansbury",price:"$22",url:"on-ascetical-life",isbn:"9780881410846",cat:"Asceticism",best:false},
  {vol:"12",title:"On the Soul and Resurrection",author:"St. Gregory of Nyssa",trans:"Catharine P. Roth",price:"$21",url:"on-the-soul-and-resurrection-st-gregory-of-nyssa",isbn:"9780881410884",cat:"Theology",best:false},
  {vol:"13",title:"On the Unity of Christ",author:"St. Cyril of Alexandria",trans:"John Anthony McGuckin",price:"$22",url:"on-the-unity-of-christ-st-cyril-of-alexandria",isbn:"9780881411423",cat:"Christology",best:false},
  {vol:"14",title:"On the Mystical Life Vol. 1: The Church and The Last Things",author:"St. Symeon the New Theologian",trans:"Alexander Golitzin",price:"$30",url:"on-the-mystical-life-the-ethical-discourses-st-symeon-the-new-theologian-volume-i-the-church-and-the-last-things",isbn:"9780881411430",cat:"Mysticism",best:false},
  {vol:"15",title:"On the Mystical Life Vol. 2: On Virtue and Christian Life",author:"St. Symeon the New Theologian",trans:"Alexander Golitzin",price:"$25",url:"on-the-mystical-life-the-ethical-discourses-st-symeon-the-new-theologian-volume-ii-on-virtue-and-christian-life",isbn:"9780881411447",cat:"Mysticism",best:false},
  {vol:"16",title:"On the Mystical Life Vol. 3: Life, Times, and Theology",author:"St. Symeon the New Theologian",trans:"Alexander Golitzin",price:"$25",url:"on-the-mystical-life-the-ethical-discourses-st-symeon-the-new-theologian-volume-iii-life-times-and-theology",isbn:"9780881411843",cat:"Mysticism",best:false},
  {vol:"17",title:"On the Apostolic Preaching",author:"St. Irenaeus of Lyons",trans:"John Behr",price:"$22",url:"on-the-apostolic-preaching-st-irenaeus-of-lyons",isbn:"9780881412208",cat:"Christology",best:true},
  {vol:"18",title:"On the Dormition of Mary: Early Patristic Homilies",author:"Various",trans:"Brian E. Daley, S.J.",price:"$28",url:"on-the-dormition-of-mary-early-patristic-homilies",isbn:"9780881412314",cat:"Mariology",best:false},
  {vol:"19",title:"On the Mother of God",author:"St. Jacob of Serug",trans:"Mary T. Hansbury",price:"$21",url:"on-the-mother-of-god-second-print",isbn:"9780881412574",cat:"Mariology",best:false},
  {vol:"21",title:"On God and Man: The Theological Poetry",author:"St. Gregory of Nazianzus",trans:"Peter Gilbert",price:"$26",url:"on-god-and-man-the-theological-poetry-of-st-gregory-of-nazianzus",isbn:"9780881412604",cat:"Poetry & Hymns",best:false},
  {vol:"23",title:"On God and Christ: The Five Theological Orations",author:"St. Gregory of Nazianzus",trans:"F. Williams & L. Wickham",price:"$28",url:"on-god-and-christ-the-five-theological-orations-and-two-letters-to-cledonius-st-gregory-of-nazianzus",isbn:"9780881413168",cat:"Theology",best:false},
  {vol:"24",title:"Three Treatises on the Divine Images",author:"St. John of Damascus",trans:"Andrew Louth",price:"$25",url:"three-treatises-on-the-divine-images-st-john-of-damascus",isbn:"9780881413793",cat:"Iconography",best:false},
  {vol:"25",title:"On the Cosmic Mystery of Jesus Christ",author:"St. Maximus the Confessor",trans:"R. Wilken & P. Blowers",price:"$24",url:"on-the-cosmic-mystery-of-jesus-christ",isbn:"9780881412499",cat:"Christology",best:true},
  {vol:"26",title:"Letters from the Desert",author:"Sts. Barsanuphius & John",trans:"John Chryssavgis",price:"$25",url:"letters-from-the-desert",isbn:"9780881412888",cat:"Asceticism",best:false},
  {vol:"27",title:"Four Desert Fathers",author:"Pambo, Evagrius, Macarius of Egypt & Alexandria",trans:"Tim Vivian",price:"$30",url:"four-desert-fathers-pambo-evagrius-macarius-of-egypt-macarius-of-alexandria",isbn:"9780881413175",cat:"Asceticism",best:false},
  {vol:"28",title:"Saint Macarius the Spiritbearer: Coptic Texts",author:"Various",trans:"Tim Vivian",price:"$24",url:"st-macarius-the-spiritbearer-coptic-texts-relating-to-saint-macarius-the-great",isbn:"9780881413182",cat:"Asceticism",best:false},
  {vol:"29",title:"On the Lord's Prayer",author:"Tertullian, St. Cyprian & Origen",trans:"Alistair Stewart-Sykes",price:"$26",url:"on-the-lord-s-prayer-tertullian-cyprian-origen",isbn:"9780881413199",cat:"Scripture & Prayer",best:false},
  {vol:"30",title:"On the Human Condition",author:"St. Basil the Great",trans:"Nonna Verna Harrison",price:"$24",url:"on-the-human-condition-st-basil-the-great",isbn:"9780881413205",cat:"Theology",best:false},
  {vol:"31",title:"The Cult of the Saints",author:"St. John Chrysostom",trans:"Wendy Mayer & Bronwen Neil",price:"$29",url:"the-cult-of-the-saints-st-john-chrysostom",isbn:"9780881413397",cat:"Homilies",best:false},
  {vol:"32",title:"On the Church: Select Treatises",author:"St. Cyprian of Carthage",trans:"Allen Brent",price:"$24",url:"on-the-church-select-treatises-st-cyprian-of-carthage",isbn:"9780881413403",cat:"Ecclesiology",best:false},
  {vol:"33",title:"On the Church: Select Letters",author:"St. Cyprian of Carthage",trans:"Allen Brent",price:"$26",url:"on-the-church-select-letters-st-cyprian-of-carthage",isbn:"9780881413410",cat:"Ecclesiology",best:false},
  {vol:"34",title:"The Book of Pastoral Rule",author:"St. Gregory the Great",trans:"George E. Demacopoulos",price:"$25",url:"the-book-of-pastoral-rule-st-gregory-the-great",isbn:"9780881413427",cat:"Clergy & Ministry",best:true},
  {vol:"35",title:"Wider Than Heaven: 8th-century Homilies on the Mother of God",author:"Various",trans:"Mary B. Cunningham",price:"$25",url:"wider-than-heaven-eighth-century-homilies-on-the-mother-of-god",isbn:"9780881413434",cat:"Mariology",best:false},
  {vol:"36",title:"Festal Orations",author:"St. Gregory of Nazianzus",trans:"Nonna Verna Harrison",price:"$22",url:"festal-orations-saint-gregory-of-nazianzus",isbn:"9780881413441",cat:"Homilies",best:false},
  {vol:"37",title:"Counsels on the Spiritual Life, Vols. 1 & 2",author:"St. Mark the Monk",trans:"T. Vivian & A. Casiday",price:"$31",url:"counsels-on-the-spiritual-life-volumes-one-and-two-mark-the-monk",isbn:"9780881413762",cat:"Asceticism",best:false},
  {vol:"38",title:"On Social Justice",author:"St. Basil the Great",trans:"C. Paul Shroeder",price:"$23",url:"on-social-justice-st-basil-the-great",isbn:"9780881413786",cat:"Pastoral & Ethics",best:false},
  {vol:"39",title:"Harp of Glory (Enzira Sebhat)",author:"Ethiopian Tradition",trans:"John Anthony McGuckin",price:"$23",url:"harp-of-glory-enzira-sebhat",isbn:"9780881413793",cat:"Poetry & Hymns",best:false},
  {vol:"40",title:"Divine Eros: Hymns of St. Symeon the New Theologian",author:"St. Symeon the New Theologian",trans:"Daniel K. Griggs",price:"$36",url:"divine-eros-hymns-of-saint-symeon-the-new-theologian",isbn:"9780881414027",cat:"Poetry & Hymns",best:false},
  {vol:"41",title:"On the Two Ways: Life or Death, Light or Darkness",author:"Various",trans:"Alistair Stewart",price:"$25",url:"on-the-two-ways-life-or-death-light-or-darkness-foundational-texts-in-the-tradition",isbn:"9780881414034",cat:"Scripture & Prayer",best:false},
  {vol:"42",title:"On the Holy Spirit",author:"St. Basil the Great",trans:"Stephen Hildebrand",price:"$24",url:"on-the-holy-spirit-st-basil-the-great",isbn:"9780881414065",cat:"Theology",best:true},
  {vol:"43",title:"Works on the Spirit",author:"Athanasius & Didymus the Blind",trans:"DelCogliano, Radde-Gallwitz & Ayres",price:"$28",url:"works-on-the-spirit-athanasius-the-great-didymus-the-blind",isbn:"9780881413793",cat:"Theology",best:false},
  {vol:"44",title:"On the Incarnation (English)",author:"St. Athanasius the Great",trans:"John Behr",price:"$22",url:"on-the-incarnation-english-only",isbn:"9780881414271",cat:"Christology",best:true},
  {vol:"44A",title:"On the Incarnation (Greek & English)",author:"St. Athanasius the Great",trans:"John Behr",price:"$31",url:"on-the-incarnation-greek-original-english",isbn:"9780881414097",cat:"Christology",best:false},
  {vol:"45",title:"Treasure-house of Mysteries: Syriac Sacred Poetry",author:"Various (Syriac Trad.)",trans:"Sebastian Brock",price:"$37",url:"treasure-house-of-mysteries-exploration-of-the-sacred-text-through-poetry-in-the-syriac-tradition",isbn:"9780881414301",cat:"Poetry & Hymns",best:false},
  {vol:"46",title:"Poems on Scripture",author:"St. Gregory of Nazianzus",trans:"Brian Dunkle, S.J.",price:"$28",url:"poems-on-scripture-saint-gregory-of-nazianzus",isbn:"9780881414318",cat:"Poetry & Hymns",best:false},
  {vol:"47",title:"On Christian Doctrine and Practice",author:"St. Basil the Great",trans:"Mark DelCogliano",price:"$32",url:"on-christian-doctrine-and-practice-st-basil-the-great",isbn:"9780881414325",cat:"Theology",best:false},
  {vol:"48",title:"Light on the Mountain: Homilies on the Transfiguration",author:"Various",trans:"Brian E. Daley, S.J.",price:"$36",url:"light-on-the-mountain-greek-patristic-and-byzantine-homilies-on-the-transfiguration-of-the-lord",isbn:"9780881414462",cat:"Homilies",best:false},
  {vol:"49",title:"The Letters",author:"St. Ignatius of Antioch",trans:"Alistair Stewart",price:"$31",url:"the-letters-ignatius-of-antioch-pps-49",isbn:"9780881414646",cat:"Ecclesiology",best:false},
  {vol:"50",title:"On Fasting and Feasts",author:"St. Basil the Great",trans:"S. Holman & M. DelCogliano",price:"$24",url:"on-fasting-and-feasts-saint-basil-the-great",isbn:"9780881414783",cat:"Pastoral & Ethics",best:false},
  {vol:"51",title:"On Christian Ethics",author:"St. Basil the Great",trans:"Jacob N. Van Sickle",price:"$35",url:"on-christian-ethics-st-basil-the-great",isbn:"9780881414936",cat:"Pastoral & Ethics",best:false},
  {vol:"52",title:"Give Me a Word: Alphabetical Sayings of the Desert Fathers",author:"Desert Fathers",trans:"John Wortley",price:"$34",url:"give-me-a-word-the-alphabetical-sayings-of-the-desert-fathers",isbn:"9780881415124",cat:"Asceticism",best:false},
  {vol:"53",title:"Two Hundred Chapters on Theology",author:"St. Maximus the Confessor",trans:"Luis Joshua Salés",price:"$29",url:"two-hundred-chapters-on-theology-st-maximus-the-confessor",isbn:"9780881415131",cat:"Theology",best:false},
  {vol:"54",title:"On the Apostolic Tradition (2nd ed.)",author:"St. Hippolytus",trans:"Alistair Stewart",price:"$32",url:"on-the-apostolic-tradition-hippolytus-second-edition",isbn:"9780881415148",cat:"Liturgy",best:false},
  {vol:"55",title:"On Pascha (2nd ed.)",author:"St. Melito of Sardis",trans:"Alistair Stewart",price:"$25",url:"on-pascha-second-edition-pps55",isbn:"9780881415179",cat:"Liturgy",best:false},
  {vol:"56",title:"Letters to Saint Olympia",author:"St. John Chrysostom",trans:"David C. Ford",price:"$25",url:"saint-john-chrysostom-letters-to-saint-olympia",isbn:"9780881415582",cat:"Pastoral & Ethics",best:false},
  {vol:"57",title:"Lectures on the Christian Sacraments (2nd ed.)",author:"St. Cyril of Jerusalem",trans:"Maxwell E. Johnson",price:"$26",url:"lectures-on-the-christian-sacraments-pps57",isbn:"9780881415636",cat:"Liturgy",best:false},
  {vol:"58",title:"The Testament of the Lord",author:"Various",trans:"Alistair Stewart",price:"$34",url:"the-testament-of-the-lord-worship-discipline-in-the-early-church",isbn:"9780881415810",cat:"Liturgy",best:false},
  {vol:"59",title:"On the Ecclesiastical Mystagogy",author:"St. Maximus the Confessor",trans:"Jonathan J. Armstrong",price:"$34",url:"on-the-ecclesiastical-mystagogy-pps-59",isbn:"9780881415827",cat:"Liturgy",best:false},
  {vol:"60",title:"Catechetical Discourse: A Handbook for Catechists",author:"St. Gregory of Nyssa",trans:"Ignatius Green",price:"$34",url:"catechetical-discourse",isbn:"9780881415834",cat:"Theology",best:false},
  {vol:"61",title:"Hymns of Repentance",author:"St. Romanos the Melodist",trans:"Andrew Mellas",price:"$34",url:"hymns-of-repentance",isbn:"9780881415841",cat:"Poetry & Hymns",best:false},
  {vol:"62",title:"On the Orthodox Faith: Vol. 3 of the Fount of Knowledge",author:"St. John of Damascus",trans:"Norman Russell",price:"$36",url:"on-the-orthodox-faith-volume-3-of-the-fount-of-knowledge-pps-62",isbn:"9780881415858",cat:"Theology",best:true},
  {vol:"63",title:"Headings on Spiritual Knowledge: The Second Part, Chapters 1–3",author:"St. Isaac of Nineveh",trans:"Sebastian Brock",price:"$35",url:"headings-on-spiritual-knowledge-the-second-part-chapters-1-3",isbn:"9780881415872",cat:"Asceticism",best:false},
  {vol:"64",title:"On Death and Eternal Life",author:"St. Gregory of Nyssa",trans:"Brian E. Daley",price:"$35",url:"on-death-and-eternal-life",isbn:"9780881415889",cat:"Theology",best:true},
  {vol:"65",title:"The Prayers of Saint Sarapion",author:"St. Serapion of Thmuis",trans:"Maxwell E. Johnson",price:null,url:null,isbn:"9780881415896",cat:"Liturgy",best:false},
  {vol:"New",title:"Christological Letters",author:"St. Maximus the Confessor",trans:"forthcoming",price:"$32",url:"christological-letters-st-maximus-the-confessor",isbn:null,cat:"Christology",best:false},
  {vol:"LW 1",title:"The Triads",author:"St. Gregory Palamas",trans:"Alexander R. Titus",price:null,url:null,isbn:null,cat:"Theology",best:false},
];

const ALL_CATS = ["All", ...[...new Set(BOOKS.map(b => b.cat))].sort()];

const CAT_ACCENT = {
  "Christology":     { bg: "rgba(60,52,137,0.25)",  border: "rgba(111,99,220,0.5)",  text: "#b0a8f0" },
  "Liturgy":         { bg: "rgba(15,110,86,0.2)",   border: "rgba(30,180,130,0.4)",  text: "#5dd4a8" },
  "Asceticism":      { bg: "rgba(133,79,11,0.2)",   border: "rgba(210,140,40,0.4)",  text: "#e8a83a" },
  "Theology":        { bg: "rgba(24,95,165,0.2)",   border: "rgba(60,140,220,0.4)",  text: "#7ab8f0" },
  "Homilies":        { bg: "rgba(59,109,17,0.2)",   border: "rgba(100,170,40,0.4)",  text: "#8ecf44" },
  "Poetry & Hymns":  { bg: "rgba(153,53,86,0.2)",   border: "rgba(220,90,140,0.4)",  text: "#e87baa" },
  "Mariology":       { bg: "rgba(180,60,100,0.2)",  border: "rgba(230,100,150,0.4)", text: "#f09ab8" },
  "Pastoral & Ethics":{ bg: "rgba(153,60,29,0.2)",  border: "rgba(220,100,50,0.4)",  text: "#e88a5a" },
  "Ecclesiology":    { bg: "rgba(90,90,90,0.2)",    border: "rgba(150,150,150,0.4)", text: "#b8b8b8" },
  "Iconography":     { bg: "rgba(186,117,23,0.2)",  border: "rgba(232,170,0,0.5)",   text: "#e8aa00" },
  "Mysticism":       { bg: "rgba(127,119,221,0.2)", border: "rgba(180,170,240,0.4)", text: "#c4bcf8" },
  "Scripture & Prayer":{ bg:"rgba(11,110,124,0.2)", border: "rgba(30,170,190,0.4)",  text: "#5cc8d8" },
  "Clergy & Ministry":{ bg:"rgba(95,94,90,0.2)",   border: "rgba(160,155,145,0.4)", text: "#c8c0b0" },
};

function BookCard({ book, coverUrl, coverLoaded }) {
  const accent = CAT_ACCENT[book.cat] || { bg: "rgba(100,100,100,0.15)", border: "rgba(150,150,150,0.3)", text: "#b0b0b0" };
  const isComingSoon = !book.url;
  const isNewVol = isNaN(parseInt(book.vol));

  return (
    <div className="pps-card">
      <div className="pps-card__cover" style={{ background: accent.bg, borderColor: accent.border }}>
        {coverUrl && (
          <img
            className={`pps-card__cover-img${coverLoaded ? ' pps-card__cover-img--loaded' : ''}`}
            src={coverUrl}
            alt={book.title}
          />
        )}
        {!coverLoaded && (
          <div className="pps-card__spine">
            <span className="pps-card__spine-vol" style={{ color: accent.text }}>Vol. {book.vol}</span>
            <span className="pps-card__spine-title" style={{ color: accent.text }}>{book.title}</span>
            <span className="pps-card__spine-author" style={{ color: accent.text }}>{book.author}</span>
          </div>
        )}
      </div>

      <div className="pps-card__body">
        {book.best && <span className="pps-card__badge pps-card__badge--best">Best seller</span>}
        <span className={`pps-card__badge pps-card__badge--vol${isNewVol ? ' pps-card__badge--new' : ''}`} style={{ color: accent.text, borderColor: accent.border }}>
          Vol. {book.vol}
        </span>
        <p className="pps-card__title">{book.title}</p>
        <p className="pps-card__author">
          {book.author}
          <br />
          <em className="pps-card__trans">{book.trans}</em>
        </p>
        <div className="pps-card__foot">
          {book.price ? <span className="pps-card__price">{book.price}</span> : <span />}
          {isComingSoon
            ? <span className="pps-card__soon">Coming soon</span>
            : (
              <a
                className="pps-card__buy"
                href={`https://svspress.com/${book.url}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy →
              </a>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');
  const [covers, setCovers] = useState({});
  const [loadedCount, setLoadedCount] = useState(0);
  const loadedRef = useRef(0);

  const filtered = BOOKS.filter(b => {
    const matchCat = activeCat === 'All' || b.cat === activeCat;
    const q = query.toLowerCase();
    const matchQ = !q || [b.title, b.author, b.trans, b.vol].join(' ').toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const loadOneCover = useCallback(async (book) => {
    const key = book.isbn || book.vol;

    let coverUrl = null;

    if (book.isbn) {
      const olUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg?default=false`;
      try {
        const r = await fetch(olUrl, { method: 'HEAD' });
        if (r.ok && r.status === 200) {
          coverUrl = olUrl.replace('-M.jpg', '-L.jpg');
        }
      } catch (_) {}
    }

    if (!coverUrl) {
      try {
        const q = encodeURIComponent(book.title + ' ' + book.author.split(',')[0].split(' ').slice(-1)[0]);
        const r = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=1&fields=cover_i`);
        const d = await r.json();
        if (d.docs?.[0]?.cover_i) {
          coverUrl = `https://covers.openlibrary.org/b/id/${d.docs[0].cover_i}-M.jpg`;
        }
      } catch (_) {}
    }

    if (!coverUrl) {
      try {
        const q = encodeURIComponent(`intitle:${book.title}`);
        const r = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`);
        const d = await r.json();
        const thumb = d.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
        if (thumb) coverUrl = thumb.replace('http://', 'https://').replace('zoom=1', 'zoom=2');
      } catch (_) {}
    }

    if (coverUrl) {
      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          setCovers(prev => ({ ...prev, [key]: { url: coverUrl, loaded: true } }));
          loadedRef.current += 1;
          setLoadedCount(loadedRef.current);
          resolve();
        };
        img.onerror = () => {
          loadedRef.current += 1;
          setLoadedCount(loadedRef.current);
          resolve();
        };
        img.src = coverUrl;
      });
    } else {
      loadedRef.current += 1;
      setLoadedCount(loadedRef.current);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const BATCH = 4;

    async function run() {
      for (let i = 0; i < BOOKS.length; i += BATCH) {
        if (cancelled) break;
        const batch = BOOKS.slice(i, i + BATCH);
        await Promise.allSettled(batch.map(b => loadOneCover(b)));
        await new Promise(r => setTimeout(r, 120));
      }
    }

    run();
    return () => { cancelled = true; };
  }, [loadOneCover]);

  const progress = Math.round((loadedCount / BOOKS.length) * 100);

  return (
    <PageShell>
      <div className="pps-page">
        <div className="pps-hero">
          <h1 className="pps-hero__title">Popular Patristics Series</h1>
          <p className="pps-hero__sub">
            St. Vladimir's Seminary Press · Ed. Fr. Bogdan Bucur
          </p>
          <p className="pps-hero__desc">
            The complete catalog of the Popular Patristics Series — primary sources from the Church Fathers,
            translated into accessible English. The finest patristic library available in print.
          </p>
        </div>

        <div className="pps-toolbar">
          <div className="pps-stats">
            <div className="pps-stat">
              <span className="pps-stat__label">Total volumes</span>
              <span className="pps-stat__value">{BOOKS.length}</span>
            </div>
            <div className="pps-stat">
              <span className="pps-stat__label">Showing</span>
              <span className="pps-stat__value">{filtered.length}</span>
            </div>
            <div className="pps-stat">
              <span className="pps-stat__label">Covers loaded</span>
              <span className="pps-stat__value">{loadedCount} / {BOOKS.length}</span>
            </div>
          </div>

          <div className="pps-load-bar">
            <div className="pps-load-bar__fill" style={{ width: `${progress}%` }} />
          </div>

          <input
            className="pps-search"
            type="search"
            placeholder="Search title, author, translator…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search books"
          />

          <div className="pps-filters" role="group" aria-label="Filter by category">
            {ALL_CATS.map(cat => (
              <button
                key={cat}
                className={`pps-filter-btn${activeCat === cat ? ' pps-filter-btn--active' : ''}`}
                onClick={() => setActiveCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="pps-empty">No volumes match your search.</p>
        ) : (
          <div className="pps-grid">
            {filtered.map(book => {
              const key = book.isbn || book.vol;
              const cover = covers[key];
              return (
                <BookCard
                  key={key}
                  book={book}
                  coverUrl={cover?.url}
                  coverLoaded={cover?.loaded}
                />
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
