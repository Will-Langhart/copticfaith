# Saint and Reading of the Day — Reels engine

Builds a daily 35–45 second vertical video (1080×1920, 30fps) for Instagram and Facebook Reels:
the Coptic date, the saint remembered that day, a verse from the day's Gospel, a one-line
reflection, and an end card that sends viewers to copticfaith.

```bash
npm run daily -- --date 2026-11-01            # build everything, dry-run the post
npm run daily -- --date 2026-11-01 --publish  # build and post to IG + FB (needs Meta setup below)
```

`--date` defaults to today. Everything for a day lands in `out/<date>/` (gitignored):

| File | What |
|---|---|
| `copticfaith-<date>.mp4` | The Reel |
| `caption.txt` | Post caption: saint, reading reference, link, hashtags |
| `script.json` | Narration, segments, chosen verse |
| `timings.json` | ElevenLabs word timings |
| `credits.json` | Source and licence of every asset in the video |
| `props.json` | The Remotion input props |
| `public/` | `narration.mp3` and the page screenshots |

## Setup

```bash
cd services/video
npm install
npx playwright install chromium
cp .env.example .env   # then fill it in
```

Node 22 or later. The first render downloads Remotion's headless Chrome (~170 MB).

This folder is self-contained, with its own `package.json` and `node_modules`. The site's build doesn't touch it.
The root ESLint config ignores `services/`, and `.vercelignore` keeps it out of deploys. The site has no
`tsconfig`, and Vite only bundles what `index.html` imports. The engine *reads* the site's data
(`src/data/*.js`) so the video always matches the site, but never writes to it.

## Pipeline

| Step | Module | Source |
|---|---|---|
| 1. Coptic date, feast, fast | `src/steps/date.mjs` | the site's `gregorianToCoptic`, `getReadingsForDay`, `getFast` |
| 2. Saint and Gospel | `src/steps/content.mjs` | `src/data/saints.js`, `src/data/lectionary.js`; Gospel text from bible-api.com (WEB) |
| 3. Script | `src/steps/script.mjs` | Claude (`claude-opus-5-5`, override with `ANTHROPIC_MODEL`) |
| 4. Voice | `src/steps/voice.mjs` | ElevenLabs `/text-to-speech/{voice}/with-timestamps` |
| 5. Screenshots | `src/steps/shots.mjs` | Playwright on `SITE_URL` (default `https://copticfaith.app`) |
| 6. Video | `src/steps/render.mjs`, `remotion/` | Remotion |
| 7. Caption | `src/steps/caption.mjs` | |
| 8. Post | `src/steps/publish.mjs` | Meta Graph API, dry run unless `--publish` |

**Script.** Claude writes the opening, the saint lines, the verse lead-in and the reflection as
structured JSON. It is told to use only the facts in the saint's record from `saints.js`. It also
picks one to three verses by number. The verse text is never written by the model. The engine
copies the exact World English Bible text from the passage, so what is read and shown is always
public-domain scripture. The closing line is always "Read more on copticfaith." The engine
retries if the narration falls outside 88–115 words (~35–45s spoken). After the voice step it
warns if the audio runs outside 33–47 seconds.

**Video.** The video is as long as the narration plus a 1.5s hold on the end card. Each scene
starts when its part of the narration starts:

1. The Coptic date and the feast title
2. The saint over their icon, or over the copticfaith page screenshot
3. The verse on screen, each word lighting up as it is read
4. The reflection over today's readings page
5. The copticfaith end card

Captions show the spoken word in gold. The colours and fonts (Cormorant Garamond, DM Sans) match
the site's design tokens. To preview a rendered day in Remotion Studio:

```bash
npx remotion studio remotion/index.jsx --public-dir out/2026-11-01/public --props out/2026-11-01/props.json
```

**Screenshots.** Playwright pins the browser clock to the requested date, so the site's "today"
views show that day. It captures the saint (a `/fathers/:id` profile if the saint has one, else
`/saints-calendar` with the saint opened), `/daily-readings` with the Gospel open, and the home
page for the end card. The floating chat button is hidden.

## Data sources and permissions

| What | Source | Licence / terms |
|---|---|---|
| Coptic date, feasts, fasts | This repo (`src/data/saints.js`, `fasts.js`, `pascha.js`) | Ours |
| Synaxarium | This repo (`src/data/saints.js`) | Ours |
| Gospel reference | This repo (`src/data/lectionary.js`) | Ours |
| Gospel text | [bible-api.com](https://bible-api.com), `translation=web` | The World English Bible is public domain. The site already uses this service. Its terms (checked 2026-11-01) allow free use with a limit of 15 requests per 30 seconds. We make one request a day. |
| Page screenshots, logo | copticfaith | Ours |
| Icon art | `assets/icons/` (see below) | Public domain or our own only |
| Fonts | Google Fonts | SIL Open Font License |

No outside Synaxarium or Katameros source is used. **Known gaps in the repo's data, which the video
inherits:**

- `saints.js` is a curated list of about 55 saints, not the full Synaxarium. On a day with no
  saint, the video falls back to the day's feast, or the reading's theme, and names no saint.
- `lectionary.js` has the true readings for the fixed and moveable feasts. Every other day uses
  the site's weekly cycle (for example, Sunday is John 20:1-18). That is what `/daily-readings`
  shows, but it is not the full Katameros.

Adding a full Synaxarium or Katameros source needs a source whose licence allows reuse. Check this
before wiring one in.

## Icon art

Put icon files in `assets/icons/` and register each one in `assets/icons/credits.json`, keyed by the
saint's `id` in `saints.js`:

```json
{
  "luke-apostle": {
    "file": "luke-apostle.jpg",
    "title": "Saint Luke (icon), 16th century",
    "author": "Unknown iconographer",
    "source": "https://commons.wikimedia.org/wiki/File:…",
    "license": "public-domain"
  }
}
```

Only the licences `public-domain`, `cc0` and `own-work` are used. Anything else is skipped with a
warning, and the saint scene falls back to the page screenshot. Every asset that makes it into a
video is written to that day's `credits.json`. The Father portraits in `src/data/fathers.js` link to
Wikimedia Commons. Check each file's own Commons page before adding one here.

## Meta setup (Instagram + Facebook Reels)

Posting goes only through the official Graph API, never through a browser. Without `--publish` the
publisher only prints the requests it would make.

1. **Accounts.** The Instagram account must be a Professional account (Business or Creator) and
   linked to the copticfaith Facebook Page (Page settings → Linked accounts).
2. **App.** At [developers.facebook.com](https://developers.facebook.com), create a Business-type
   app. Add **Instagram** (Instagram API with Facebook Login) and **Facebook Login for Business**.
3. **Permissions.** `instagram_basic`, `instagram_content_publish`, `pages_show_list`,
   `pages_read_engagement`, `pages_manage_posts` (add `business_management` if the Page lives in a
   Business portfolio). In development mode the app can post to accounts whose admins have a role on
   the app. You need App Review only to post for other people.
4. **Token.** For a token that doesn't expire, create a **System User** in Business Settings, give
   it the Page and the Instagram account, and generate a token with the permissions above.
   Alternatively, use the Graph API Explorer:
   1. Get a user token with the permissions above.
   2. Exchange it for a long-lived token: `GET /oauth/access_token?grant_type=fb_exchange_token&client_id=…&client_secret=…&fb_exchange_token=…`.
   3. Call `GET /me/accounts`. The Page `access_token` it returns does not expire.

   Put the token in `META_ACCESS_TOKEN`.
5. **IDs.** `META_PAGE_ID` is the Page `id` from `/me/accounts`. `META_IG_USER_ID` is
   `instagram_business_account.id` from `GET /{page-id}?fields=instagram_business_account`.
6. **Check.** Run without `--publish` and read the dry-run output, then post one day with
   `--publish`.

The publisher uploads the mp4 directly, so no public video URL is needed:

- **Instagram:** `POST /{ig-user-id}/media` (`media_type=REELS`, `upload_type=resumable`), upload
  the bytes to `rupload.facebook.com/ig-api-upload/…`, wait for `status_code=FINISHED`, then
  `POST /{ig-user-id}/media_publish`.
- **Facebook:** `POST /{page-id}/video_reels` with `upload_phase=start`, upload the bytes to the
  returned `upload_url`, then `upload_phase=finish` with `video_state=PUBLISHED`.

The Graph API version defaults to `v23.0`. Set `META_GRAPH_VERSION` to move it.

There is no scheduler yet. Run the command by hand or from your own cron.

## Licensing notes

- **Remotion** is free for individuals and companies of up to three people. Larger organisations
  need a [company licence](https://www.remotion.dev/license).
- **ElevenLabs** voices need a paid plan for commercial use. Check the voice's own terms if it is a
  shared library voice.

## Tests

```bash
npm test
```

Tests cover the Coptic date and year, character-to-word timing, verse assembly (the text must come
from the passage) and caption chunking.
