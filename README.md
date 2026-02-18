# The Ancient Faith — Coptic Orthodoxy

A dark, elegant, gold-accented React web app presenting the biblical and historical case for Coptic Orthodoxy. Built for Protestant readers, drawing on Scripture, Protestant scholarship, and primary historical sources.

## Design

- **Colors:** Deep navy background, cream text, warm gold accents
- **Typography:** Cormorant Garamond (headings/Scripture), DM Sans (body)
- **Features:** Fixed header with blur on scroll, fullscreen nav overlay, side dot navigation (desktop), Scripture blocks (gold borders), Father quotes (blue borders), Protestant source notes
- **Responsive:** Mobile-first with `clamp()` typography

## Development

```bash
npm install
npm run dev
```

## Build & Deploy (Vercel)

```bash
npm run build
```

Deploy to Vercel by connecting this repo; the default Vite build outputs to `dist/`, which Vercel will serve.

## Structure

- `src/App.jsx` — Main layout, scroll logic, navigation
- `src/components/` — Header, NavOverlay, SideDots
- `src/sections/` — Section content (Section1–Section11)
