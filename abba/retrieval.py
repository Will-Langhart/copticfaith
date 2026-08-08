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
        res = self._index.search(
            namespace=settings.PINECONE_NAMESPACE,
            query={"inputs": {"text": query}, "top_k": k},
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
        return out


@lru_cache(maxsize=1)
def get_retriever() -> Retriever:
    return Retriever()
