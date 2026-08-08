"""Create the Pinecone index (integrated inference) and upsert the corpus.

    python ingest.py

Requires PINECONE_API_KEY in .env — the SAME key you set on the LangSmith
deployment, so the graph queries the index this script builds.
"""
import json
import time

from pinecone import Pinecone

import settings


def load_corpus() -> list[dict]:
    with open(settings.CORPUS_PATH, encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


def to_record(r: dict) -> dict:
    """Flatten a corpus chunk into a Pinecone record (scalar fields only).
    `text` is the field the index embeds (see field_map below)."""
    m = r.get("metadata", {})
    return {
        "_id": r["id"],
        "text": r["text"],
        "type": r["type"],
        "title": r.get("title", ""),
        "source": r.get("source", "") or "",
        "verified": bool(r.get("verified")),
        "subject_id": str(m.get("id", "")),
        "subject_name": str(m.get("name") or m.get("attribution") or ""),
    }


def main():
    if not settings.PINECONE_API_KEY:
        raise SystemExit("PINECONE_API_KEY not set — add it to abba/.env")

    pc = Pinecone(api_key=settings.PINECONE_API_KEY)

    if not pc.has_index(settings.PINECONE_INDEX):
        print(f"Creating index '{settings.PINECONE_INDEX}' ({settings.PINECONE_EMBED_MODEL})…")
        pc.create_index_for_model(
            name=settings.PINECONE_INDEX,
            cloud="aws",
            region="us-east-1",
            embed={"model": settings.PINECONE_EMBED_MODEL, "field_map": {"text": "text"}},
        )
    else:
        print(f"Index '{settings.PINECONE_INDEX}' already exists — upserting into it.")

    index = pc.Index(settings.PINECONE_INDEX)
    records = [to_record(r) for r in load_corpus()]
    print(f"Upserting {len(records)} records into namespace '{settings.PINECONE_NAMESPACE}'…")

    BATCH = 90  # integrated upsert_records caps at 96 per call
    for i in range(0, len(records), BATCH):
        index.upsert_records(namespace=settings.PINECONE_NAMESPACE, records=records[i:i + BATCH])
        print(f"  … {min(i + BATCH, len(records))}/{len(records)}")

    time.sleep(5)  # give the index a moment to finish indexing
    stats = index.describe_index_stats()
    print(f"✓ Done. Index vector count: {stats.get('total_vector_count', 'n/a')}")


if __name__ == "__main__":
    main()
