# CopticFaith

> *"Contend earnestly for the faith which was once for all delivered to the saints." — Jude 1:3*

A theological reference site for Coptic Orthodox Christianity, built for Protestant seekers and anyone exploring the ancient faith.

**Live site:** [copticfaith.vercel.app](https://copticfaith.vercel.app)

---

## What's Inside

- **The Seven Holy Mysteries** — deep dives on all seven sacraments with patristic commentary
- **Church Fathers** — 16 Father profiles with biographies, key teachings, and notable quotes
- **Saints Calendar** — Coptic Synaxarium with feast days, saint bios, and Coptic date conversion
- **Daily Readings** — lectionary with live Bible passage fetching
- **Ask a Church Father** — AI widget grounded in Scripture and the Fathers, powered by Claude
- **Church History, Glossary, Scripture Index, FAQ** — reference material for inquirers

---

## Stack

- React 18 + Vite + React Router v6
- react-i18next (English + Arabic)
- Custom CSS with design tokens (no Tailwind)
- Vercel (hosting + serverless functions)
- Anthropic Claude API (Ask a Father widget)

---

## Design Tokens

| Token | Value |
|---|---|
| `--color-bg` | `#0a0e17` (deep navy) |
| `--color-gold` | `#e8aa00` |
| `--color-text` | `#f5f0e6` (cream) |
| `--font-heading` | Cormorant Garamond |
| `--font-body` | DM Sans |

---

## Running Locally

```bash
npm install
npm run dev        # Vite dev server (UI only)
vercel dev         # Full stack including /api routes (requires Vercel CLI)
```

For the AI widget, create `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Project Structure

```
src/
  pages/        # One file per route
  components/   # Shared UI (PageShell, NavOverlay, AskAFather, etc.)
  data/         # Static content: fathers.js, saints.js, lectionary.js
  sections/     # Landing page sections (Section1–Section11)
  router/       # routes.jsx — all route registrations
api/
  ask-father.js # Vercel serverless function — Claude AI widget
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Content contributions (saint data, patristic quotes, lectionary corrections) are especially welcome and require no coding experience.

---

## Ministry

CopticFaith is an independent ministry. All content is offered freely to the Church.
