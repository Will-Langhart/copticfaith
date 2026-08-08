# Abba — LangGraph service

Grounded, self-verifying backend for the **Ask a Church Father** widget. A
retrieval-augmented LangGraph pipeline that gates every quotation against a
vetted corpus, deployed on **LangSmith Deployment** (formerly LangGraph Platform).

```
retrieve → synthesize → meta → verify → END
```

- **retrieve** — semantic search over the corpus (Pinecone, integrated inference).
- **synthesize** — streams the pastoral answer (Claude Sonnet), grounded in retrieved sources.
- **meta** — Claude Haiku proposes citations / scripture / follow-ups (structured output).
- **verify** — the anti-hallucination gate: a proposed quote survives only if it
  matches a record in `corpus/verified_quotes.json`; the canonical text + real
  source are attached, unverifiable quotes are dropped.

Embeddings happen server-side in Pinecone, so the service ships no local model —
cold starts stay light on serverless.

## Local development

```bash
cd abba
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # add ANTHROPIC_API_KEY, PINECONE_API_KEY (+ LANGSMITH_API_KEY)

python ingest.py              # creates the Pinecone index + upserts the corpus
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

## Deploy to LangSmith Deployment

1. Push `main` to GitHub.
2. In LangSmith → **Deployments** → New deployment from this repo.
   - **LangGraph API config file:** `abba/langgraph.json`  (it's in a subfolder)
   - Git ref: `main`
3. Set the deployment's env vars: `ANTHROPIC_API_KEY`, `PINECONE_API_KEY`
   (same Pinecone key used by `ingest.py`), `LANGSMITH_API_KEY`, and
   `ENVIRONMENT=production` — dev and prod share one LangSmith project, so
   without it deployment traces are indistinguishable from `langgraph dev` runs.
4. Copy the deployment's API URL → set `LANGGRAPH_API_URL` (+ `LANGGRAPH_API_KEY`)
   in Vercel. That flips the proxy from fallback to the graph.

### Tracing metadata the proxy must supply

The proxy owns the graph invocation, so it owns the root run's metadata. It must
pass `config={"metadata": run_metadata(state, user_id)}` (see `graph.run_metadata`),
which yields `environment`, `journey_stage`, `page_topic`, and `user_id`:

- `user_id` — a stable **anonymous** session id (never an email, name, or other
  real identity), so per-visitor filtering and "one bad session" triage work.
- Capture the run id from the graph run and post the widget's thumbs up/down on
  the existing `done` event:

  ```python
  client.create_feedback(run_id=<run id>, key="user_rating", score=<0 or 1>)
  ```

  Pass `run_id`, not `trace_id` — feedback attached to a trace id does not land
  on the run.

## Regenerating the corpus

Produced from the React app's `src/data/*.js` (writes into `abba/corpus/`):

```bash
cd .. && node scripts/export-corpus.mjs && cd abba && python ingest.py
```

## Growing to multi-agent (Phase 3)

Insert a **supervisor** node before `retrieve` that classifies intent and routes
to specialist nodes (doctrine / saints / scripture / comparative), each filtering
retrieval by chunk `type`. The `State` and streamed channels do not change.
