/**
 * Extended data for individual Father profile pages.
 * Keyed by the same `id` used in fathers.js.
 * Adds: era, location, school, works, relatedFathers, contextNote.
 */

export const FATHERS_EXTENDED = {

  athanasius: {
    era: 'Nicene',
    location: 'Alexandria, Egypt',
    school: 'Alexandrian School',
    exiles: 5,
    councilsAttended: ['First Council of Nicaea (325)', 'Council of Tyre (335)'],
    works: [
      {
        title: 'On the Incarnation (De Incarnatione)',
        date: 'c. 318 AD',
        description: 'His greatest work, written before the Arian controversy, arguing that the Incarnation was necessary to reverse Adam\'s corruption. C.S. Lewis wrote the introduction to a modern translation.',
      },
      {
        title: 'Against the Arians (Orationes contra Arianos)',
        date: 'c. 339–358 AD',
        description: 'Four orations demolishing the Arian position that the Son is a creature. Remains the definitive patristic refutation of Arianism.',
      },
      {
        title: '39th Festal Letter',
        date: '367 AD',
        description: 'The first document in history to list the exact 27 books of the New Testament as canonical, unchanged to this day.',
      },
      {
        title: 'Life of Saint Anthony (Vita Antonii)',
        date: 'c. 360 AD',
        description: 'The founding biography of Christian monasticism, which sparked the desert movement across the Roman world.',
      },
    ],
    relatedFathers: ['cyril-alexandria', 'basil', 'gregory-nazianzus', 'origen'],
    contextNote: 'Athanasius attended the Council of Nicaea as a deacon and assistant to Bishop Alexander. He became Pope of Alexandria aged ~30 and spent 17 of his 45 years as Pope in exile under five emperors.',
  },

  augustine: {
    era: 'Post-Nicene',
    location: 'Thagaste & Hippo, North Africa',
    school: 'Latin Patristics',
    works: [
      {
        title: 'Confessions (Confessiones)',
        date: 'c. 397–400 AD',
        description: 'The first autobiography in Western literature — a sustained prayer to God tracing Augustine\'s spiritual journey from Manichaeism to Christianity. "Our heart is restless until it rests in Thee."',
      },
      {
        title: 'The City of God (De Civitate Dei)',
        date: '413–426 AD',
        description: 'Written after the sack of Rome by Alaric (410), this work distinguishes the City of God from the City of Man and surveys all of human history through a Christian lens.',
      },
      {
        title: 'On the Trinity (De Trinitate)',
        date: '399–422 AD',
        description: 'His most technically sophisticated theological work, developing the Western psychological analogy of the Trinity (memory, understanding, will) and defending the Filioque.',
      },
      {
        title: 'Against Pelagius',
        date: '412–430 AD',
        description: 'A series of writings defending the necessity of divine grace against Pelagius\'s teaching that human will is sufficient for salvation without grace.',
      },
    ],
    relatedFathers: ['cyprian', 'clement-rome', 'irenaeus', 'origen'],
    contextNote: 'Augustine was born to a Berber mother (Monica) and a Roman father (Patricius) in North Africa — making him ethnically African. His theological influence on Western Christianity (both Catholic and Protestant) is unparalleled.',
  },

  basil: {
    era: 'Nicene',
    location: 'Caesarea, Cappadocia (modern Turkey)',
    school: 'Cappadocian Fathers',
    councilsAttended: [],
    works: [
      {
        title: 'On the Holy Spirit (De Spiritu Sancto)',
        date: '375 AD',
        description: 'The definitive patristic argument for the full divinity of the Holy Spirit, written against the Pneumatomachi ("Spirit-fighters"). Used the liturgical doxology "Glory to the Father, with the Son, together with the Holy Spirit" as evidence.',
      },
      {
        title: 'The Longer and Shorter Rules (Ascetica)',
        date: 'c. 360–370 AD',
        description: 'His monastic rule, still foundational for all Eastern monasticism. Unlike Anthony\'s hermit ideal, Basil championed communal monastic life serving the poor.',
      },
      {
        title: 'Divine Liturgy of Saint Basil',
        date: 'c. 370 AD',
        description: 'Still used in the Coptic Orthodox Church on the Sundays of Lent, Holy Week, Apostles\' Fast, and major feasts — a living patristic text in Coptic worship today.',
      },
      {
        title: 'Hexaemeron (Six Days of Creation)',
        date: 'c. 370 AD',
        description: 'Nine homilies on the six days of creation, remarkable for their engagement with contemporary natural science and their lyrical theological prose.',
      },
    ],
    relatedFathers: ['gregory-nazianzus', 'gregory-nyssa', 'athanasius', 'chrysostom'],
    contextNote: 'Basil, Gregory of Nazianzus, and Basil\'s brother Gregory of Nyssa are the "Three Cappadocians" who secured the Nicene faith after Athanasius. Basil also built the Basileiad — a vast complex of hospitals, hostels, and workshops for the poor — the first such institution in the Christian world.',
  },

  'clement-alexandria': {
    era: 'Ante-Nicene',
    location: 'Alexandria, Egypt',
    school: 'Alexandrian Catechetical School',
    works: [
      {
        title: 'Protrepticus (Exhortation to the Greeks)',
        date: 'c. 190 AD',
        description: 'A missionary address to educated pagans arguing that Christianity is the fulfillment of all that Greek philosophy sought. Demonstrates the Alexandrian method of engaging culture with the Gospel.',
      },
      {
        title: 'Paidagogos (The Tutor)',
        date: 'c. 190–200 AD',
        description: 'A guide to Christian ethics in daily life — dress, food, laughter, wealth — showing how Christ the Logos educates the soul.',
      },
      {
        title: 'Stromateis (Miscellanies)',
        date: 'c. 200 AD',
        description: 'Seven volumes of theological notes on the relationship between faith and knowledge, the true Gnostic (Christian sage), and the use of Greek philosophy in Christian thought.',
      },
    ],
    relatedFathers: ['origen', 'athanasius', 'cyril-alexandria', 'justin'],
    contextNote: 'Clement succeeded Pantaenus as head of the Catechetical School of Alexandria and was succeeded by Origen. He pioneered the integration of Greek philosophical learning into Christian theology — a distinctly Alexandrian project.',
  },

  'clement-rome': {
    era: 'Apostolic Fathers',
    location: 'Rome',
    school: 'Apostolic Fathers',
    works: [
      {
        title: 'First Epistle to the Corinthians (1 Clement)',
        date: 'c. 96 AD',
        description: 'Written to resolve a schism in the Corinthian church, this letter is one of the earliest Christian documents outside the New Testament. It asserts apostolic authority, the importance of church order, and gives one of the earliest descriptions of the Eucharist.',
      },
    ],
    relatedFathers: ['ignatius', 'clement-alexandria', 'irenaeus'],
    contextNote: '1 Clement was so highly regarded in the early Church that some manuscripts include it in the New Testament canon. Clement was the fourth bishop of Rome (after Peter, Linus, and Anacletus) and is believed to have known both Peter and Paul personally.',
  },

  cyprian: {
    era: 'Ante-Nicene',
    location: 'Carthage, North Africa',
    school: 'Latin Patristics',
    works: [
      {
        title: 'On the Unity of the Church (De Catholicae Ecclesiae Unitate)',
        date: '251 AD',
        description: 'Written during the Novatian schism, this foundational work articulates the theology of episcopal unity and episcopal succession. Contains the famous phrase: "He cannot have God for his Father who has not the Church for his Mother."',
      },
      {
        title: 'On the Lapsed (De Lapsis)',
        date: '251 AD',
        description: 'Addresses how to receive back into communion those Christians who had apostatized under Decian persecution — a major pastoral and theological controversy.',
      },
      {
        title: 'On the Lord\'s Prayer (De Dominica Oratione)',
        date: '252 AD',
        description: 'A rich theological commentary on the Our Father, exploring each petition in depth. Remains one of the finest patristic commentaries on the Lord\'s Prayer.',
      },
    ],
    relatedFathers: ['clement-rome', 'augustine', 'ignatius'],
    contextNote: 'Cyprian converted to Christianity in his 40s from a wealthy pagan background and became Bishop of Carthage within two years. He was martyred by beheading under Valerian in 258 AD — the first African bishop to die by the sword.',
  },

  'cyril-alexandria': {
    era: 'Post-Nicene',
    location: 'Alexandria, Egypt',
    school: 'Alexandrian School',
    councilsAttended: ['Council of Ephesus (431)'],
    works: [
      {
        title: 'Twelve Anathemas against Nestorius',
        date: '430 AD',
        description: 'Twelve propositions condemning Nestorian Christology and asserting that Mary is truly Theotokos (God-bearer). The anathemas became the theological standard for the Council of Ephesus.',
      },
      {
        title: 'Commentary on the Gospel of John',
        date: 'c. 425–428 AD',
        description: 'His masterpiece of exegesis, treating John\'s Gospel as the fullest revelation of the Incarnation. Still read as a theological reference today.',
      },
      {
        title: 'On the Unity of Christ',
        date: 'c. 437 AD',
        description: 'A dialogue arguing for the single subject ("one nature") of the Incarnate Word — the position that defines Oriental Orthodox Christology to this day.',
      },
      {
        title: 'Paschal Letters',
        date: '414–442 AD',
        description: 'Annual letters to the Alexandrian Church announcing the date of Pascha, containing rich theological reflections. 29 survive.',
      },
    ],
    relatedFathers: ['athanasius', 'origen', 'clement-alexandria', 'gregory-nazianzus'],
    contextNote: 'Cyril\'s victory at Ephesus (431) secured the title Theotokos for the Virgin Mary and repudiated Nestorius\'s two-nature Christology. The Coptic Church considers him the theological summit of the Alexandrian tradition.',
  },

  'cyril-jerusalem': {
    era: 'Nicene',
    location: 'Jerusalem',
    school: 'Jerusalem Church',
    works: [
      {
        title: 'Catechetical Lectures (Catecheses)',
        date: 'c. 350 AD',
        description: '24 lectures delivered to baptismal candidates in Jerusalem: 18 pre-baptismal and 5 mystagogical (explaining the sacraments to the newly baptized). The most complete catechetical document of the ancient Church.',
      },
    ],
    relatedFathers: ['basil', 'gregory-nazianzus', 'chrysostom', 'cyril-alexandria'],
    contextNote: 'Cyril was exiled three times for his opposition to Arianism. His Catechetical Lectures are invaluable for their detailed descriptions of 4th-century baptismal, eucharistic, and confirmation rites.',
  },

  ephrem: {
    era: 'Nicene',
    location: 'Nisibis & Edessa, Syria',
    school: 'Syriac Christianity',
    works: [
      {
        title: 'Hymns on the Nativity',
        date: 'c. 360–373 AD',
        description: '28 hymns on the birth of Christ — rich with typology, paradox, and vivid imagery. One of the supreme works of Christian poetry: "The Lord entered into her and became a servant; the Word entered into her and became silent within her."',
      },
      {
        title: 'Hymns against Heresies',
        date: 'c. 360–373 AD',
        description: 'A series of hymns refuting Gnosticism, Manichaeism, and Arianism, written in poetic meter so that orthodox Christians would sing them and remember the faith.',
      },
      {
        title: 'Commentary on the Diatessaron',
        date: 'c. 360–373 AD',
        description: 'A commentary on Tatian\'s Gospel harmony, our most important source for early Syriac Gospel interpretation.',
      },
    ],
    relatedFathers: ['basil', 'gregory-nazianzus', 'chrysostom'],
    contextNote: 'Called the "Harp of the Holy Spirit," Ephrem wrote almost entirely in poetry. He is the only Syrian Father honored as a Doctor of the Church by Rome and is venerated as a saint in the Coptic tradition. He pioneered using hymns to teach theology to laypeople.',
  },

  'gregory-nazianzus': {
    era: 'Nicene',
    location: 'Nazianzus & Constantinople',
    school: 'Cappadocian Fathers',
    councilsAttended: ['First Council of Constantinople (381)'],
    works: [
      {
        title: 'Five Theological Orations',
        date: '380 AD',
        description: 'Delivered in Constantinople, these five sermons are the summit of patristic Trinitarian theology — a precise and passionate defense of the full divinity of the Son and the Holy Spirit. They earned him the title "The Theologian."',
      },
      {
        title: 'Autobiographical Poems',
        date: 'c. 382–390 AD',
        description: 'Remarkable personal poetry including De Vita Sua (On His Own Life) — the longest autobiographical poem in Greek antiquity. They reveal an unusually interior and sensitive patristic figure.',
      },
    ],
    relatedFathers: ['basil', 'gregory-nyssa', 'athanasius', 'cyril-alexandria'],
    contextNote: 'Only two figures in Orthodox tradition are called "the Theologian" — St. John the Evangelist and Gregory of Nazianzus. He presided briefly over the First Council of Constantinople (381) before resigning, unable to bear the conflict. He spent his last years writing poetry on his estate.',
  },

  'gregory-nyssa': {
    era: 'Nicene',
    location: 'Nyssa, Cappadocia (modern Turkey)',
    school: 'Cappadocian Fathers',
    councilsAttended: ['First Council of Constantinople (381)'],
    works: [
      {
        title: 'Life of Moses (De Vita Moysis)',
        date: 'c. 390 AD',
        description: 'A masterpiece of Christian mysticism reading Moses\'s ascent of Sinai as the paradigm of the soul\'s infinite ascent into God. Introduces the concept of epektasis — perpetual spiritual progress into inexhaustible divine infinity.',
      },
      {
        title: 'On the Soul and the Resurrection (De Anima et Resurrectione)',
        date: 'c. 380 AD',
        description: 'A Platonic dialogue modeled on Plato\'s Phaedo, in which Gregory discusses the resurrection of the body with his dying sister Macrina.',
      },
      {
        title: 'Against Eunomius (Contra Eunomium)',
        date: '380–383 AD',
        description: 'A refutation of Eunomius, who argued that human reason could fully comprehend God\'s essence. Gregory\'s response anchors Orthodox apophatic theology.',
      },
    ],
    relatedFathers: ['basil', 'gregory-nazianzus', 'origen', 'athanasius'],
    contextNote: 'Gregory of Nyssa is the most philosophically sophisticated of the Cappadocians. His concept of epektasis — that the soul eternally grows into God because God is infinite — influenced Christian mysticism across all traditions. He is the only Cappadocian Father who addressed the status of women in theology, drawing on his sister Macrina as a model.',
  },

  ignatius: {
    era: 'Apostolic Fathers',
    location: 'Antioch, Syria',
    school: 'Apostolic Fathers',
    works: [
      {
        title: 'Seven Letters',
        date: 'c. 107–117 AD',
        description: 'Written en route to martyrdom in Rome, these seven letters to the churches of Ephesus, Magnesia, Tralles, Rome, Philadelphia, Smyrna, and to Polycarp are the most important sub-apostolic documents after 1 Clement. They insist on the real flesh of Christ, the real presence in the Eucharist, the authority of the bishop, and the unity of the Church.',
      },
    ],
    relatedFathers: ['clement-rome', 'polycarp (student)', 'irenaeus', 'cyprian'],
    contextNote: 'Ignatius was the third bishop of Antioch and is believed to have known the Apostles personally. He coined the term "Catholic Church" (kath\' holos — universal). On his way to Rome to be devoured by lions, he begged the Roman Christians not to prevent his martyrdom: "I am the wheat of God and I am ground by the teeth of beasts that I may become pure bread of Christ."',
  },

  irenaeus: {
    era: 'Ante-Nicene',
    location: 'Smyrna (born) & Lyon, Gaul',
    school: 'Asian Fathers / Western Church',
    works: [
      {
        title: 'Against Heresies (Adversus Haereses)',
        date: 'c. 180 AD',
        description: 'Five volumes exposing and refuting Gnosticism — the most comprehensive anti-heretical work of the early Church. Books I–II describe Gnostic systems; Books III–V argue from Scripture and apostolic tradition.',
      },
      {
        title: 'Demonstration of the Apostolic Preaching (Epideixis)',
        date: 'c. 190 AD',
        description: 'A summary of Christian doctrine for catechumens, only rediscovered in Armenian in 1904. Shows the "rule of faith" in its earliest systematic form.',
      },
    ],
    relatedFathers: ['ignatius', 'justin', 'clement-rome', 'origen'],
    contextNote: 'Irenaeus was a disciple of Polycarp of Smyrna, who was himself a disciple of John the Apostle — making Irenaeus just two steps from an eyewitness of Christ. His concept of recapitulation (anakephalaiosis) — that Christ undoes Adam\'s fall by re-traversing human life perfectly — became foundational for Coptic soteriology.',
  },

  chrysostom: {
    era: 'Post-Nicene',
    location: 'Antioch & Constantinople',
    school: 'Antiochene School',
    councilsAttended: [],
    works: [
      {
        title: 'Homilies on the Gospel of Matthew',
        date: 'c. 390 AD',
        description: '90 homilies on Matthew\'s Gospel, renowned for their moral urgency and social concern. "When you look at a poor man, you look at Christ."',
      },
      {
        title: 'Homilies on the Epistle to the Romans',
        date: 'c. 390–398 AD',
        description: '32 homilies, praised by Luther and Calvin for their clarity. The most important patristic commentary on Romans.',
      },
      {
        title: 'On the Priesthood (De Sacerdotio)',
        date: 'c. 390 AD',
        description: 'A dialogue on the dignity and demands of ordained ministry, still assigned in seminary curricula. Sets the highest possible standard for pastoral care.',
      },
      {
        title: 'Divine Liturgy of Saint John Chrysostom',
        date: 'c. 400 AD',
        description: 'The standard liturgy of Eastern Orthodoxy and Byzantine Christianity, used by hundreds of millions of Christians. The Coptic Church also uses his liturgy on certain occasions.',
      },
    ],
    relatedFathers: ['basil', 'gregory-nazianzus', 'cyril-jerusalem', 'ephrem'],
    contextNote: 'Chrysostom (Χρυσόστομος = "golden-mouthed") was named posthumously for his extraordinary preaching. His homilies on care for the poor and condemnation of the wealthy are among the most radical social critiques in Christian literature. He was twice exiled by Empress Eudoxia, dying in exile in 407 AD.',
  },

  justin: {
    era: 'Ante-Nicene',
    location: 'Samaria (born) & Rome',
    school: 'Early Apologists',
    works: [
      {
        title: 'First Apology',
        date: 'c. 155 AD',
        description: 'Addressed to Emperor Antoninus Pius, this defense of Christianity refutes pagan caricatures and contains the most detailed description of early Christian worship (Sunday Eucharist) in any document outside the New Testament.',
      },
      {
        title: 'Second Apology',
        date: 'c. 155 AD',
        description: 'A shorter supplement addressed to the Roman Senate, responding to specific executions of Christians.',
      },
      {
        title: 'Dialogue with Trypho',
        date: 'c. 155–160 AD',
        description: 'The first extended Christian apologetic to Judaism, arguing from the Hebrew Scriptures that Jesus is the Messiah. Modeled on Platonic dialogue form.',
      },
    ],
    relatedFathers: ['irenaeus', 'clement-alexandria', 'origen', 'ignatius'],
    contextNote: 'Justin taught in Rome wearing the philosopher\'s cloak — he never gave it up after his conversion, seeing Christianity as the "true philosophy." He is the first Christian we know of who engaged seriously with both pagan philosophy and Jewish Scripture in a single intellectual framework. He was beheaded in Rome c. 165 AD.',
  },

  origen: {
    era: 'Ante-Nicene',
    location: 'Alexandria & Caesarea, Egypt/Palestine',
    school: 'Alexandrian Catechetical School',
    works: [
      {
        title: 'Hexapla',
        date: 'c. 230–240 AD',
        description: 'A six-column parallel edition of the Hebrew Bible: Hebrew text, Hebrew in Greek letters, and four Greek translations (including the Septuagint). The greatest work of ancient biblical scholarship.',
      },
      {
        title: 'On First Principles (De Principiis / Peri Archon)',
        date: 'c. 220–230 AD',
        description: 'The first systematic theology in Christian history, treating God, creation, free will, and Scripture. Some of its speculations (pre-existence of souls, universal restoration) were later condemned.',
      },
      {
        title: 'Against Celsus (Contra Celsum)',
        date: 'c. 248 AD',
        description: 'The finest work of early Christian apologetics, refuting the philosopher Celsus\'s comprehensive critique of Christianity point by point. A masterwork of intellectual engagement.',
      },
      {
        title: 'Homilies on the Old Testament',
        date: 'c. 240–250 AD',
        description: 'Hundreds of homilies reading the OT allegorically as prefiguring Christ and the Church. Shaped the entire subsequent tradition of Christian biblical interpretation.',
      },
    ],
    relatedFathers: ['clement-alexandria', 'athanasius', 'gregory-nazianzus', 'gregory-nyssa'],
    contextNote: 'Origen was the most prolific writer of the ancient world (reportedly over 800 works). He voluntarily castrated himself (based on Matthew 19:12), a decision he later regretted. He was tortured under Decius but survived; he died of his injuries c. 253 AD. His student Gregory Thaumaturgus converted entirely through Origen\'s teaching. Despite his later condemnation, he is listed as "The Scholar" rather than Saint in the Coptic tradition.',
  },
};
