"""Central config. Reads .env; paths resolve relative to this file's dir."""
import os
from pathlib import Path
from dotenv import load_dotenv

BASE = Path(__file__).resolve().parent
load_dotenv(BASE / ".env")


def _path(env: str, default: str) -> Path:
    p = Path(os.getenv(env, default))
    return p if p.is_absolute() else (BASE / p).resolve()


ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

# Separates local-dev traces from deployment traffic in the shared LangSmith project.
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

SYNTH_MODEL = os.getenv("SYNTH_MODEL", "claude-sonnet-4-5")
META_MODEL = os.getenv("META_MODEL", "claude-haiku-4-5-20251001")

# Pinecone (integrated inference — embeddings happen server-side)
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "coptic-corpus")
PINECONE_NAMESPACE = os.getenv("PINECONE_NAMESPACE", "copticfaith")
PINECONE_EMBED_MODEL = os.getenv("PINECONE_EMBED_MODEL", "multilingual-e5-large")

# Corpus lives inside abba/ so it ships with the deployment build.
CORPUS_PATH = _path("CORPUS_PATH", "corpus/corpus.jsonl")
VERIFIED_QUOTES_PATH = _path("VERIFIED_QUOTES_PATH", "corpus/verified_quotes.json")

TOP_K = int(os.getenv("TOP_K", "6"))
