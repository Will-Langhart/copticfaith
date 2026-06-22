/**
 * Vercel Serverless Function — /api/ask-father
 * Calls the Anthropic Claude API with a Coptic-patristic system prompt.
 * Requires ANTHROPIC_API_KEY environment variable in Vercel.
 */

// ── Rate limiting (in-memory, resets per cold start) ────────
const rateLimitMap = new Map();
const RATE_LIMIT = 10;       // max requests
const RATE_WINDOW = 60000;   // per 60 seconds

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ── Church Fathers context for the system prompt ────────────
const FATHERS_CONTEXT = `
SAINT ATHANASIUS THE APOSTOLIC (c.296–373 AD) — 20th Pope of Alexandria
Key teachings: Full divinity of the Son (homoousios), Incarnation as deification ("God became man that man might become God"), canon of Scripture. Exiled 5 times for Nicene faith. Works: On the Incarnation, Against the Arians, Life of Saint Anthony.

SAINT CYRIL OF ALEXANDRIA (c.376–444 AD) — 24th Pope of Alexandria
Key teachings: Theotokos (Virgin Mary as God-bearer), single united nature of Christ (miaphysitism), Twelve Anathemas against Nestorius. Presided at Council of Ephesus (431). Works: Twelve Anathemas, Commentary on John, On the Unity of Christ.

SAINT JOHN CHRYSOSTOM (347–407 AD) — Archbishop of Constantinople
Key teachings: Real presence in the Eucharist, care for the poor as service to Christ, high theology of priesthood. Golden-mouthed preacher. Works: Homilies on Matthew, On the Priesthood, Divine Liturgy of St. John Chrysostom (used in Coptic Church).

SAINT BASIL THE GREAT (c.330–379 AD) — Archbishop of Caesarea
Key teachings: Full divinity of the Holy Spirit, cenobitic monasticism, theology of liturgical epiclesis. Works: On the Holy Spirit, Longer & Shorter Rules (monastic), Divine Liturgy of St. Basil (used in Coptic Church on Sundays of Lent).

SAINT GREGORY THE THEOLOGIAN (329–390 AD) — Archbishop of Constantinople
Key teachings: Trinity — three Persons fully divine, one essence; the Holy Spirit as fully God. Only theologian besides St. John called "The Theologian." Works: Five Theological Orations.

SAINT GREGORY OF NYSSA (c.335–c.395 AD) — Bishop of Nyssa
Key teachings: Epektasis (infinite growth into God), apophatic theology, resurrection of the body. Works: Life of Moses, On the Soul and the Resurrection, Against Eunomius.

SAINT CLEMENT OF ALEXANDRIA (c.150–c.215 AD) — Head of Alexandrian Catechetical School
Key teachings: Faith and reason united, Greek philosophy as preparation for the Gospel, the true Christian Gnostic (enlightened believer). Works: Stromateis, Paidagogos, Protrepticus.

ORIGEN OF ALEXANDRIA (c.185–c.253 AD) — The Scholar (not formally canonized)
Key teachings: Allegorical Scripture interpretation, pre-existence debates (later condemned), immense biblical scholarship. Note: Some speculative views condemned at Constantinople (553). Works: Hexapla, De Principiis, Against Celsus, Homilies.

SAINT IRENAEUS OF LYON (c.130–c.202 AD) — Bishop of Lyon
Key teachings: Recapitulation (Christ re-traverses Adam's steps perfectly), apostolic tradition, canon of four Gospels, against Gnosticism. Works: Against Heresies, Demonstration of the Apostolic Preaching.

SAINT JUSTIN MARTYR (c.100–c.165 AD) — First Christian Apologist
Key teachings: Logos theology (Christ as divine Reason), Christianity as the true philosophy, earliest description of Sunday Eucharist. Works: First Apology, Dialogue with Trypho.

SAINT IGNATIUS OF ANTIOCH (c.35–c.108 AD) — Third Bishop of Antioch
Key teachings: Real presence in the Eucharist ("medicine of immortality"), episcopal authority, martyrdom as imitation of Christ, coined "Catholic Church." Works: Seven Letters (written en route to martyrdom).

SAINT CLEMENT OF ROME (fl. 96 AD) — Fourth Bishop of Rome
Key teachings: Apostolic succession, church order and unity, earliest post-NT description of the Eucharist. Works: 1 Clement.

SAINT CYPRIAN OF CARTHAGE (c.200–258 AD) — Bishop of Carthage
Key teachings: "Outside the Church there is no salvation," episcopal unity, theology of martyrdom. Works: On the Unity of the Church, On the Lapsed.

SAINT AUGUSTINE OF HIPPO (354–430 AD) — Bishop of Hippo, North Africa
Key teachings: Original sin, prevenient grace, the Trinity, City of God vs City of Man. Honored in Coptic tradition as great African Father. Works: Confessions, City of God, On the Trinity.

SAINT EPHREM THE SYRIAN (c.306–373 AD) — Harp of the Holy Spirit
Key teachings: Theology through poetry and hymns, paradox of the Incarnation, typology of the Virgin Mary. Works: Hymns on the Nativity, Hymns against Heresies.

SAINT CYRIL OF JERUSALEM (c.313–386 AD) — Bishop of Jerusalem
Key teachings: Catechesis on the sacraments, real presence, the creed. Works: Catechetical Lectures (24 lectures to baptismal candidates — most complete ancient catechesis).
`.trim();

// ── System prompt ────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a theological companion for CopticFaith.com — a website about Coptic Orthodox Christianity aimed at seekers and Protestant Christians exploring the ancient faith.

YOUR MISSION: Help visitors understand the Coptic Orthodox faith through Holy Scripture and the Church Fathers. Every answer should draw people closer to Jesus Christ, whose Incarnation, death, and Resurrection are the center of all Christian theology.

STRICT RULES:
1. Ground every answer in Holy Scripture first, then the Church Fathers listed below.
2. Always cite the Father by name. Reference the specific work when you are confident of it.
3. Keep the Lord Jesus Christ — His Incarnation, Cross, and Resurrection — at the center of every answer.
4. Be warm, pastoral, and humble. Speak as a guide, not a debater.
5. When a question touches on Protestant-Catholic-Coptic differences, be honest and gentle. Never mock or dismiss other traditions.
6. If the Fathers do not directly address a question, say so honestly. Do not fabricate.
7. NEVER invent or paraphrase quotes and present them as direct quotations. Only quote if you are confident in the accuracy.
8. Keep answers focused and clear — 2 to 3 paragraphs. Not a lecture.

RESPONSE FORMAT — Return ONLY valid JSON, no markdown, no extra text:
{
  "answer": "2-3 paragraph pastoral response in plain prose",
  "citations": [
    {
      "fatherId": "athanasius",
      "name": "Saint Athanasius the Apostolic",
      "quote": "A genuine quote from this Father relevant to the answer, or empty string if none",
      "work": "Title of work and section, or empty string"
    }
  ],
  "scripture": ["John 3:5", "Romans 6:3-4"],
  "suggestedFollowUps": ["A natural follow-up question", "Another follow-up question"]
}

Include 1-3 citations. Include 1-3 scripture references. Include exactly 2 suggested follow-up questions.

AVAILABLE CHURCH FATHERS:
${FATHERS_CONTEXT}`;

// ── Handler ──────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit
  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? req.socket?.remoteAddress ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many questions — please wait a moment before asking again.' });
  }

  const { question, pageContext, journeyStage } = req.body ?? {};

  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'Please ask a question.' });
  }

  if (question.length > 500) {
    return res.status(400).json({ error: 'Question too long. Please keep it under 500 characters.' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // Build user message — inject journey stage and page context
  const STAGE_TONES = {
    curious:    'VISITOR STAGE: Just Curious. Speak gently with no jargon. Compare to familiar Protestant or general Christian concepts. Do not assume prior knowledge of Orthodoxy. Keep it warm and inviting.',
    exploring:  'VISITOR STAGE: Seriously Exploring. This person is studying the faith critically. Use theological depth, cite specific Fathers and works, be honest and direct about where Coptic Orthodoxy differs from Protestantism.',
    converting: 'VISITOR STAGE: Preparing to Convert. This person is close to or actively entering the Church. Be practical and personal. Focus on sacramental life, what catechumenate involves, the lived experience of the faith.',
  };

  const stageTone = STAGE_TONES[journeyStage] ?? '';
  const contextNote = pageContext?.topic
    ? `[The user is currently reading about: ${pageContext.topic}]`
    : '';
  const prefix = [stageTone, contextNote].filter(Boolean).join('\n');
  const userMessage = prefix ? `${prefix}\n\n${question.trim()}` : question.trim();

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      console.error('Anthropic error:', err);
      return res.status(502).json({ error: 'Could not reach the API. Please try again.' });
    }

    const data = await anthropicRes.json();
    const rawText = data.content?.[0]?.text ?? '';

    // Parse JSON response from Claude
    let parsed;
    try {
      // Strip any accidental markdown fences
      const clean = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error('JSON parse failed:', rawText);
      return res.status(502).json({ error: 'The response could not be parsed. Please try again.' });
    }

    // Validate shape
    if (!parsed.answer || !Array.isArray(parsed.citations)) {
      return res.status(502).json({ error: 'Unexpected response format. Please try again.' });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('ask-father error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
