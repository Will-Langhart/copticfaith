# SPEC — RAG prompt & retrieval enhancements (`abba`)

**STATUS: all 5 implemented (2026-08-11).** Pure logic (dedup keying, context/quote formatting)
unit-tested; full graph not run locally (deps live on the deployment). Verification plan below is
for post-deploy smoke testing.

Working reference for a 5-change enhancement pass on the `abba` LangGraph pipeline.
Scope is deliberately small: prompt construction + retrieval shaping only. No new
nodes, no state-shape changes, no frontend/proxy changes.

## Pipeline recap (unchanged by this work)

`retrieve → synthesize → meta → verify → END` ([graph.py](graph.py))

- **retrieve** — Pinecone integrated inference, rerank `pinecone-rerank-v0`, `TOP_K=6`
  from `RERANK_CANDIDATES=24`. ([retrieval.py](retrieval.py))
- **synthesize** — Sonnet 4.5 writes pastoral prose from `SYNTH_SYSTEM` + sources. Streams tokens.
- **meta** — Haiku, structured output (`MetaOut`): citations + scripture + 2 followups.
- **verify** — fuzzy-matches proposed quotes against `corpus/verified_quotes.json` (69 quotes),
  swaps in canonical text, emits final `meta` payload on the custom channel.

### Ground truth confirmed
- Every retrieved hit already carries `verified: bool` and `score: float`
  ([retrieval.py:37,41](retrieval.py)) — both currently discarded by `_context_block`.
- `verified:true` ⇔ the 69 quote chunks (16 `father_quote` + 53 `saint_quote`). Reliable signal.
- Rerank returns hits **sorted best-first**; `verify` resolves any canonical quote text to full
  metadata, so meta echoing retrieved verified text will pass the gate trivially.

---

## Change 1 — Richer `_context_block`: numbering + verified tag + relevance
**Goal:** grounding + citation yield. **File:** [graph.py](graph.py) `_context_block`, `SYNTH_SYSTEM`.

Emit a numbered, signal-bearing header per source. Sources are already best-first; say so in the prompt.

Line format (per source):
```
[S{n}] {subject_name or title} ({type}{, VERIFIED QUOTE if verified}, relevance {score:.2f}){ — source} :
{text}
```
`SYNTH_SYSTEM` gains one line: sources are ordered most-relevant first; lean on the earliest,
highest-relevance ones and on any marked VERIFIED QUOTE.

**Non-goal:** do not ask synth to print `[S1]` markers in prose — the answer stays clean prose;
numbering is for the model's internal grounding + for meta reuse.

## Change 2 — Point `meta` at verified quotes already retrieved
**Goal:** fix the dead "Fathers Speak" card. **File:** [graph.py](graph.py) `meta`, `META_SYSTEM`.

In `meta`, build a dedicated block from the retrieved hits where `verified` is true:
```
QUOTES YOU MAY CITE (verbatim — copy the text exactly):
[Q1] {name} — {source}: "{text}"
...
```
`META_SYSTEM` / user message instruct: cite only from this list, copy text verbatim, pick the
1–3 most relevant to the answer; empty list ⇒ empty citations. Scripture + followups unchanged.

**Verify-side safety net (part of this change):** if `meta` proposes zero citations but the
retrieved set contains ≥1 verified quote, `verify` falls back to surfacing the single top-ranked
retrieved verified quote. Toggle: `CITATION_FALLBACK` (default on). Closes the memory follow-up.

**Interaction note:** because meta now echoes canonical corpus text, the existing 0.6 fuzzy gate in
`_match_verified_quote` passes by substring — no threshold change needed.

## Change 3 — Relevance floor (anti-hallucination on off-topic queries)
**Goal:** stop "Prefer sources over general knowledge" from forcing use of junk hits.
**File:** [graph.py](graph.py) `synthesize`; [settings.py](settings.py).

Compute in code (not model-eyeballed). In `synthesize`, if `retrieved` is empty **or** the top hit's
`score < RELEVANCE_FLOOR`, append a directive to the user message:
> The sources below only weakly match this question. Answer briefly from what is genuinely
> relevant; if the Fathers' sources here don't directly address it, say so plainly rather than
> inventing specifics.

New setting `RELEVANCE_FLOOR` (default `0.15`, **tune after observing real rerank scores** — the
`pinecone-rerank-v0` scale is not yet calibrated for this corpus).

## Change 4 — Dedup retrieval by `(subject_id, type)`
**Goal:** answer breadth. **File:** [retrieval.py](retrieval.py) `search`.

Rerank to the full candidate set (`top_n = RERANK_CANDIDATES`), then in Python walk hits in order
keeping the first per `(subject_id, type)` key; hits with empty `subject_id` (glossary, scripture)
never dedup; slice to `TOP_K`.

**Why `(subject_id, type)` not `subject_id`:** a plain subject dedup would drop a Father's verified
quote when his bio outranks it — starving Change 2. Keying on type preserves bio + quote + teaching
of one Father while collapsing redundant same-type chunks (e.g. 3 `father_work` of one subject).

## Change 5 — Reconcile hardcoded audience with `journey_stage`
**Goal:** tone consistency. **File:** [graph.py](graph.py) `SYNTH_SYSTEM`.

`SYNTH_SYSTEM` currently hardcodes "seekers and Protestants," fighting `STAGE_TONES`. Make the system
line audience-neutral ("guiding visitors, from the merely curious to those preparing to enter the
Church") and let `STAGE_TONES` specialize per stage. Default tone when `journey_stage` absent.

---

## Config additions ([settings.py](settings.py))
| name | default | note |
|---|---|---|
| `RELEVANCE_FLOOR` | `0.15` | Change 3; tune to real scores |
| `CITATION_FALLBACK` | `true` | Change 2 safety net |

(`RERANK_CANDIDATES`, `TOP_K` reused as-is.)

## Verification plan
1. `athanasius` / incarnation query → answer cites a verified Athanasius quote (card fires).
2. Deliberately off-topic query (e.g. "how do I file taxes") → floor triggers, answer declines
   gracefully, no fabricated Fathers.
3. Query that retrieves multiple chunks of one Father → answer draws on ≥2 distinct subjects/types.
4. Confirm prose stays Markdown-free and no `[S1]` markers leak into the answer.
5. `meta` never proposes a quote absent from the retrieved verified list.

## Open questions
- `RELEVANCE_FLOOR` value — needs a quick pass over real rerank scores before trusting `0.15`.
- Should scripture refs also be validated against retrieved `scripture`-type chunks? (Out of scope
  for this pass; noted for later.)
