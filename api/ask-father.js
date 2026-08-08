/**
 * Vercel Serverless Function — /api/ask-father
 *
 * Two modes, chosen at request time:
 *   • LANGGRAPH_API_URL set  → thin, low-latency streaming proxy to the Abba
 *     LangGraph deployment (grounded, self-verifying pipeline).
 *   • LANGGRAPH_API_URL unset → fallback to the original direct-Anthropic bot,
 *     so `main` (and production) keeps working until the graph is deployed and
 *     the env var is set in Vercel. Setting the env var flips the cutover.
 *
 * Both modes stream the same SSE contract the AskAFather widget consumes:
 *   {type:'delta'} · {type:'status'} · {type:'meta'} · {type:'done'} · {type:'error'}
 *
 * Env:
 *   LANGGRAPH_API_URL    e.g. https://<deployment>.us.langgraph.app  (omit to use fallback)
 *   LANGGRAPH_API_KEY    LangSmith API key for the deployment
 *   LANGGRAPH_ASSISTANT  graph id (default "abba")
 *   ANTHROPIC_API_KEY    required by the fallback mode
 */

export const config = { maxDuration: 60 };

// ── Rate limiting (in-memory, per warm instance) ────────────
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000;

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

function sseHeaders(res) {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();
}

const STAGE_TONES = {
  curious:    'VISITOR STAGE: Just Curious. Speak gently with no jargon. Compare to familiar Protestant or general Christian concepts. Do not assume prior knowledge of Orthodoxy. Keep it warm and inviting.',
  exploring:  'VISITOR STAGE: Seriously Exploring. This person is studying the faith critically. Use theological depth, cite specific Fathers and works, be honest and direct about where Coptic Orthodoxy differs from Protestantism.',
  converting: 'VISITOR STAGE: Preparing to Convert. This person is close to or actively entering the Church. Be practical and personal. Focus on sacramental life, what catechumenate involves, the lived experience of the faith.',
};

// ─────────────────────────────────────────────────────────────
// Mode A — LangGraph proxy
// ─────────────────────────────────────────────────────────────

// LangGraph message ids and metadata keys share a uuid after a "--" prefix
// (e.g. "lc_run--<uuid>" vs "run--<uuid>"); normalize to the uuid to map them.
const normId = (id) => (id || '').split('--').pop();

async function forwardToGraph(res, { question, pageContext, journeyStage }) {
  const API = process.env.LANGGRAPH_API_URL.replace(/\/$/, '');
  const headers = { 'content-type': 'application/json' };
  if (process.env.LANGGRAPH_API_KEY) headers['x-api-key'] = process.env.LANGGRAPH_API_KEY;

  let upstream;
  try {
    upstream = await fetch(`${API}/runs/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        assistant_id: process.env.LANGGRAPH_ASSISTANT || 'abba',
        input: {
          question: question.trim(),
          page_context: pageContext ?? null,
          journey_stage: journeyStage ?? null,
        },
        stream_mode: ['messages', 'custom'],
      }),
    });
  } catch (err) {
    console.error('abba fetch error:', err);
    return res.status(502).json({ error: 'Could not reach the service. Please try again.' });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    console.error('abba upstream error:', upstream.status, detail);
    return res.status(502).json({ error: 'Could not reach the service. Please try again.' });
  }

  sseHeaders(res);
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  const nodeById = new Map();  // normalized msg id → langgraph node
  const sentLen = new Map();   // normalized msg id → chars already forwarded

  const handleEvent = (event, dataStr) => {
    if (!dataStr) return;
    let data;
    try { data = JSON.parse(dataStr); } catch { return; }

    if (event === 'messages/metadata') {
      for (const [key, val] of Object.entries(data)) {
        const node = val?.metadata?.langgraph_node;
        if (node) nodeById.set(normId(key), node);
      }
    } else if (event === 'messages/partial') {
      const msg = Array.isArray(data) ? data[0] : data;
      if (!msg) return;
      const id = normId(msg.id);
      if (nodeById.get(id) !== 'synthesize') return;  // ignore the meta node's tool-call message
      let text = msg.content;
      if (Array.isArray(text)) text = text.map((b) => (typeof b === 'string' ? b : b?.text || '')).join('');
      if (typeof text !== 'string') return;
      const prev = sentLen.get(id) || 0;
      if (text.length > prev) {
        send({ type: 'delta', text: text.slice(prev) });  // partials are cumulative → forward the diff
        sentLen.set(id, text.length);
      }
    } else if (event === 'custom') {
      if (data.kind === 'status') {
        send({ type: 'status', text: data.text });
      } else if (data.kind === 'meta') {
        send({
          type: 'meta',
          citations: data.citations || [],
          scripture: data.scripture || [],
          suggestedFollowUps: data.followups || [],
        });
      }
    } else if (event === 'error') {
      send({ type: 'error', error: 'The connection was interrupted. Please try again.' });
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const blocks = buf.split(/\r?\n\r?\n/);  // LangGraph uses CRLF event separators
      buf = blocks.pop() ?? '';
      for (const block of blocks) {
        let event = 'message';
        const dataLines = [];
        for (const line of block.split(/\r?\n/)) {
          if (line.startsWith('event:')) event = line.slice(6).trim();
          else if (line.startsWith('data:')) dataLines.push(line.slice(5).replace(/^ /, ''));
        }
        handleEvent(event, dataLines.join('\n'));
      }
    }
    send({ type: 'done' });
    res.end();
  } catch (err) {
    console.error('abba stream error:', err);
    send({ type: 'error', error: 'The connection was interrupted. Please try again.' });
    res.end();
  }
}

// ─────────────────────────────────────────────────────────────
// Mode B — direct Anthropic fallback (original behavior)
// ─────────────────────────────────────────────────────────────

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

RESPONSE FORMAT — Follow this exactly:
First, write your pastoral answer as plain prose (2-3 paragraphs). No markdown, no headings, no JSON in this part.
Then output the delimiter ⟦META⟧ on its own line.
After the delimiter, output a single valid JSON object — no markdown fences, no extra text — with this shape:
{
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

const META_DELIM = '⟦META⟧';

async function askAnthropicDirect(res, { question, pageContext, journeyStage }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const stageTone = STAGE_TONES[journeyStage] ?? '';
  const contextNote = pageContext?.topic ? `[The user is currently reading about: ${pageContext.topic}]` : '';
  const prefix = [stageTone, contextNote].filter(Boolean).join('\n');
  const userMessage = prefix ? `${prefix}\n\n${question.trim()}` : question.trim();

  let anthropicRes;
  try {
    anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1200,
        stream: true,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
  } catch (err) {
    console.error('ask-father fetch error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }

  if (!anthropicRes.ok || !anthropicRes.body) {
    const err = await anthropicRes.text().catch(() => '');
    console.error('Anthropic error:', err);
    return res.status(502).json({ error: 'Could not reach the API. Please try again.' });
  }

  sseHeaders(res);
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  const reader = anthropicRes.body.getReader();
  const decoder = new TextDecoder();
  let sseBuf = '';
  let full = '';
  let sentLen = 0;

  const flushProse = (final) => {
    const idx = full.indexOf(META_DELIM);
    const proseEnd = idx === -1 ? full.length : idx;
    const safeEnd = (idx === -1 && !final)
      ? Math.max(sentLen, proseEnd - (META_DELIM.length - 1))
      : proseEnd;
    if (safeEnd > sentLen) {
      send({ type: 'delta', text: full.slice(sentLen, safeEnd) });
      sentLen = safeEnd;
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      sseBuf += decoder.decode(value, { stream: true });

      const lines = sseBuf.split('\n');
      sseBuf = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        let event;
        try { event = JSON.parse(payload); } catch { continue; }
        if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
          full += event.delta.text;
          flushProse(false);
        }
      }
    }

    flushProse(true);

    const idx = full.indexOf(META_DELIM);
    if (idx !== -1) {
      const tail = full.slice(idx + META_DELIM.length)
        .replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      try {
        const meta = JSON.parse(tail);
        send({
          type: 'meta',
          citations: Array.isArray(meta.citations) ? meta.citations : [],
          scripture: Array.isArray(meta.scripture) ? meta.scripture : [],
          suggestedFollowUps: Array.isArray(meta.suggestedFollowUps) ? meta.suggestedFollowUps : [],
        });
      } catch {
        console.error('Meta JSON parse failed:', tail);
      }
    }

    send({ type: 'done' });
    res.end();
  } catch (err) {
    console.error('ask-father stream error:', err);
    send({ type: 'error', error: 'The connection was interrupted. Please try again.' });
    res.end();
  }
}

// ─────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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

  const payload = { question, pageContext, journeyStage };
  return process.env.LANGGRAPH_API_URL
    ? forwardToGraph(res, payload)
    : askAnthropicDirect(res, payload);
}
