"""Build the vector index from the Phase 1 corpus.

    python ingest.py
"""
import settings
from retrieval import get_retriever, load_corpus


def main():
    records = load_corpus()
    print(f"Loaded {len(records)} records from {settings.CORPUS_PATH}")
    print(f"Embedding with {settings.EMBED_MODEL} → Chroma at {settings.CHROMA_DIR}")
    print("(first run downloads the embedding model — may take a minute)\n")

    total = get_retriever().index(records)
    print(f"✓ Indexed. Collection now holds {total} chunks.")


if __name__ == "__main__":
    main()
