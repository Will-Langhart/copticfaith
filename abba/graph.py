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

SYNTH_SYSTEM = """You are a theological companion for CopticFaith.com, guiding seekers and Protestants \
exploring the ancient Coptic Orthodox faith.

Write ONLY a warm, pastoral answer in plain prose (2-3 short paragraphs). No headings, no lists, no JSON.

Rules:
- Ground your answer in the SOURCES provided below. Prefer them over general knowledge.
- Keep Jesus Christ — His Incarnation, Cross, and Resurrection — at the center.
- Name Church Fathers when relevant, but do NOT fabricate direct quotations; a later step attaches verified quotes.
- Be honest and gentle about where traditions differ. If the sources don't address the question, say so."""

META_SYSTEM = """You extract supporting citations from the provided sources.

Citation rules — follow exactly:
- A citation MUST be an actual quotation spoken or written BY a Church Father or saint, \
appearing verbatim in the sources. Never propose biography, dates, titles, honorifics, \
or third-person description ABOUT a person as a quotation.
- `attribution` MUST be the person's name alone (e.g. "Saint Cyril of Alexandria"). Never \
include a source-type prefix, a parenthetical, or a "source: ..." suffix.
- `quote` MUST be the exact quotation text and nothing else.
- If no source contains a real quotation, return an EMPTY citations list. Do not pad it \
with descriptive prose.
- Every proposed citation is checked against a verified-quote corpus and is SILENTLY \
DISCARDED when it is not a real quotation, so one bad proposal can cost the reader every \
citation. Propose nothing rather than something unverifiable."""

QUOTE_TYPES = ("father_quote", "saint_quote")


def _context_block(retrieved: List[dict]) -> str:
    lines = []
    for r in retrieved:
        subject = r.get("subject_name") or r.get("title") or ""
        block = f"--- SOURCE (kind={r['type']})"
        if subject:
            block += f"\nAttribution: {subject}"
        if r.get("source"):
            block += f"\nWork: {r['source']}"
        lines.append(f"{block}\nText: {r['text']}")
    return "\n\n".join(lines)


# ── Nodes ─────────────────────────────────────────────────────
def _search(question: str, k: int) -> List[dict]:
    # Runs in a worker thread — keeps the Pinecone HTTP call off the event loop.
    return get_retriever().search(question, k)


async def retrieve(state: State) -> dict:
    get_stream_writer()({"kind": "status", "text": "Searching the Fathers…"})
    hits = await asyncio.to_thread(_search, state["question"], settings.TOP_K)
    # `meta` can only cite quotation chunks; a top-k pass full of bio/reading chunks
    # leaves it nothing real to quote, and every proposal then fails verification.
    if not any(h.get("type") in QUOTE_TYPES for h in hits):
        wider = await asyncio.to_thread(_search, state["question"], settings.QUOTE_TOP_K)
        seen = {h.get("chunk_id") for h in hits}
        hits = hits + [
            h for h in wider
            if h.get("type") in QUOTE_TYPES and h.get("chunk_id") not in seen
        ][: settings.QUOTE_BACKFILL]
    return {"retrieved": hits}


async def synthesize(state: State) -> dict:
    get_stream_writer()({"kind": "status", "text": "Reflecting…"})

    prefix = []
    if tone := STAGE_TONES.get(state.get("journey_stage") or ""):
        prefix.append(tone)
    if (pc := state.get("page_context")) and pc.get("topic"):
        prefix.append(f"The visitor is currently reading about: {pc['topic']}.")

    user = (
        ("\n".join(prefix) + "\n\n" if prefix else "")
        + f"SOURCES:\n{_context_block(state.get('retrieved', []))}\n\n"
        + f"QUESTION: {state['question']}"
    )
    # Tokens stream automatically to the "messages" channel during this call.
    msg = await _synth_model().ainvoke([SystemMessage(SYNTH_SYSTEM), HumanMessage(user)])
    return {"answer": msg.content if isinstance(msg.content, str) else str(msg.content)}


async def meta(state: State) -> dict:
    get_stream_writer()({"kind": "status", "text": "Gathering citations…"})
    user = (
        f"QUESTION: {state['question']}\n\n"
        f"ANSWER GIVEN:\n{state.get('answer', '')}\n\n"
        f"AVAILABLE SOURCES:\n{_context_block(state.get('retrieved', []))}\n\n"
        "Provide citations drawn from the sources, relevant scripture, and exactly two follow-up questions."
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

    scripture = [s for s in proposed.get("scripture", []) if _looks_like_ref(s)][:3]
    followups = [q for q in proposed.get("followups", []) if q.strip()][:2]

    result = {"citations": citations, "scripture": scripture, "followups": followups}
    if (rejected := proposed.get("citations", [])) and not citations:
        # Without this, a total drop is indistinguishable from "nothing was proposed".
        print(
            f"[verify] all {len(rejected)} proposed citations failed verification; "
            f"attributions={[c.get('attribution') for c in rejected]}"
        )
        writer({"kind": "citations_dropped", "count": len(rejected)})
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
