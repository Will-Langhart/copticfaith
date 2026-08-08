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

SYNTH_MODEL = os.getenv("SYNTH_MODEL", "claude-sonnet-4-5")
META_MODEL = os.getenv("META_MODEL", "claude-haiku-4-5-20251001")
EMBED_MODEL = os.getenv("EMBED_MODEL", "BAAI/bge-small-en-v1.5")

CHROMA_DIR = _path("CHROMA_DIR", ".chroma")
CORPUS_PATH = _path("CORPUS_PATH", "../corpus/corpus.jsonl")
VERIFIED_QUOTES_PATH = _path("VERIFIED_QUOTES_PATH", "../corpus/verified_quotes.json")

COLLECTION = "coptic_corpus"
TOP_K = int(os.getenv("TOP_K", "6"))
