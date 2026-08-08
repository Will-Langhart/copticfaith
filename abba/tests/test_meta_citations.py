"""Regression: saint-biography questions must still emit verified citations."""
from __future__ import annotations

import re

import pytest

import graph as graph_mod

BIO_HITS = [
    {
        "chunk_id": "father_bio:cyril-alexandria",
        "type": "father_bio",
        "title": "Saint Cyril of Alexandria — Biography",
        "source": "father_bio",
        "verified": True,
        "subject_id": "cyril-alexandria",
        "subject_name": "Saint Cyril of Alexandria",
        "text": "Saint Cyril of Alexandria (c. 376 – 444 AD) was the 24th Pope of Alexandria "
                "and presided over the Council of Ephesus.",
        "score": 0.9,
    },
    {
        "chunk_id": "saint:cyril-alexandria",
        "type": "saint",
        "title": "St. Cyril of Alexandria",
        "source": "St. Cyril",
        "verified": True,
        "subject_id": "cyril-alexandria",
        "subject_name": "St. Cyril of Alexandria",
        "text": "Commemorated on 3 Baba; defender of the title Theotokos.",
        "score": 0.8,
    },
]

QUOTE_HIT = {
    "chunk_id": "saint_quote:cyril-alexandria",
    "type": "saint_quote",
    "title": "St. Cyril of Alexandria — Quotation",
    "source": "St. Cyril",
    "verified": True,
    "subject_id": "cyril-alexandria",
    "subject_name": "St. Cyril of Alexandria",
    "text": "We confess that the holy Virgin is Theotokos, because God the Word was "
            "incarnate and became man.",
    "score": 0.7,
}


class _FakeSynth:
    async def ainvoke(self, messages):
        class _Msg:
            content = "Saint Cyril of Alexandria was the Pope of Alexandria who defended the Theotokos."

        return _Msg()


class _FakeMeta:
    """Stands in for a model that obeys META_SYSTEM: it quotes only quotation sources."""

    def __init__(self):
        self.prompt = ""

    async def ainvoke(self, messages):
        self.prompt = messages[-1].content
        citations = []
        for block in self.prompt.split("--- SOURCE ")[1:]:
            kind = re.match(r"\(kind=([^)]*)\)", block)
            attribution = re.search(r"^Attribution: (.*)$", block, re.M)
            text = re.search(r"^Text: (.*)$", block, re.M)
            if kind and kind.group(1) in graph_mod.QUOTE_TYPES and attribution and text:
                citations.append(
                    graph_mod.Citation(attribution=attribution.group(1), quote=text.group(1))
                )
        return graph_mod.MetaOut(citations=citations, scripture=["Luke 1:43"],
                                 followups=["Who was Nestorius?", "What is the Theotokos?"])


@pytest.fixture
def fake_models(monkeypatch):
    meta = _FakeMeta()
    monkeypatch.setattr(graph_mod, "_synth_model", lambda: _FakeSynth())
    monkeypatch.setattr(graph_mod, "_meta_model", lambda: meta)
    return meta


@pytest.fixture
def bio_only_retrieval(monkeypatch):
    def _search(question: str, k: int):
        # The top-k pass returns biography chunks only; the wider pass has the quote.
        return BIO_HITS if k <= 6 else BIO_HITS + [QUOTE_HIT]

    monkeypatch.setattr(graph_mod, "_search", _search)


@pytest.mark.asyncio
async def test_biography_question_still_emits_citations(fake_models, bio_only_retrieval):
    payloads = [
        chunk
        async for chunk in graph_mod.build_graph().astream(
            {"question": "Who was Saint Cyril?"}, stream_mode="custom"
        )
        if chunk.get("kind") == "meta"
    ]

    assert payloads, "no meta payload was emitted"
    citations = payloads[-1]["citations"]
    assert citations, "citations were emitted empty for a saint-biography question"
    for c in citations:
        for bad in ("father_bio", "saint (", "source:"):
            assert bad not in c["name"], f"chunk-type label leaked into attribution: {c['name']}"


def test_context_block_keeps_chunk_type_off_the_attribution():
    rendered = graph_mod._context_block(BIO_HITS + [QUOTE_HIT])

    for hit in BIO_HITS + [QUOTE_HIT]:
        name = hit["subject_name"]
        assert f"{hit['type']} {name}" not in rendered
        assert f"{name} (source:" not in rendered
        assert f"Attribution: {name}" in rendered
