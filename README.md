<div align="center">
  <img src="public/favicon.svg" alt="ShareMyContact logo" width="140" />
  <h1>ShareMyContact</h1>
  <p><b>Share a digital contact card with a single link — no app, no account, no backend.</b><br/>A privacy-first contact card that lives entirely inside a URL and exports a standards-compliant vCard.</p>
  <p>
    <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
    <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs">
    <img alt="React 19" src="https://img.shields.io/badge/React-19-149eca?logo=react">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript">
    <img alt="Tailwind CSS v4" src="https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss">
    <img alt="PHP 8.1+" src="https://img.shields.io/badge/PHP-8.1%2B-777bb4?logo=php">
  </p>
</div>

---

ShareMyContact turns contact details into a shareable link. You fill in a short form, and the app encodes
your name, phone, email, company, website and LinkedIn into a URL-safe base64 payload that renders at
`/c/[data]`. Anyone who opens that link sees a clean contact card with a QR code and can save you as a
proper vCard — on iOS, Android or desktop.

Because the whole card is carried in the URL, **the core flow needs no database and no server**: nothing
about the person you share is ever stored. An optional PHP backend handles only privacy-respecting
analytics and bespoke-lead capture.

## Features

- **Zero-knowledge sharing** — contact data is encoded into the link itself (`base64url(utf8(JSON))`,
  RFC 4648 §5) and decoded in the browser. No backend touches the core share flow.
- **QR code** rendered client-side for the shared card, so it can be scanned straight off a screen.
- **RFC-compliant vCard 3.0 export** — emits both `FN` and structured `N`, escapes special characters,
  and terminates lines with CRLF so iOS Contacts and Android Contacts import cleanly.
- **UTF-8 safe encoding** that survives multi-byte names and emoji (where `btoa`/`atob` would throw),
  with a legacy-base64 fallback for older QR codes.
- **Marketing site** — landing page with hero and contact form, plus about, blog, privacy and terms pages.
- **Bespoke services modal** for higher-touch leads.
- **Optional PHP analytics backend** (`api-php/`) — anonymous form-funnel events, "Contact Us" click
  tracking, and bespoke-email capture, with per-IP sliding-window rate limiting.
- **Privacy by design** — the analytics endpoints store *only booleans* for which fields were filled,
  never the values; IPs are SHA-256 hashed with a server-side salt and never written raw.
- SEO-ready with `sitemap.ts` and `robots.ts`, and Vercel Analytics wired in.

## Tech stack

| Area          | Technology                                                        |
|---------------|-------------------------------------------------------------------|
| Framework     | Next.js 16 (App Router), React 19, TypeScript 5                   |
| Styling       | Tailwind CSS v4, Radix UI primitives, lucide-react icons          |
| Forms         | react-hook-form + Zod validation                                  |
| QR / vCard    | `qrcode.react`, custom vCard 3.0 + base64url encoders (`lib/`)    |
| Analytics API | PHP 8.1+ with PDO (MySQL/MariaDB) — `api-php/`                    |

## Getting started

### Prerequisites

- Node.js 18+ and a package manager (pnpm, npm or yarn)

### Install and run

```bash
pnpm install       # or: npm install
pnpm dev           # start the dev server at http://localhost:3000
```

Other scripts:

```bash
pnpm build         # production build
pnpm start         # serve the production build
pnpm lint          # run ESLint
```

The share flow works out of the box with no configuration — create a card on the home page and open the
generated `/c/[data]` link.

### Environment variables

Copy `.env.example` and set the values you need. All variables are optional; the core card/QR/vCard flow
runs without any of them.

```bash
# URL of the backend contact-form handler (PHP). Defaults to the production endpoint if unset.
NEXT_PUBLIC_CONTACT_ENDPOINT=

# Base URL of the privacy-respecting analytics + bespoke-leads PHP API (no trailing slash).
NEXT_PUBLIC_SMC_API_BASE=https://api.sharemycontact.com
```

### PHP analytics backend (optional)

The `api-php/` folder is a self-contained backend for shared hosting (PHP 8.1+, MySQL/MariaDB). It exposes
three endpoints — `track-form-event.php`, `track-bespoke-click.php` and `submit-bespoke-email.php` — behind
CORS origin checks and per-IP rate limiting. To deploy: copy `config.example.php` to `config.php`, fill in
DB credentials, a random `ip_hash_salt` and your allowed origins, run `migrations/001_initial.sql`, then
point `NEXT_PUBLIC_SMC_API_BASE` at the upload URL. See [`api-php/README.md`](api-php/README.md) for the
full deploy guide, privacy invariants and smoke tests.

## License

Released under the [MIT License](LICENSE) © 2026 Olivier Lüthy. You're free to use, modify and distribute this
software, including commercially, as long as the copyright notice and license are included.

## Author

Built by **Olivier Lüthy** — [GitHub](https://github.com/olivierluethy).
