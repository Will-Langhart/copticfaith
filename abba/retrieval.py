"""Retrieval layer: Pinecone with integrated inference.

The index embeds text server-side (see PINECONE_EMBED_MODEL), so the service
carries no local embedding model — keeping serverless cold starts light. Kept
behind a small interface so the store can be swapped without touching the graph.
"""
from __future__ import annotations

from functools import lru_cache

from pinecone import Pinecone

import settings


class Retriever:
    def __init__(self):
        self._pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self._index = self._pc.Index(settings.PINECONE_INDEX)

    def search(self, query: str, k: int = settings.TOP_K) -> list[dict]:
        candidates = max(settings.RERANK_CANDIDATES, k)
        res = self._index.search(
            namespace=settings.PINECONE_NAMESPACE,
            query={"inputs": {"text": query}, "top_k": candidates},
            # Rerank the full candidate set (not just k) so dedup has room to work.
            rerank={"model": settings.RERANK_MODEL, "top_n": candidates, "rank_fields": ["text"]},
        )
        data = res.to_dict() if hasattr(res, "to_dict") else res
        hits = (data.get("result") or {}).get("hits") or []
        out = []
        for h in hits:
            f = h.get("fields", {}) or {}
            out.append({
                "chunk_id": h.get("_id") or h.get("id_") or "",
                "type": f.get("type", ""),
                "title": f.get("title", ""),
                "source": f.get("source", "") or "",
                "verified": bool(f.get("verified", False)),
                "subject_id": f.get("subject_id", ""),
                "subject_name": f.get("subject_name", ""),
                "text": f.get("text", ""),
                "score": h.get("_score", h.get("score_", 0.0)),
            })
        return _dedup(out, k)


def _dedup(hits: list[dict], k: int) -> list[dict]:
    """Keep the first (highest-ranked) hit per (subject_id, type), take top k.

    Keying on type — not subject_id alone — preserves a Father's bio + quote +
    teaching together while collapsing redundant same-type chunks. A plain
    subject dedup would drop a verified quote whenever the bio outranks it.
    Chunks without a subject_id (glossary, scripture) never dedup.
    """
    seen, out = set(), []
    for h in hits:
        sid = h.get("subject_id") or ""
        key = (sid, h.get("type", "")) if sid else ("", h.get("chunk_id"))
        if key in seen:
            continue
        seen.add(key)
        out.append(h)
        if len(out) >= k:
            break
    return out


@lru_cache(maxsize=1)
def get_retriever() -> Retriever:
    return Retriever()
