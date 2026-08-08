/**
 * Vercel Serverless Function — /api/ask-father
 *
 * Thin, low-latency streaming proxy to the Abba LangGraph deployment. It
 * translates LangGraph's native stream (messages/partial + custom channels)
 * into the SSE contract the AskAFather widget already consumes:
 *   {type:'delta'} · {type:'status'} · {type:'meta'} · {type:'done'} · {type:'error'}
 *
 * Latency notes:
 *   - zero npm deps (native fetch) → minimal cold start
 *   - pure passthrough: every token is forwarded the instant it arrives, no buffering
 *   - run this function in the SAME Vercel region as the LangGraph deployment
 *     (set "regions" in vercel.json) to keep the proxy↔graph hop sub-millisecond
 *
 * Env (set in Vercel):
 *   LANGGRAPH_API_URL    e.g. https://<deployment>.us.langgraph.app  (or http://127.0.0.1:2024 for local dev)
 *   LANGGRAPH_API_KEY    LangSmith API key (omit for the local dev server)
 *   LANGGRAPH_ASSISTANT  graph id (default "abba")
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

// LangGraph message ids and metadata keys share a uuid after a "--" prefix
// (e.g. "lc_run--<uuid>" vs "run--<uuid>"); normalize to the uuid to map them.
const normId = (id) => (id || '').split('--').pop();

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

  const API = process.env.LANGGRAPH_API_URL;
  if (!API) {
    console.error('LANGGRAPH_API_URL not set');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const headers = { 'content-type': 'application/json' };
  if (process.env.LANGGRAPH_API_KEY) headers['x-api-key'] = process.env.LANGGRAPH_API_KEY;

  let upstream;
  try {
    upstream = await fetch(`${API.replace(/\/$/, '')}/runs/stream`, {
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

  // ── Stream out as SSE ─────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

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
