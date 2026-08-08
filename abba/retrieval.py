"""Retrieval layer: Pinecone with integrated inference.

The index embeds text server-side (see PINECONE_EMBED_MODEL), so the service
carries no local embedding model — keeping serverless cold starts light. Kept
behind a small interface so the store can be swapped without touching the graph.
"""
from __future__ import annotations

from functools import lru_cache

from pinecone import Pinecone

import settings


def _g(obj, key, default=None):
    """Read a field from a Pinecone response object (dict- or attr-style)."""
    try:
        return obj[key]
    except (KeyError, TypeError, IndexError):
        return getattr(obj, key, default)


class Retriever:
    def __init__(self):
        self._pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self._index = self._pc.Index(settings.PINECONE_INDEX)

    def search(self, query: str, k: int = settings.TOP_K) -> list[dict]:
        res = self._index.search(
            namespace=settings.PINECONE_NAMESPACE,
            query={"inputs": {"text": query}, "top_k": k},
        )
        hits = _g(_g(res, "result", {}), "hits", []) or []
        out = []
        for h in hits:
            f = _g(h, "fields", {}) or {}
            out.append({
                "chunk_id": _g(h, "_id", ""),
                "type": _g(f, "type", ""),
                "title": _g(f, "title", ""),
                "source": _g(f, "source", "") or "",
                "verified": bool(_g(f, "verified", False)),
                "subject_id": _g(f, "subject_id", ""),
                "subject_name": _g(f, "subject_name", ""),
                "text": _g(f, "text", ""),
                "score": _g(h, "_score", 0.0),
            })
        return out


@lru_cache(maxsize=1)
def get_retriever() -> Retriever:
    return Retriever()
