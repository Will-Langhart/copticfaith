"""Retrieval layer: fastembed (local embeddings) + Chroma (vector store).

Kept deliberately behind a small interface so the store/embedder can be
swapped for pgvector + Voyage/OpenAI in production without touching the graph.
"""
from __future__ import annotations

import json
from functools import lru_cache

import chromadb
from fastembed import TextEmbedding

import settings


class Retriever:
    def __init__(self):
        self._embedder = TextEmbedding(model_name=settings.EMBED_MODEL)
        self._client = chromadb.PersistentClient(path=str(settings.CHROMA_DIR))
        self._col = self._client.get_or_create_collection(
            settings.COLLECTION, metadata={"hnsw:space": "cosine"}
        )

    def embed(self, texts: list[str]) -> list[list[float]]:
        return [v.tolist() for v in self._embedder.embed(texts)]

    def count(self) -> int:
        return self._col.count()

    def index(self, records: list[dict], batch: int = 128) -> int:
        """Upsert corpus records. Chroma metadata must be scalar, so we flatten
        the fields the graph needs to build citations."""
        for i in range(0, len(records), batch):
            chunk = records[i : i + batch]
            self._col.upsert(
                ids=[r["id"] for r in chunk],
                embeddings=self.embed([r["text"] for r in chunk]),
                documents=[r["text"] for r in chunk],
                metadatas=[_flatten(r) for r in chunk],
            )
        return self.count()

    def search(self, query: str, k: int = settings.TOP_K) -> list[dict]:
        res = self._col.query(
            query_embeddings=self.embed([query]),
            n_results=k,
            include=["documents", "metadatas", "distances"],
        )
        out = []
        for doc, meta, dist in zip(
            res["documents"][0], res["metadatas"][0], res["distances"][0]
        ):
            out.append({**meta, "text": doc, "score": 1 - dist})
        return out


def _flatten(r: dict) -> dict:
    m = r.get("metadata", {})
    return {
        "chunk_id": r["id"],
        "type": r["type"],
        "title": r.get("title", ""),
        "source": r.get("source", "") or "",
        "verified": bool(r.get("verified")),
        "subject_id": str(m.get("id", "")),
        "subject_name": str(m.get("name") or m.get("attribution") or ""),
    }


@lru_cache(maxsize=1)
def get_retriever() -> Retriever:
    return Retriever()


def load_corpus(path=None) -> list[dict]:
    path = path or settings.CORPUS_PATH
    with open(path, encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]
