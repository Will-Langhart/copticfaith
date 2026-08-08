# Abba — LangGraph service

Grounded, self-verifying backend for the **Ask a Church Father** widget. A
retrieval-augmented LangGraph pipeline that gates every quotation against a
vetted corpus, deployed on **LangGraph Platform**.

```
retrieve → synthesize → meta → verify → END
```

- **retrieve** — semantic search over the corpus (Chroma + fastembed).
- **synthesize** — streams the pastoral answer (Claude Sonnet), grounded in retrieved sources.
- **meta** — Claude Haiku proposes citations / scripture / follow-ups (structured output).
- **verify** — the anti-hallucination gate: a proposed quote survives only if it
  matches a record in `corpus/verified_quotes.json`; the canonical text + real
  source are attached, unverifiable quotes are dropped.

## Local development

```bash
cd abba
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # add ANTHROPIC_API_KEY (+ LANGSMITH_API_KEY for tracing)

python ingest.py              # embed corpus.jsonl → Chroma
langgraph dev                 # runs the graph locally + opens LangGraph Studio
```

`langgraph dev` serves the LangGraph Server API on `http://localhost:2024` and
opens Studio, where you can watch each node (and the verifier's decisions) run.

## Streaming contract

The graph streams on two native channels; the Vercel proxy adapts them to the
SSE shape `AskAFather.jsx` consumes:

| LangGraph stream | Proxy emits |
|---|---|
| `messages` where `langgraph_node == "synthesize"` | `{type:"delta", text}` |
| `custom` `{kind:"status"}` | `{type:"status", text}` |
| `custom` `{kind:"meta", ...}` | `{type:"meta", citations, scripture, suggestedFollowUps}` |
| run end | `{type:"done"}` |

Invoke input: `{ question, page_context?, journey_stage? }`.

## Deploy to LangGraph Platform

1. Push this repo to GitHub.
2. In LangSmith → LangGraph Platform, create a deployment from this repo
   (root directory: `abba`, config: `langgraph.json`).
3. Set env vars there: `ANTHROPIC_API_KEY`, `LANGSMITH_API_KEY`.
4. Point the Vercel proxy at the deployment's URL.

**Production caveat — vector store.** Local Chroma-on-disk is for dev only. Before
a managed cloud deployment, swap `retrieval.py` to a hosted store (Chroma Cloud /
Pinecone / pgvector) and run `ingest.py` against it once. The retrieval interface
is isolated so only `retrieval.py` changes.

## Regenerating the corpus

Produced from the React app's `src/data/*.js`:

```bash
cd .. && node scripts/export-corpus.mjs && cd abba && python ingest.py
```

## Growing to multi-agent (Phase 3)

Insert a **supervisor** node before `retrieve` that classifies intent and routes
to specialist nodes (doctrine / saints / scripture / comparative), each filtering
retrieval by chunk `type`. The `State` and streamed channels do not change.
