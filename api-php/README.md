# ShareMyContact PHP API

Three endpoints for privacy-respecting analytics and bespoke-lead capture.
Designed for shared hosting with PHP 8.1+ and MySQL/MariaDB.

## Files

```
api-php/
├── config.example.php          template — copy to config.php on server
├── config.php                  real secrets — git-ignored
├── lib/
│   ├── db.php                  PDO connection
│   ├── rate-limit.php          per-bucket sliding-window limiter
│   └── utils.php               IP hashing, validation, CORS, JSON helpers
├── track-form-event.php        anonymous form funnel events
├── track-bespoke-click.php     records a "Contact Us" click → lead_id
├── submit-bespoke-email.php    attaches email + message to a lead
└── migrations/
    └── 001_initial.sql         schema — run once via PhpMyAdmin
```

## Privacy invariants

- `form_submissions` stores **only booleans** for which fields the user filled.
  It must **never** store the values of name / phone / email / company /
  website / linkedin from the contact form. The endpoint accepts only
  whitelisted boolean keys; anything else is dropped.
- IPs are SHA-256 hashed with `ip_hash_salt` from `config.php`. Raw IPs are
  never written to the database.
- Endpoints reject requests from origins not in `allowed_origins`.

## Deploy

1. Upload the `api-php/` folder to your shared host (e.g. `/public_html/api/`).
2. Copy `config.example.php` to `config.php` and fill in real values.
   - DB credentials
   - A long random `ip_hash_salt` (`openssl rand -hex 32`)
   - Your domain in `allowed_origins`
3. Make sure `config.php` is **not** publicly readable. On most shared hosts
   PHP files are not served as text; if in doubt, drop a `.htaccess` next
   to it with `Require all denied`.
4. Run `migrations/001_initial.sql` against your database via PhpMyAdmin.
5. In the Next.js frontend, set `NEXT_PUBLIC_SMC_API_BASE` to the URL where
   you uploaded the folder, e.g. `https://api.sharemycontact.com` (subdomain)
   or `https://sharemycontact.com/api` (subpath, only if PHP and the frontend
   share the same host).

## Smoke tests

```bash
BASE="https://api.sharemycontact.com"
SID="$(uuidgen)"

# 1) form_started — no field flags
curl -i -X POST "$BASE/track-form-event.php" \
  -H "Origin: https://sharemycontact.com" \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"$SID\",\"event_type\":\"form_started\"}"

# 2) form_submitted — booleans only, no values
curl -i -X POST "$BASE/track-form-event.php" \
  -H "Origin: https://sharemycontact.com" \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"$SID\",\"event_type\":\"form_submitted\",\"field_flags\":{\"has_phone\":true,\"has_email\":true,\"has_company\":false,\"has_website\":false,\"has_linkedin\":true},\"device_type\":\"mobile\"}"

# 3) bespoke click → lead_id
curl -i -X POST "$BASE/track-bespoke-click.php" \
  -H "Origin: https://sharemycontact.com" \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"$SID\",\"trigger_source\":\"contact_us_need_more\"}"

# 4) bespoke email submit (use lead_id from above)
curl -i -X POST "$BASE/submit-bespoke-email.php" \
  -H "Origin: https://sharemycontact.com" \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"$SID\",\"lead_id\":1,\"email\":\"a@b.com\",\"message\":\"Hi\"}"
```

After each step, check `form_submissions` / `bespoke_leads` in PhpMyAdmin.

## Smuggling test — must fail silently

```bash
# Try to smuggle the user's email through field_flags. The endpoint must
# accept the request but the row in form_submissions must contain NO trace
# of "alice@example.com" anywhere.
curl -i -X POST "$BASE/track-form-event.php" \
  -H "Origin: https://sharemycontact.com" \
  -H "Content-Type: application/json" \
  -d '{"session_id":"sneaky","event_type":"form_submitted","field_flags":{"has_email":true,"email":"alice@example.com","name":"Alice"}}'
```

Then in PhpMyAdmin: `SELECT * FROM form_submissions WHERE session_id='sneaky'`
— there must be no `alice@example.com` or `Alice` anywhere in the row.

## Rate limiting

- `track-form-event.php` → 20 requests/min per ip_hash
- `track-bespoke-click.php` and `submit-bespoke-email.php` → 6 requests/min
  per ip_hash

Tunable in `config.php`. Returns 429 when exceeded.
