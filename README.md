# Al Nojoom Club

Marketing website for **Al Nojoom Club**, the aesthetic membership programme of Everlast Wellness Medical Center in Al Bateen, Abu Dhabi. The site presents the membership, documents the treatment tracks for women and men, surfaces live membership pricing from the clinic's WooCommerce store, and delivers contact enquiries to the clinic inbox over SMTP.

It is a React single-page application served by a small, dependency-light Node HTTP server. The server exists for exactly two reasons: it exposes cached membership pricing, and it processes contact-form submissions (validation, bot verification, and mail delivery). No SMTP credential or secret key is ever reachable from the browser bundle.

**Production:** <https://alnojoomclub.com/>

## Status

| Item | Value |
|---|---|
| Repository | [joeka7/Alnojoom-Club](https://github.com/joeka7/Alnojoom-Club) |
| Production URL | <https://alnojoomclub.com/> |
| Frontend | React 18.3.1 · React Router 7.18.0 · Vite 6.4.3 |
| Backend | Node built-in `node:http` — no web framework |
| Language | JavaScript (ESM). No TypeScript |
| Styling | Hand-written CSS with `:root` custom-property tokens. No framework or preprocessor |
| Tests | None configured |
| Lint / typecheck | None configured — `npm run build` is the correctness gate |
| Internationalization | None. English only (`<html lang="en">`), LTR only |
| Minimum runtime | Node.js 20.6+ (verified against Node 24.11.0) |

---

## Overview

The application is split into two independent halves that share one origin in production.

**Frontend** (`src/`) — A Vite-built React SPA. Six routes, client-side routed. Content is authored as plain data objects inside page files rather than fetched from a CMS, so every page except the price figures renders without any network dependency. The two service track pages (`/services/for-women`, `/services/for-men`) share a single layout component and differ only in their data.

**Backend** (`server/`) — A single `node:http` server, roughly 200 lines, with `nodemailer` as its only runtime dependency. It answers three API routes, serves the built `dist/` directory in production, and falls back to `index.html` so client-side routes resolve on a hard refresh.

The two halves never import from each other. `server/` has no build step and is never bundled; that boundary is what guarantees SMTP credentials and the Turnstile secret cannot leak into the client.

### Request flows

**Membership price (read path)**

```
Server boot ──> priceService.start()
                  └─> GET https://everlastwellness.store/product/alnojoom-club/
                        └─> parse WooCommerce `data-product_variations` JSON
                              └─> in-memory cache { man, woman }
                        (re-runs every 7 days; a failed fetch leaves the cache untouched)

Browser ──> GET /api/product-price ──> getPrice() ──> { man, woman }
              └─> useMembershipPrice() ──> Home / Services / TrackPage price blocks
```

The price is scraped rather than configured, so a price change in the store propagates without a redeploy. Both parse strategies are tried in order: the per-variation JSON first (which yields distinct `man` / `woman` prices), then the single visible `<p class="price">` amount as a fallback applied to both keys. On any failure — network error, markup change, unparseable price — the previous cache is retained and the failure is logged; the endpoint never regresses to `null` once warm.

**Contact enquiry (write path)**

```
Contact form ──> Turnstile widget ──> token
                                        │
Browser ──> POST /api/contact { fields..., turnstileToken, company }
              │
              ├─ 1. config gate      SMTP + Turnstile configured?         ──> 503
              ├─ 2. body read        streamed, capped at 16 KB            ──> 413 / 400
              ├─ 3. honeypot         `company` filled?                    ──> 200 (silently dropped)
              ├─ 4. rate limit       5 per IP per 10 min, in memory       ──> 429
              ├─ 5. Turnstile        token exchanged with Cloudflare       ──> 403
              ├─ 6. validation       required fields, formats, length caps ──> 400
              └─ 7. delivery         nodemailer, 2 retries on transient    ──> 502
                                        └─> clinic inbox                   ──> 200
```

Verification runs **before** validation deliberately: the token check is the cheapest way to separate a bot from a person, so a bot's payload costs as little as possible.

---

## Features

**Content and navigation**

- Six client-side routes with a shared nav and footer, a desktop dropdown for the Services tracks, and a portalled full-screen mobile menu.
- `ScrollToTop` resets scroll on every route change; `ScrollToHash` resolves `#anchor` targets after a client-side navigation (which the browser does not do on its own), retrying for up to ~1s while images above the target settle.
- Footer deep links point into specific treatment cards (`/services/for-men#beard-trimming`). Anchor ids are derived from treatment names by the same `treatmentId()` function that renders them, so the links cannot silently drift.

**Live pricing**

- Per-gender membership prices scraped from the WooCommerce product page and cached in memory, refreshed weekly.
- Rendered in four places: the Home membership tab block, the Services closing CTA, and both the hero and closing CTA of each track page.
- Price blocks are hidden entirely on error, so the site never displays a placeholder or broken amount.

**Contact form**

- Server-side validation, per-IP rate limiting, a hidden honeypot field, and Cloudflare Turnstile verification enforced on the server.
- Searchable country picker covering 222 countries with flag SVGs and E.164 dial codes; matches on country name, ISO code, or dial code, and ranks exact matches first. Full keyboard support (arrows, Home/End, Enter, Escape) and ARIA combobox roles, since it replaces a native `<select>`.
- Geo-IP country detection preselects the visitor's flag, dial code, and a matching example number, cached in `sessionStorage` for the session. A detected value never overwrites a choice the user has already made.
- Table-based HTML enquiry email with a plain-text alternative, an inline CID logo, and Outlook Classic / dark-mode hardening.

**Motion and presentation**

- WebGL shader background on the Home hero (`three` + `@react-three/fiber`), recoloured to the brand wine over a transparent canvas.
- Scroll-reveal (`useReveal`, `IntersectionObserver` with per-element `data-delay` stagger) and a scroll-driven parallax effect (`useParallax`).
- Every motion feature checks `prefers-reduced-motion`, including the WebGL canvas, which switches to an on-demand frameloop.

---

## Tech Stack

| Layer | Package | Version |
|---|---|---|
| UI | `react`, `react-dom` | 18.3.1 |
| Routing | `react-router-dom` | 7.18.0 |
| Build tool | `vite` | 6.4.3 |
| React plugin | `@vitejs/plugin-react` | 4.7.0 |
| WebGL | `three` | 0.185.1 |
| React renderer for three.js | `@react-three/fiber` | 8.18.0 |
| Mail | `nodemailer` | 9.0.6 |
| Flag SVG source | `flag-icons` | 7.5.0 |
| Dev process runner | `concurrently` | 10.0.3 |

**Not used, deliberately or by omission:** no CSS framework or preprocessor, no state-management library, no HTTP client library (native `fetch` throughout), no web framework on the server, no TypeScript, no test runner, no linter, no `dotenv` (the server uses Node's built-in `process.loadEnvFile()`).

`flag-icons` is installed for its SVG source files only — its stylesheet is **never imported**. See [Maintenance Notes](#maintenance-notes).

---

## Architecture

### Server (`server/`)

| File | Responsibility |
|---|---|
| `index.js` | `node:http` server. Loads `.env`, routes the three API paths, serves `dist/` static files with an explicit MIME map, applies the SPA fallback, and verifies SMTP credentials at boot |
| `priceService.js` | Fetches and parses the WooCommerce product page; owns the in-memory price cache and its 7-day refresh timer |
| `contactService.js` | `POST /api/contact` pipeline: body reading with a size cap, honeypot, rate limiting, Turnstile call, field validation, delivery hand-off |
| `turnstile.js` | Exchanges a Turnstile token with Cloudflare's `siteverify` endpoint using the secret key. Fails closed |
| `mailer.js` | Nodemailer transport (lazy, pooled), the HTML/plain-text enquiry template, header sanitisation, and transient-failure retries |
| `assets/logo-light.png` | White logo variant embedded in the enquiry email as an inline CID attachment |

Two structural conventions matter when editing this directory:

1. **Configuration is read inside functions, never into module-level constants.** ES imports are evaluated before the importing module's body runs, so `index.js` calls `loadEnvFile()` *after* every import has already been evaluated. A constant such as `const secret = process.env.TURNSTILE_SECRET_KEY` at module scope in `server/` is always empty. Both `turnstile.js` and `mailer.js` document this trap in place; it has previously caused Turnstile to run unconfigured and the rate limit to ignore its setting.
2. **State is per-process and in-memory.** The price cache and the rate-limit map both reset on restart and are not shared between instances. This is a deliberate single-instance floor, not a complete solution — a multi-instance deployment needs a real limiter at the proxy.

### Frontend (`src/`)

| Directory | Contents |
|---|---|
| `pages/` | One component per route, each with its colocated `.css`. Page content lives here as plain data arrays |
| `components/layout/` | `Nav`, `Footer` |
| `components/ui/` | `CountryPicker`, `Turnstile`, `Eyebrow`, `icons` (a single module exporting the whole icon and editorial-symbol set) |
| `components/sections/` | `TrackPage` (shared track layout), `FeaturedServices` (rendered on both Home and About), `PaperShaderBackground` (WebGL hero) |
| `components/routing/` | `ScrollToTop`, `ScrollToHash` — both render `null` and exist for their effects |
| `hooks/` | `useMembershipPrice`, `useVisitorCountry`, `useReveal`, `useParallax` |
| `data/countries.js` | 222 generated country rows. **Generated file — do not hand-edit** |
| `styles/globals.css` | Font imports, reset, `:root` design tokens, reveal transitions, shared keyframes, reduced-motion overrides |
| `assets/` | 30 images imported by components, hashed at build |

`ForWomen.jsx` and `ForMen.jsx` contain **no markup**. Each exports a data object — hero copy, treatment list, highlight block, benefit cards, steps, closing CTA — and renders `<TrackPage track={DATA} />`. Adding a third track means adding a data object, not duplicating a layout.

`FeaturedServices` is rendered on both Home and About with one set of markup but two entirely separate sets of class names, built from `block` / `grid` / `panel` props, so restyling one page's instance cannot affect the other's.

### Legacy directories

`src/components/Nav.jsx`, `src/components/Footer.jsx`, `src/components/Eyebrow.jsx`, `src/css/`, and `src/imgs/` are **unreferenced by the application**. `App.jsx` imports only the `layout/`, `ui/`, `sections/`, and `routing/` components, and the only stylesheet reached from `main.jsx` is `styles/globals.css` plus the CSS colocated with live components. These files remain in the tree from an earlier structure and are excluded from the build by virtue of never being imported. Treat the `layout/` / `ui/` / `sections/` versions as canonical.

---

## Project Structure

```
.
├── index.html                    Vite entry — meta description, favicons, manifest, theme-color
├── vite.config.js                Dev server port (5173) and the /api proxy
├── package.json
│
├── public/                       Copied verbatim to dist/ — fixed URLs only
│   ├── flags/                    222 country flag SVGs (generated)
│   ├── favicon-16.png … favicon-512.png
│   └── site.webmanifest
│
├── scripts/                      Maintenance tooling, not part of the bundle
│   ├── sync-flags.py             Regenerates src/data/countries.js + public/flags/
│   └── test-email.mjs            Verifies SMTP credentials and sends a test enquiry
│
├── server/                       Node backend — never imported by src/
│   ├── index.js                  HTTP server, API routes, static + SPA fallback
│   ├── priceService.js           WooCommerce price scrape and in-memory cache
│   ├── contactService.js         POST /api/contact pipeline
│   ├── turnstile.js              Cloudflare siteverify exchange
│   ├── mailer.js                 SMTP transport and enquiry email template
│   └── assets/logo-light.png     Email-only asset (inline CID attachment)
│
└── src/
    ├── main.jsx                  React root, imports styles/globals.css
    ├── App.jsx                   BrowserRouter, routes, Nav/Footer layout
    ├── pages/
    │   ├── Home.jsx / Home.css
    │   ├── About.jsx / About.css / AboutBanner.css / AboutServices.css
    │   ├── Services.jsx / Services.css
    │   ├── ForWomen.jsx          Data object → <TrackPage>
    │   ├── ForMen.jsx            Data object → <TrackPage>
    │   └── Contact.jsx / Contact.css
    ├── components/
    │   ├── layout/               Nav.jsx+css, Footer.jsx+css
    │   ├── ui/                   CountryPicker.jsx, Turnstile.jsx, Eyebrow.jsx+css, icons.jsx
    │   ├── sections/             TrackPage.jsx+css, FeaturedServices.jsx+css,
    │   │                         PaperShaderBackground.jsx
    │   └── routing/              ScrollToTop.jsx, ScrollToHash.jsx
    ├── hooks/
    │   ├── useMembershipPrice.js Fetches /api/product-price; exports formatPrice()
    │   ├── useVisitorCountry.js  Geo-IP country resolution with sessionStorage cache
    │   ├── useReveal.js          IntersectionObserver scroll-reveal
    │   └── useParallax.js        Scroll-driven translateY on [data-parallax]
    ├── data/countries.js         GENERATED — edit scripts/sync-flags.py instead
    ├── styles/globals.css        Design tokens, reset, shared animations
    ├── assets/                   30 images, imported and hashed at build
    │
    ├── components/Nav.jsx        ┐
    ├── components/Footer.jsx     │ Legacy — unreferenced by the application
    ├── components/Eyebrow.jsx    │ (see Architecture › Legacy directories)
    ├── css/                      │
    └── imgs/                     ┘
```

### Where to make a change

| Task | Location |
|---|---|
| Page copy or content | `src/pages/<Page>.jsx` — content is data arrays at the top of the file |
| A page's styling | `src/pages/<Page>.css` |
| Colours, type scale, spacing, radii, shadows, motion | `src/styles/globals.css` (`:root`) |
| A component's styling | The `.css` beside that component |
| Add or change a route | `src/App.jsx` |
| Add a treatment | The treatment array in `Services.jsx`, `ForWomen.jsx`, or `ForMen.jsx` |
| Add a service track page | New data object + `<TrackPage>`; do not duplicate markup |
| Add an image | `src/assets/`, then `import` it so Vite hashes it |
| Contact form UI | `src/pages/Contact.jsx` |
| Contact form server rules | `server/contactService.js` |
| Enquiry email design | `server/mailer.js` |
| Country list or flags | `scripts/sync-flags.py`, then `npm run flags:sync` |

---

## Routes

| Route | Component | Contents |
|---|---|---|
| `/` | `Home.jsx` | WebGL shader hero, "why membership" cards, clinic snapshot, membership tabs with live per-track pricing, masonry gallery, testimonials, trust band, closing CTA |
| `/about-us` | `About.jsx` | Banner, clinic story, stats band, advantages, `FeaturedServices`, mobile-app promo, closing CTA |
| `/about` | `About.jsx` | Same component — kept mounted for existing inbound and nav links |
| `/services` | `Services.jsx` | Three signature-service sections (Skin Booster, Lip Enhancement, Upper Face Neurotoxin), a beard-trimming section, what's-included grid, CTA with live pricing |
| `/services/for-women` | `ForWomen.jsx` → `TrackPage` | Hero with `woman` pricing, three treatments, highlight, benefit cards, steps, CTA |
| `/services/for-men` | `ForMen.jsx` → `TrackPage` | Hero with `man` pricing, three treatments, highlight, benefit cards, steps, CTA |

`/about-us` is the canonical About path — it is what the footer links to. `/about` renders the same component so the nav's existing links and any external inbound links keep working; the nav's active-state logic matches both via `startsWith('/about')`.

Unmatched paths render the Nav and Footer with no page content (no dedicated 404 route is defined). At the server level, any unmatched non-`/api` path falls back to `index.html` so the router can take over.

---

## Internationalization

**Not implemented.** The site is English-only and LTR-only: `index.html` declares `lang="en"`, there is no translation layer, no locale routing, no `dir="rtl"` handling, and no RTL-aware CSS (spacing uses physical `left`/`right` properties throughout).

The only locale-aware code is `formatPrice()` in `src/hooks/useMembershipPrice.js`, which formats the price with `toLocaleString("en-US")` for thousands separators.

---

## API

Three routes, all under `/api`. In development the Vite dev server proxies `/api/*` to the backend, so the frontend always uses same-origin paths — the same shape as production, where one process serves both.

All API responses carry `Cache-Control: no-store, no-cache, must-revalidate`.

### `GET /api/product-price`

Returns the cached membership price per gender variation. Never fails: values are `null` until the first successful scrape populates them, and the frontend hides its price blocks in that case.

`Access-Control-Allow-Origin: *` — read-only and safe to expose.

**Response** `200`

```json
{
  "man": "6999",
  "woman": "6999"
}
```

Values are plain integer strings in AED, or `null`. Formatting for display (`"6,999"`) is the client's job.

> Note: the header comment in `server/index.js` describes this payload as `{ adults, students }`, and the JSDoc on `useMembershipPrice` says the same. Both comments are stale — the implementation in `priceService.js` and every consumer use `{ man, woman }`.

### `GET /api/contact/health`

Reports **which** configuration is missing so a misconfigured deploy is diagnosable from the browser rather than only from server logs. Returns booleans and variable **names** only — no host, user, password, or key ever appears in the response.

**Response** `200`

```json
{
  "ok": true,
  "mail": { "configured": true, "missing": [] },
  "turnstile": { "configured": true, "disabled": false, "missing": [] }
}
```

Misconfigured example:

```json
{
  "ok": false,
  "mail": { "configured": false, "missing": ["SMTP_PASS / EMAIL_PASS"] },
  "turnstile": { "configured": false, "disabled": false, "missing": ["TURNSTILE_SECRET_KEY"] }
}
```

`ok` is `true` when mail is configured **and** Turnstile is either configured or explicitly disabled.

### `POST /api/contact`

Accepts a contact enquiry and delivers it by email.

**Not open to any origin.** This route accepts writes, so it never sends `Access-Control-Allow-Origin: *`. By default it is same-origin only (production serves both halves from one origin; development reaches it through Vite's proxy, which is also same-origin). `CONTACT_ALLOWED_ORIGIN` exists solely for a split deployment and must name exact origins. `OPTIONS` is answered with `204` and a 24-hour preflight cache. Any other method returns `405`.

**Request** — `Content-Type: application/json`, body capped at 16 KB while streaming.

```json
{
  "name": "Sara Al Mansouri",
  "country": "AE",
  "dial": "+971",
  "phone": "50 123 4567",
  "email": "sara@example.com",
  "message": "I'd like to know more about the membership.",
  "company": "",
  "turnstileToken": "0.abc123..."
}
```

| Field | Required | Max length | Validation |
|---|---|---|---|
| `name` | Yes | 100 | Non-empty after trimming |
| `phone` | Yes | 32 | Matches `/^[\d+()\-.\s]{4,}$/` |
| `email` | Yes | 200 | Matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` — deliberately loose |
| `message` | Yes | 4000 | Non-empty after trimming |
| `country` | No | 2 | ISO 3166-1 alpha-2, upper-cased |
| `dial` | No | 8 | Stored verbatim; combined with `phone` in the email |
| `company` | No | — | **Honeypot.** Hidden from users; any value discards the submission |
| `turnstileToken` | Yes¹ | — | Exchanged with Cloudflare `siteverify` |

¹ Unless `CONTACT_DISABLE_TURNSTILE=true`, which is for local testing only.

Every string field is trimmed, truncated to its cap, and stripped of control characters (tabs and newlines are preserved — a message may legitimately contain them). Length caps are re-checked against the **raw** submitted values, so a request that did not come from the form cannot smuggle an oversized field past client-side truncation.

**Response** `200`

```json
{ "ok": true }
```

**Error responses** — all shaped `{ "ok": false, "error": "<message>" }`. Messages are written for visitors; SMTP responses, hostnames, and stack detail are logged server-side and never returned.

| Status | Condition | `error` |
|---|---|---|
| `400` | Malformed JSON | `Malformed request.` |
| `400` | Validation failure | e.g. `Please enter a valid email address.` / `That name is too long.` |
| `403` | Turnstile rejected the token | `Verification failed. Please try again.` |
| `405` | Method other than `POST` / `OPTIONS` | `Method not allowed` |
| `413` | Body exceeded 16 KB | `Message is too long.` |
| `429` | Rate limit exceeded | `You've sent several messages already. Please try again in 10 minutes.` |
| `502` | SMTP delivery failed after retries | Falls back to the clinic's phone number and email address |
| `503` | SMTP or Turnstile not configured | `The contact form is temporarily unavailable.` |

A triggered honeypot returns `200 { "ok": true }` and sends nothing — telling a spammer which check caught them only helps them tune.

**Client behaviour on failure:** entered data is preserved so the visitor can retry, and the spent Turnstile token is cleared (`window.turnstile.reset()`) because tokens are single-use — a retry with the same token would be rejected by Cloudflare as a replay.

### Email delivery

`From` is the site's own SMTP identity (`"Website Contact Form" <SMTP_USER>`), never the visitor's address — sending as them would fail SPF/DKIM for their domain and read as spoofing. The visitor goes in `Reply-To`, so replying from the inbox answers them directly.

The message is table-based HTML with a plain-text alternative. All submitted values are HTML-escaped; any value interpolated into a header is stripped of CR/LF and `"<>` to prevent header injection (a name containing a newline could otherwise append a `Bcc:` header and turn the form into an open relay). The logo is an inline CID attachment rather than a remote `<img>`, because mail clients block remote images by default.

Delivery is retried twice (after 2s and 4s) for failures that look transient: any 4xx, socket errors (`ETIMEDOUT`, `ECONNRESET`, `ESOCKET`, `ECONNECTION`), and `550` responses whose text mentions spam, rate limiting, or "try again" — some hosts throttle a mailbox and reject with a permanent-looking code even though the identical message is accepted moments later.

---

## Environment Variables

Create `.env` in the project root. It is gitignored and must never be committed. The server reads it with Node's built-in `process.loadEnvFile()`; a missing file is not an error, since a hosting platform normally injects real environment variables instead.

**Only variables prefixed `VITE_` reach the browser.** Vite inlines those into the public bundle at build time. Never add a `VITE_` prefix to an SMTP value or a secret key.

There is **no `.env.example` at the current HEAD** — it existed in an earlier commit and was dropped. Use the tables below, or recover the last committed version with `git show 8bf5b8d:.env.example`.

### Server-side — SMTP (required for the contact form)

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `SMTP_HOST` | Yes | — | Mail server hostname |
| `SMTP_PORT` | No | `465` | `465` for implicit TLS, `587` for STARTTLS |
| `SMTP_SECURE` | No | Derived from port | `true` for 465, `false` for 587. When unset it is derived from the port rather than defaulting blindly — a wrong pairing fails to connect at all |
| `SMTP_USER` | Yes | — | Sending mailbox. Also becomes the `From` address |
| `SMTP_PASS` | Yes | — | Mailbox password. For Gmail this must be a 16-character App Password, not the account password |
| `CONTACT_RECEIVER_EMAIL` | Yes | — | Destination inbox for enquiries |

`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_TO` are accepted as aliases for the six above; the first non-empty name wins, so `SMTP_*` takes precedence. The aliases exist because the deployment platform was already configured with those names, and renaming variables in a live deployment is a needless outage.

### Server-side — other

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `TURNSTILE_SECRET_KEY` | Yes¹ | — | Cloudflare Turnstile secret. Server-only. Without it the endpoint fails closed and refuses every submission |
| `PORT` | No | `3001` | Backend listen port. `vite.config.js` reads the same variable, so the dev proxy target moves with it |
| `CONTACT_ALLOWED_ORIGIN` | No | *(empty)* | Only for a split deployment where the API is on a different origin from the site. Exact origins, comma-separated. Never `*` — this route accepts writes |
| `CONTACT_RATE_MAX` | No | `5` | Submissions allowed per IP per 10-minute window |
| `CONTACT_DISABLE_TURNSTILE` | No | `false` | Local testing only. **Removes bot protection entirely** |

¹ Required unless `CONTACT_DISABLE_TURNSTILE=true`.

### Client-side (`VITE_` — inlined into the public bundle)

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `VITE_TURNSTILE_SITE_KEY` | Yes | — | Public Turnstile site key. Rendered in the browser by design. Without it the widget cannot render and the form shows a "not configured" notice instead of failing on submit |
| `VITE_DISABLE_TURNSTILE` | No | `false` | Browser half of `CONTACT_DISABLE_TURNSTILE`. Both halves must match |

> **The two `DISABLE_TURNSTILE` flags are a local testing escape hatch** that lets the mail path be exercised without solving a challenge. Setting either to `true` in production leaves the endpoint open to bots. `VITE_DISABLE_TURNSTILE` is baked in at **build** time, so it must be `false` or absent when you run `npm run build`.

### Example `.env`

Placeholders only — never commit real values.

```dotenv
# ── SMTP (server-side only; never prefix these with VITE_) ──
SMTP_HOST=smtp.your-mail-host.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=no-reply@your-domain.com
SMTP_PASS=your-smtp-password
CONTACT_RECEIVER_EMAIL=enquiries@your-domain.com

# ── Cloudflare Turnstile ──
# The site key is public and rendered in the browser; the secret key is not.
VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key

# ── Optional ──
PORT=3001
# Blank unless the API is deployed on a different origin from the site.
CONTACT_ALLOWED_ORIGIN=
CONTACT_RATE_MAX=5

# ── Bot protection: local testing only, never true in production ──
CONTACT_DISABLE_TURNSTILE=false
VITE_DISABLE_TURNSTILE=false
```

---

## Local Development

### Prerequisites

- **Node.js 20.6 or newer.** The server reads `.env` with the built-in `process.loadEnvFile()`, which does not exist in earlier versions. Verified against Node 24.11.0.
- **Python 3** — only if you need to run `npm run flags:sync`.

### Setup

```bash
git clone https://github.com/joeka7/Alnojoom-Club.git
cd Alnojoom-Club
npm install
```

Create `.env` in the project root using the [example above](#example-env), then:

```bash
npm run dev:all
```

- Frontend — <http://localhost:5173>
- API — <http://localhost:3001>

Vite proxies `/api/*` to the backend, so the frontend uses same-origin paths in development exactly as it does in production. If the API is not running, the proxy answers with a `503` and an explicit console message naming the fix, rather than a bare `ECONNREFUSED`.

Without a valid `.env` the site still runs and every page renders — only the contact form is disabled. The API returns `503`, the server logs which variables are missing at boot, and `GET /api/contact/health` reports the same.

---

## Available Scripts

| Command | What it does |
|---|---|
| `npm run dev:all` | **Recommended.** Runs the API and Vite together, killing both if either fails |
| `npm run dev` | The same pair, but a crashed API leaves the frontend running |
| `npm run dev:vite` | Frontend only — `/api` calls return `503` from the proxy |
| `npm run dev:api` | Backend only |
| `npm run server` | Alias of `dev:api` |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the built `dist/` via Vite. **Static only — no API**, so price blocks stay hidden and the contact form cannot submit |
| `npm start` | Production server: serves `dist/` and the API on one port |
| `npm run test:email` | Verifies SMTP credentials, then sends one real test enquiry to `CONTACT_RECEIVER_EMAIL` |
| `npm run flags:sync` | Regenerates `src/data/countries.js` and `public/flags/` from `flag-icons` (requires Python 3) |

There is no lint, typecheck, or test script. `npm run build` is the main correctness gate.

---

## Production / Deployment

No platform-specific deployment configuration is committed (no Dockerfile, Procfile, or platform config file). The `.env` comments and the `EMAIL_*` variable aliases indicate the service has been deployed on **Railway**, but that is not encoded in the repository.

### Build and start

```bash
npm run build     # → dist/
npm start         # serves dist/ and the API on one port (PORT, default 3001)
```

`npm start` runs `server/index.js`, which:

1. Answers `/api/product-price`, `/api/contact/health`, and `/api/contact`.
2. Serves static files from `dist/` with an explicit MIME map — including `.webmanifest` as `application/manifest+json`, without which some browsers refuse to parse the manifest and drop the PWA name and icons.
3. **SPA fallback** — any unmatched path serves `dist/index.html` with a `200`, so a hard refresh on `/services/for-men` resolves to the router instead of a 404.

One process serves both halves, so the default setup needs no CORS configuration at all.

### Requirements

- Node.js 20.6+ on the host.
- Every environment variable set in the host's own environment. **Do not deploy the `.env` file.**
- `dist/` must exist before `npm start`. Without a build, static requests and the SPA fallback both miss and the server returns `404 Not found` for every non-API path.
- `server/assets/logo-light.png` must be present, or the enquiry email falls back to alt text. (The send still succeeds — a missing decoration never fails delivery.)

### Deployment checklist

1. Set all environment variables in the platform, not in a committed file.
2. Confirm `VITE_DISABLE_TURNSTILE` is `false` or absent **at build time** — Vite inlines it into the bundle, so a later change has no effect without a rebuild.
3. Confirm `CONTACT_DISABLE_TURNSTILE` is `false`.
4. Add the production domain to the Turnstile widget's Hostname Management in the Cloudflare dashboard, or the widget will not render.
5. Verify configuration from the deployed environment with `GET /api/contact/health`.
6. Verify actual delivery with `npm run test:email`, which reports the exact SMTP response.
7. Check the boot log for `[mail] SMTP ready` and a `[price] cache UPDATED` line.

### Static-only hosting

The frontend can be served as static files from `dist/` without the Node server, provided the host rewrites all unmatched paths to `/index.html`. In that configuration the price blocks stay hidden (no `/api/product-price`) and the contact form cannot submit — both API-dependent features require the Node process.

---

## Security

**Secret boundary.** SMTP credentials and `TURNSTILE_SECRET_KEY` are read only in `server/`, which has no build step and is never bundled. Vite inlines only `VITE_`-prefixed variables, so nothing else can reach the browser. `src/` never imports from `server/`.

**Bot protection is enforced server-side.** The Turnstile widget only produces a token; a bot can post straight to `/api/contact` and skip the widget entirely. The token is exchanged with Cloudflare's `siteverify` from the server using the secret key, and that exchange is the actual protection. Verification **fails closed**: a missing secret, a network error, or an 8-second timeout all reject the submission rather than accepting it unprotected. Tokens are single-use and expire after ~5 minutes; Cloudflare rejects a replay with `timeout-or-duplicate`.

**Defence in depth on the contact endpoint.**

- 16 KB body cap applied *while streaming*, so an oversized payload is dropped mid-flight rather than buffered in full and rejected afterwards. The socket is drained rather than destroyed, so the `413` still reaches the client.
- Per-IP rate limit, 5 submissions per 10 minutes by default, with an opportunistic sweep so the in-memory map cannot grow without bound.
- Hidden honeypot field, answered with `200` so a spammer learns nothing about which check caught them.
- Control characters stripped from every field; length caps enforced against raw input, independently of client truncation.

**CORS is scoped per route.** `GET /api/product-price` sends `Access-Control-Allow-Origin: *` — it is read-only. `POST /api/contact` never does; it is same-origin by default, and `CONTACT_ALLOWED_ORIGIN` only ever echoes an exact allow-listed origin, paired with `Vary: Origin` so a cache cannot serve one origin's response to another. A browser on an unrelated site therefore cannot post to it on a visitor's behalf.

**Path traversal.** Static paths are percent-decoded *before* the `dist/` containment check, so an encoded traversal such as `..%2f` cannot slip past the check and then be resolved by the filesystem. A malformed percent-sequence is treated as a miss rather than crashing the request.

**Email injection.** All submitted values are HTML-escaped in the message body. Values interpolated into headers are stripped of CR/LF and `"<>`, preventing a crafted name from appending headers of its own. `tls.rejectUnauthorized: true` is set explicitly on the transport, so downgrading certificate validation would have to be a deliberate security decision rather than a config tweak.

**Error surfaces.** Visitor-facing errors carry no SMTP response codes, hostnames, or stack detail; those are logged server-side only. `/api/contact/health` returns booleans and variable *names* — never values. Delivery logging records only the enquirer's email address for correlation, never the message body or the rest of their contact details.

**Known limitations.**

- `X-Forwarded-For` is trivially spoofable by a client talking to the server directly. It is used only for the rate-limit bucket and as an optional Turnstile signal, never as proof of identity — and it is trustworthy only behind a proxy you control.
- The rate limiter is per-process and in-memory: it resets on restart and is not shared across instances. A multi-instance deployment needs a limiter at the proxy.
- `useVisitorCountry` calls third-party geo-IP endpoints (`ipwho.is`, `ipapi.co`) from the browser. No visitor data is sent — the request asks only for a country code — but the visitor's IP is necessarily visible to those services.

---

## Performance & UX

**Build output** (current `npm run build`):

| Asset | Raw | Gzip |
|---|---|---|
| `index-*.js` | 1,149 kB | 320 kB |
| `index-*.css` | 86 kB | 13.4 kB |

The build emits Vite's "chunks larger than 500 kB" warning. `three` and `@react-three/fiber` account for most of the JS, and the app is not code-split. This is a known trade-off, not a build failure — code-splitting the WebGL hero behind a dynamic `import()` is the obvious improvement.

**Images.** All photography is WebP, imported through Vite so it is content-hashed for long-term caching. The Home hero ships a separate mobile image (`hero-image-mob.webp`) rather than downscaling the desktop one.

**Flags.** The `flag-icons` stylesheet is deliberately never imported; `scripts/sync-flags.py` copies only the 222 flags actually referenced into `public/flags/`, and the picker loads one `<img>` per selection. See [Maintenance Notes](#maintenance-notes) for the measurement behind that decision.

**Price fetching.** One request per page load, `cache: "no-store"`, aborted-safe via a `cancelled` flag on unmount. On the server the scrape happens once at boot and every 7 days thereafter, so a visitor request never waits on the upstream store.

**Geo-IP.** One lookup per session, cached in `sessionStorage`, with a 4-second `AbortController` timeout and a second provider as backup. The UAE default is returned immediately and only replaced if a lookup succeeds, so the phone field is usable from first paint — a blocked request, an ad blocker, an exhausted rate limit, or being offline all just leave the default in place.

**Accessibility and motion.**

- Every motion feature checks `prefers-reduced-motion`: `useReveal` shows elements immediately, `useParallax` does nothing, `ScrollToHash` jumps instantly, the WebGL canvas switches to an on-demand frameloop, and `globals.css` collapses all animations and transitions to 0.01ms. `[data-reveal]` is force-shown under that query so content is never stranded at `opacity: 0`.
- `useReveal` degrades gracefully where `IntersectionObserver` is unavailable, and carries a 2.4s safety timeout that reveals anything still hidden.
- `CountryPicker` implements full keyboard navigation and ARIA combobox roles, since replacing the native `<select>` meant re-implementing what it provided for free.
- The mobile menu compensates for the hidden scrollbar by padding `body`, so the viewport width — and therefore the `vw`-based container padding — stays constant and the logo does not shift as the menu opens.
- Decorative layers are marked `aria-hidden`; the honeypot is positioned off-screen rather than `display: none`, since some bots skip hidden inputs.

---

## Design System

All tokens are CSS custom properties on `:root` in `src/styles/globals.css`. Use the tokens rather than literal values so a change propagates site-wide.

### Colour

| Token | Value | Role |
|---|---|---|
| `--aln-wine` | `#831649` | Primary brand colour; also `--accent` and the `theme-color` meta |
| `--aln-wine-bright` | `#9d2160` | Hover state (`--accent-hover`) |
| `--aln-wine-soft` | `#a8447d` | Accent marks, icon fills on dark panels |
| `--aln-wine-deep` / `--aln-wine-night` | `#3a1022` / `#27091a` | Dark panels, shadow tint |
| `--aln-ivory` | `#f7f3ed` | Warm page ground; also `--bg-base` and `--text-inverse` |
| `--aln-stone`, `--aln-stone-soft`, `--aln-rose` | `#e1d9d2`, `#ece5dc`, `#f1e3ea` | Section tints and dividers |
| `--aln-ink` | `#241319` | Strongest text (`--text-strong`) |

Text runs a five-step ramp — `--text-strong` `#241319`, `--text-body` `#43343a`, `--text-muted` `#6c5a61`, `--text-subtle` `#8c7a80`, `--text-faint` `#ab9aa0` — plus `--text-inverse` for dark panels.

Surfaces: `--bg-floor`, `--bg-base`, `--bg-raised`, `--surface`, `--surface-hi`, `--surface-hover`. Sections below each page's hero alternate between `--section-bg-a` (`#ffffff`) and `--section-bg-b` (`#f7f3ec`) — white → warm → white, with no dividers between.

Borders are ink at four opacities (`--border-faint` .055, `--border` .10, `--border-strong` .18, `--divider` .08). Focus uses `--focus-ring` (wine at 28%).

### Typography

| Token | Stack | Use |
|---|---|---|
| `--font-display` | `'Tilt Warp'`, `'Instrument Serif'`, Georgia, serif | Headings and hero titles |
| `--font-sans` | `'Geist'`, system-ui, -apple-system, 'Segoe UI', sans-serif | Body and UI |
| `--font-mono` | `'Geist Mono'`, ui-monospace, 'SF Mono', Menlo, monospace | Eyebrows, mono capitals |

Fonts load from Google Fonts via a single `@import` at the top of `globals.css` (Geist 300–800, Geist Mono 400–600, Instrument Serif, Tilt Warp).

The display scale is fully fluid — no breakpoints needed:

| Token | Clamp |
|---|---|
| `--text-hero` | `clamp(3.5rem, 9vw, 8.5rem)` |
| `--text-d1` | `clamp(2.75rem, 6vw, 5.25rem)` |
| `--text-d2` | `clamp(2.25rem, 4.5vw, 3.5rem)` |
| `--text-d3` | `clamp(1.75rem, 3vw, 2.5rem)` |

### Spacing and layout

- `--container-max: 1280px`
- `--container-pad: clamp(20px, 3.5vw, 80px)` — **every section gutter resolves through this one token.** Below ~570px the 20px floor wins and above 1600px the 80px ceiling does, so phones and desktops are unaffected by changes here; only the tablet band moves. The `3.5vw` middle was chosen over `5vw` because a flat 90% content width read as over-padded between 560 and 1024px.
- Radii: `--radius-xs` 6px → `--radius-sm` 10 → `--radius-md` 14 → `--radius-lg` 20 → `--radius-xl` 28 → `--radius-2xl` 36 → `--radius-pill` 999px.
- Shadows: `--shadow-xs` through `--shadow-xl`, all tinted with the deep wine (`rgba(58, 16, 34, …)`) rather than neutral black.
- Glass surfaces: `--glass-bg`, `--glass-bg-strong`, `--glass-border`.

### Motion

Durations `--dur-instant` 80ms · `--dur-fast` 160ms · `--dur-base` 240ms · `--dur-slow` 420ms. Easing `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` and `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`. Composite transitions `--t-hover` and `--t-color`.

Shared keyframes: `aln-fade`, `aln-marquee`, `aln-twinkle`, `aln-float`.

### Responsive breakpoints

There is no formal breakpoint scale — media queries are written per section. The recurring values are:

| Width | Typical use |
|---|---|
| `1024px` | Desktop → tablet layout shifts |
| `940px` | Nav switches to the mobile hamburger (a JS check in `Nav.jsx`, `window.innerWidth < 940`) |
| `880px` / `860px` / `820px` | Two-column → single-column section stacks |
| `700px` | Grid collapses |
| `560px` | Primary mobile breakpoint (most common in the codebase) |
| `480px` / `440px` / `380px` | Small-phone type and padding adjustments |

### Conventions

- **Class naming** is BEM-style, namespaced per section: `.contact-form__input`, `.track-hero__image`, `.membership__price-amount`. Home and About use deliberately separate namespaces for their shared `FeaturedServices` section, so restyling one cannot affect the other.
- **CSS is colocated** with its single consumer — page CSS beside the page, component CSS beside the component. Deleting a component takes its styles with it. Only `globals.css` is global.
- **Icons** come from one module (`src/components/ui/icons.jsx`). Call sites pass `size={ICON_SIZE.md}`, never raw pixels. The scale is `xxs` 12 · `xs` 14 · `sm` 16 · `md` 20 · `lg` 26 · `xl` 34. Editorial symbols share a 32-unit grid with hairline strokes (1.1) and inherit `currentColor`; small interface marks use a heavier 1.4 stroke.
- **Reveal animations** are declarative: add `data-reveal` to any element (optionally `data-reveal="left" | "right" | "scale" | "blur"`) and `data-delay="80"` to stagger it. `useReveal` on the page root does the rest.

---

## Maintenance Notes

**Generated files.** `src/data/countries.js` and `public/flags/` are both produced by `scripts/sync-flags.py`. Edit the script and run `npm run flags:sync`; hand edits to the output are overwritten. The script reads the country table embedded in itself, skips any country whose flag `flag-icons` does not ship (so no row can render a blank flag), sorts by name, writes `countries.js`, and rebuilds `public/flags/` from scratch.

**Why the `flag-icons` stylesheet is not imported.** Vite inlines its ~400 SVGs as data URIs, which inflated the site-wide CSS bundle from 83 KB to 496 KB in order to display one 21px flag. The package is kept for its SVG source only.

**Reading `.env` lazily in `server/`.** Configuration must be read inside functions, never captured into module-level constants — ES imports are evaluated before the importing module's body runs, so `index.js` calls `loadEnvFile()` after its imports have already been evaluated. `const x = process.env.X` at module scope in `server/` is always empty. This has previously caused silent failures: Turnstile verification running unconfigured, and the rate limit ignoring `CONTACT_RATE_MAX`.

**Price scraping is fragile by nature.** `priceService.js` parses HTML from a WooCommerce page it does not control. If that markup changes, parsing fails — by design the previous cached price is retained and the failure is logged (`[price] Could not parse price from store page (cache unchanged)`) rather than the site showing an empty price. Worth checking whenever displayed pricing looks stale. The refresh URL carries a cache-busting query parameter and no-cache headers so an edge cache (Cloudflare, LiteSpeed, WP Rocket) cannot make a refresh silently return stale HTML; each refresh logs the upstream `cf-cache-status` / `age` for exactly that reason.

**Stale comments about the price payload.** The file header in `server/index.js` and the JSDoc on `useMembershipPrice` both describe the response as `{ adults, students }`. The real shape is `{ man, woman }`, as implemented in `priceService.js` and consumed by every caller.

**Mail relay policy.** The configured SMTP mailbox may be restricted to same-domain delivery. Where that is the case, sending to an external address (Gmail, Outlook, Yahoo) is rejected at the SMTP `DATA` stage with `550 This message was classified as SPAM`, while delivery to an address on the clinic's own domain succeeds. The message content is not the cause — the identical message is accepted internally and rejected externally. This is fixed at the mail host, not in code: either enable outbound external mail for the mailbox, or add a forwarder from the internal address to the external one. `CONTACT_RECEIVER_EMAIL` is set to an internal address for this reason.

**Legacy directories.** `src/components/Nav.jsx`, `src/components/Footer.jsx`, `src/components/Eyebrow.jsx`, `src/css/`, and `src/imgs/` are unreferenced by the application and excluded from the build only because nothing imports them. Removing them is safe; editing them has no effect. The `layout/`, `ui/`, and `sections/` components are canonical.

**Backend boundary.** Never import from `server/` inside `src/`. Keeping the boundary strict is what guarantees credentials cannot leak into the client bundle.

---

## Troubleshooting

**The contact form says "temporarily unavailable" (503).** SMTP or Turnstile is not configured. `GET /api/contact/health` names the missing variables. The server also logs them at boot: `[mail] not configured — the contact form will refuse submissions.` Check that the values are not `VITE_`-prefixed by mistake.

**The form shows "isn't configured yet" and no widget renders.** `VITE_TURNSTILE_SITE_KEY` is missing from the build. It is inlined at build time, so setting it after the build has no effect — rebuild.

**The Turnstile widget does not appear in production, though the key is set.** The production domain is missing from the widget's Hostname Management in the Cloudflare dashboard.

**Verification keeps failing (403).** Most often a reused token — they are single-use and expire after ~5 minutes, and Cloudflare rejects a replay with `timeout-or-duplicate`. Check the server log line `[contact] turnstile rejected: <code>`. Also confirm `TURNSTILE_SECRET_KEY` belongs to the same widget as `VITE_TURNSTILE_SITE_KEY`.

**Server reads no configuration at all; everything returns 503.** Node is older than 20.6, so `process.loadEnvFile()` does not exist. The server starts, catches the failure, and proceeds with an empty environment. Check `node --version`.

**`ECONNREFUSED` / proxy 503 in development.** The API process is not running. The Vite proxy detects this case and prints the fix: use `npm run dev:all` rather than `npm run dev:vite` alone.

**Prices never appear.** Price blocks are hidden by design when the fetch fails or the cache is still `null`. Check `GET /api/product-price` directly: `{ "man": null, "woman": null }` means the scrape has not yet succeeded — look for `[price]` lines in the server log. `npm run preview` serves no API at all, so prices are always absent there; use `npm start` to test them against a build.

**`npm run preview` renders the site but the form and prices do nothing.** Expected — `preview` is static-only. `npm start` serves `dist/` and the API together.

**Every non-API path returns `404 Not found` in production.** `dist/` does not exist. Run `npm run build` before `npm start`.

**A hard refresh on `/services/for-men` 404s.** The SPA fallback is not in place. `npm start` handles this; a static host needs an explicit rewrite of unmatched paths to `/index.html`.

**Images with spaces in their filenames appear broken.** Percent-encoded paths (`Lip%20Filler-<hash>.webp`) must be decoded before the filesystem lookup, or the request misses, falls through to the SPA fallback, and returns `index.html` with a `200` — so the browser tries to decode HTML as an image. `serveStatic()` in `server/index.js` handles this; the decode must stay ahead of the containment check.

**The PWA name and icons are ignored.** `.webmanifest` must be served as `application/manifest+json`; the default `application/octet-stream` makes some browsers refuse to parse it. The MIME map in `server/index.js` covers this.

**A test email never arrives.** Run `npm run test:email`, which verifies credentials separately from sending and reports the exact SMTP response. `Username and Password not accepted` on Gmail usually means `SMTP_PASS` is the account password rather than a 16-character App Password. `550 … classified as SPAM` on an external recipient is the relay policy described in [Maintenance Notes](#maintenance-notes), not a content problem.

**"You've sent several messages already" (429) while testing.** The per-IP limit is 5 per 10 minutes. Raise `CONTACT_RATE_MAX` for testing, or restart the server — the counter is in memory.

**The enquiry email has no logo.** `server/assets/logo-light.png` is missing from the deployment. The send still succeeds; the log records `[mail] logo not found at …; sending without it`.

**A country is missing from the picker.** Its flag is not shipped by `flag-icons`, so `sync-flags.py` skipped it — the script prints `skipped (no flag shipped): [...]` when it runs. Add the flag SVG to the source package or the country to the script's table, then `npm run flags:sync`.

**The build warns about a chunk over 500 kB.** Expected. `three` and `@react-three/fiber` dominate the bundle and the app is not code-split. It is a warning, not a failure.

---

## License

No license file is present in this repository. The work is proprietary to Everlast Wellness Medical Center; all rights reserved.
