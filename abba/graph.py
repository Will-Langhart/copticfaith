"""The LangGraph pipeline — deployed on LangGraph Platform.

    retrieve → synthesize → meta → verify → END

Streaming is LangGraph-native (no custom server):
  - the pastoral answer streams as LLM tokens (stream_mode="messages") from the
    `synthesize` node; the proxy filters to messages where langgraph_node ==
    "synthesize".
  - status pings and the final citation payload go on the "custom" channel via
    get_stream_writer().

Phase 3 grows this by inserting a Supervisor before `retrieve` that routes to
specialist nodes; State and the streamed channels do not change.
"""
from __future__ import annotations

import asyncio
import json
import re
from difflib import SequenceMatcher
from functools import lru_cache
from typing import List, Optional, TypedDict

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.config import get_stream_writer
from langgraph.graph import END, StateGraph
from pydantic import BaseModel, Field

import settings
from retrieval import get_retriever


# ── State ─────────────────────────────────────────────────────
class State(TypedDict, total=False):
    question: str
    page_context: Optional[dict]
    journey_stage: Optional[str]
    focus_name: Optional[str]
    retrieved: List[dict]
    answer: str
    proposed: dict
    citations: List[dict]
    scripture: List[str]
    followups: List[str]


# ── Structured output for the meta node ───────────────────────
class Citation(BaseModel):
    attribution: str = Field(description="Who said it, e.g. 'Saint Athanasius'")
    quote: str = Field(description="The exact quotation text")


class MetaOut(BaseModel):
    citations: List[Citation] = Field(default_factory=list)
    scripture: List[str] = Field(default_factory=list, description="Bible references, e.g. 'John 3:5'")
    followups: List[str] = Field(default_factory=list, description="Exactly two natural follow-up questions")


# ── Models (lazy singletons) ──────────────────────────────────
@lru_cache(maxsize=1)
def _synth_model() -> ChatAnthropic:
    return ChatAnthropic(model=settings.SYNTH_MODEL, max_tokens=1200)


@lru_cache(maxsize=1)
def _meta_model():
    # Structured output → tool call, so no prose tokens leak into the stream.
    return ChatAnthropic(model=settings.META_MODEL, max_tokens=700).with_structured_output(MetaOut)


# ── Prompts ───────────────────────────────────────────────────
STAGE_TONES = {
    "curious": "The visitor is just curious. Speak gently, no jargon, relate to familiar Christian concepts.",
    "exploring": "The visitor is seriously studying the faith. Use theological depth and name specific Fathers.",
    "converting": "The visitor is close to entering the Church. Be practical and personal about sacramental life.",
}

SYNTH_SYSTEM = """You are a theological companion for CopticFaith.com, guiding visitors — from the \
merely curious to those preparing to enter the ancient Coptic Orthodox faith.

Write a warm, pastoral answer as PLAIN PROSE only — 2-3 short paragraphs.
Absolutely NO Markdown of any kind: no '#' headings or titles, no '*'/'-' bullet lists,
no '**bold**' or '_italics_', no backticks. Begin directly with your first sentence, not a title.

Rules:
- Ground your answer in the SOURCES provided below. They are ordered most-relevant first — lean on the
  earliest, highest-relevance ones and on any marked VERIFIED QUOTE. Prefer them over general knowledge.
- Keep Jesus Christ — His Incarnation, Cross, and Resurrection — at the center.
- Name Church Fathers when relevant, but do NOT fabricate direct quotations; a later step attaches verified quotes.
- Be honest and gentle about where traditions differ. If the sources don't address the question, say so."""

META_SYSTEM = (
    "You extract supporting citations, relevant scripture, and follow-up questions. "
    "Cite ONLY quotations from the provided verified-quotes list, copied verbatim — never invent or paraphrase a quote."
)


def _context_block(retrieved: List[dict]) -> str:
    lines = []
    for i, r in enumerate(retrieved, 1):
        name = r.get("subject_name") or r.get("title") or ""
        tags = [t for t in (r.get("type", ""), "VERIFIED QUOTE" if r.get("verified") else "") if t]
        tags.append(f"relevance {r.get('score', 0.0):.2f}")
        src = f" — {r['source']}" if r.get("source") else ""
        lines.append(f"[S{i}] {name} ({', '.join(tags)}){src}:\n{r['text']}")
    return "\n\n".join(lines)


def _verified_quotes_block(retrieved: List[dict]) -> str:
    """The verified quotes present in the retrieved set — meta cites only from these."""
    lines, n = [], 0
    for r in retrieved:
        if not r.get("verified"):
            continue
        n += 1
        name = r.get("subject_name") or r.get("title") or ""
        src = f" — {r['source']}" if r.get("source") else ""
        lines.append(f'[Q{n}] {name}{src}: "{r["text"]}"')
    return "\n".join(lines)


# ── Father focus (questions asked from a /fathers/:id profile) ──
# The saints calendar files some Fathers under a second id; search both.
FATHER_ALIASES = {
    "basil": ["basil-great"],
    "chrysostom": ["john-chrysostom"],
    "gregory-nazianzus": ["gregory-theologian"],
    "ignatius": ["ignatius-antioch"],
    "justin": ["justin-martyr"],
}
FOCUS_K = 3  # how many of TOP_K slots the focused Father's own sources may take


def _focus_father_id(state: State) -> Optional[str]:
    fid = (state.get("page_context") or {}).get("father_id")
    return fid if isinstance(fid, str) and re.fullmatch(r"[a-z0-9-]{1,40}", fid) else None


def _merge(focused: List[dict], general: List[dict], k: int) -> List[dict]:
    """Focused hits first, then general hits not already present, capped at k."""
    out, seen = [], set()
    for h in focused + general:
        if h["chunk_id"] in seen:
            continue
        seen.add(h["chunk_id"])
        out.append(h)
        if len(out) >= k:
            break
    return out


# ── Nodes ─────────────────────────────────────────────────────
def _search(question: str, k: int, subject_ids: Optional[List[str]] = None) -> List[dict]:
    # Runs in a worker thread — keeps the Pinecone HTTP call off the event loop.
    return get_retriever().search(question, k, subject_ids)


async def retrieve(state: State) -> dict:
    get_stream_writer()({"kind": "status", "text": "Searching the Fathers…"})
    question = state["question"]
    fid = _focus_father_id(state)
    if not fid:
        return {"retrieved": await asyncio.to_thread(_search, question, settings.TOP_K)}

    focused, general = await asyncio.gather(
        asyncio.to_thread(_search, question, FOCUS_K, [fid, *FATHER_ALIASES.get(fid, [])]),
        asyncio.to_thread(_search, question, settings.TOP_K),
    )
    # Name comes from the index, not the client, so it is safe to put in the prompt.
    focus_name = next((h["subject_name"] for h in focused if h.get("subject_name")), None)
    return {"retrieved": _merge(focused, general, settings.TOP_K), "focus_name": focus_name}


async def synthesize(state: State) -> dict:
    get_stream_writer()({"kind": "status", "text": "Reflecting…"})

    retrieved = state.get("retrieved", [])
    prefix = []
    if tone := STAGE_TONES.get(state.get("journey_stage") or ""):
        prefix.append(tone)
    if (pc := state.get("page_context")) and pc.get("topic"):
        prefix.append(f"The visitor is currently reading about: {pc['topic']}.")
    if name := state.get("focus_name"):
        prefix.append(
            f"The visitor asked this from the profile page of {name}. Center the answer on {name}'s own "
            "teaching and life, leaning first on the sources about him (listed first below); bring in other "
            "Fathers or Scripture only as they illuminate his thought. Speak about him in the third person "
            "— never write as though you were him."
        )

    # Focused sources come first, so the list is no longer strictly best-first.
    top_score = max((r.get("score", 0.0) for r in retrieved), default=0.0)
    if not retrieved or top_score < settings.RELEVANCE_FLOOR:
        prefix.append(
            "The sources below only weakly match this question. Answer briefly from what is genuinely "
            "relevant; if the Fathers' sources here don't directly address it, say so plainly rather "
            "than inventing specifics."
        )

    user = (
        ("\n".join(prefix) + "\n\n" if prefix else "")
        + f"SOURCES:\n{_context_block(retrieved)}\n\n"
        + f"QUESTION: {state['question']}"
    )
    # Tokens stream automatically to the "messages" channel during this call.
    msg = await _synth_model().ainvoke([SystemMessage(SYNTH_SYSTEM), HumanMessage(user)])
    return {"answer": msg.content if isinstance(msg.content, str) else str(msg.content)}


async def meta(state: State) -> dict:
    get_stream_writer()({"kind": "status", "text": "Gathering citations…"})
    retrieved = state.get("retrieved", [])
    quotes_block = _verified_quotes_block(retrieved) or "(none available — return no citations)"
    user = (
        f"QUESTION: {state['question']}\n\n"
        f"ANSWER GIVEN:\n{state.get('answer', '')}\n\n"
        "QUOTES YOU MAY CITE (copy the text verbatim; choose the 1-3 most relevant to the answer; "
        f"if none genuinely fit, return no citations):\n{quotes_block}\n\n"
        f"CONTEXT (for scripture and follow-ups only):\n{_context_block(retrieved)}\n\n"
        "Provide citations drawn only from the quotes list above, relevant scripture, and exactly two follow-up questions."
        + (f" Prefer quotes from {name} when they fit." if (name := state.get("focus_name")) else "")
    )
    out: MetaOut = await _meta_model().ainvoke([SystemMessage(META_SYSTEM), HumanMessage(user)])
    return {"proposed": out.model_dump()}


async def verify(state: State) -> dict:
    writer = get_stream_writer()
    writer({"kind": "status", "text": "Verifying citations…"})
    proposed = state.get("proposed", {}) or {}

    citations, seen = [], set()
    for c in proposed.get("citations", []):
        match = _match_verified_quote(c.get("quote", ""))
        if match and match["id"] not in seen:
            seen.add(match["id"])
            m = match["metadata"]
            citations.append({
                "fatherId": m.get("id", ""),
                "name": m.get("attribution") or m.get("name", c.get("attribution", "")),
                "quote": match["text"],          # canonical corpus text, not the model's paraphrase
                "work": match.get("source", ""),
            })

    # Fallback: meta proposed nothing citable but a verified quote was retrieved — surface the top one.
    if settings.CITATION_FALLBACK and not citations:
        if fb := _fallback_citation(state.get("retrieved", [])):
            citations.append(fb)

    scripture = [s for s in proposed.get("scripture", []) if _looks_like_ref(s)][:3]
    followups = [q for q in proposed.get("followups", []) if q.strip()][:2]

    result = {"citations": citations, "scripture": scripture, "followups": followups}
    writer({"kind": "meta", **result})  # final payload on the custom channel
    return result


# ── Verifier gate ─────────────────────────────────────────────
def _norm(s: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", (s or "").lower()).strip()


def _load_verified_quotes() -> List[dict]:
    with open(settings.VERIFIED_QUOTES_PATH, encoding="utf-8") as f:
        return json.load(f)


# Loaded at import (off the event loop) so the verify node never blocks it.
_VERIFIED_QUOTES = _load_verified_quotes()


def _match_verified_quote(quote: str, threshold: float = 0.6) -> Optional[dict]:
    """A proposed quote survives only if it substantially matches a corpus quote."""
    q = _norm(quote)
    if len(q) < 12:
        return None
    best, best_score = None, 0.0
    for rec in _VERIFIED_QUOTES:
        t = _norm(rec["text"])
        if q in t or t in q:
            return rec
        score = SequenceMatcher(None, q, t).ratio()
        if score > best_score:
            best, best_score = rec, score
    return best if best_score >= threshold else None


def _fallback_citation(retrieved: List[dict]) -> Optional[dict]:
    """Top-ranked retrieved verified quote, resolved to its canonical corpus record."""
    for r in retrieved:
        if not r.get("verified"):
            continue
        match = _match_verified_quote(r.get("text", ""))
        if not match:
            continue
        m = match["metadata"]
        return {
            "fatherId": m.get("id", ""),
            "name": m.get("attribution") or m.get("name", ""),
            "quote": match["text"],
            "work": match.get("source", ""),
        }
    return None


def _looks_like_ref(s: str) -> bool:
    return bool(re.match(r"^[1-3]?\s?[A-Z][a-z]+.*\d", s.strip()))


# ── Build ─────────────────────────────────────────────────────
def build_graph():
    g = StateGraph(State)
    g.add_node("retrieve", retrieve)
    g.add_node("synthesize", synthesize)
    g.add_node("meta", meta)
    g.add_node("verify", verify)
    g.set_entry_point("retrieve")
    g.add_edge("retrieve", "synthesize")
    g.add_edge("synthesize", "meta")
    g.add_edge("meta", "verify")
    g.add_edge("verify", END)
    return g.compile()


# LangGraph Platform / CLI entry point (see langgraph.json).
graph = build_graph()
