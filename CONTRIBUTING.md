# Contributing to CopticFaith

Glory to God. Thank you for contributing to this ministry.

CopticFaith is an open resource for anyone exploring Coptic Orthodox Christianity — built for seekers, inquirers, and the faithful. Every contribution should serve that mission.

---

## Getting Started

```bash
git clone https://github.com/Will-Langhart/copticfaith.git
cd copticfaith
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

---

## Project Structure

```
src/
  pages/        # One file per route (SaintsCalendarPage.jsx, etc.)
  components/   # Shared UI components
  data/         # Static content: fathers.js, saints.js, lectionary.js
  sections/     # Landing page sections (Section1–Section11)
  router/       # routes.jsx — all route registrations
api/
  ask-father.js # Vercel serverless function — Claude AI widget
```

**Key conventions:**
- Pages live in `src/pages/`, routes registered in `src/router/routes.jsx`
- New nav links must be added to both `NavOverlay.jsx` and `PageShell.jsx`
- CSS uses design tokens — use `var(--color-gold)`, `var(--color-bg)`, `var(--font-heading)`, etc. Do not hardcode colors
- No Tailwind classes — all styling is custom CSS with tokens

---

## Environment Variables

The AI widget requires an Anthropic API key. Create a `.env.local` file (never committed):

```
ANTHROPIC_API_KEY=sk-ant-...
```

For the widget to work locally you'll need to run the Vercel dev server instead of Vite:

```bash
npm i -g vercel
vercel dev
```

---

## Ways to Contribute

### Content (highest need)
- **Expand saint data** — `src/data/saints.js` has 50+ saints. Adding biography, quotes, and feast day info for more saints is valuable and requires no coding
- **Patristic quotes** — accurate, sourced quotes from the Church Fathers with work/chapter citations
- **Lectionary corrections** — if a feast day reading is wrong, please fix it in `src/data/lectionary.js`
- **Translations** — the site supports i18n via `react-i18next`. Arabic translations especially welcome (`src/locales/ar/`)

### Code
- Bug fixes are always welcome — open an issue first for anything non-trivial
- New features: open an issue to discuss before building, so effort isn't wasted
- Follow the existing code style — match the patterns in neighboring files

### Theology
- If a doctrinal statement is inaccurate or uncharitable, please open an issue with a correction and a source
- All theological content should be grounded in Scripture and the Church Fathers, not personal opinion

---

## Pull Request Guidelines

1. **One concern per PR** — don't mix content fixes with code changes
2. **Test locally** before submitting — run `npm run build` and confirm it passes
3. **Cite your sources** — for any content additions, include the source in the PR description (e.g., "From *On the Incarnation*, ch. 54, NPNF translation")
4. **No secrets** — never commit `.env` files or API keys

---

## Theological Standards

This site represents the Coptic Orthodox tradition. Contributions should:
- Be grounded in Holy Scripture and the writings of the Church Fathers
- Reflect the teaching of the Coptic Orthodox Church
- Be charitable toward other Christian traditions, especially Protestant readers (our primary audience)
- Never fabricate or paraphrase quotes and present them as direct citations

When in doubt, consult the [Coptic Orthodox Diocese of the Southern USA](https://suscopts.org) or a trusted priest.

---

## License

This project is open source. Content contributions become part of this ministry and are offered freely to the Church.

---

*"Contend earnestly for the faith which was once for all delivered to the saints." — Jude 1:3*
