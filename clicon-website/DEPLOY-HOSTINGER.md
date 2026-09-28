# Deploying to Hostinger

This site is plain HTML/CSS/JS + one PHP script — Hostinger's shared
hosting (hPanel) supports it directly, no Node build step needed.

## 1. Upload the files

**Option A — File Manager (simplest)**
1. hPanel → **Files → File Manager**.
2. Open `public_html` (or the subfolder for your domain/subdomain).
3. Upload the entire contents of `clicon-website/` (not the folder itself —
   its *contents*) so `index.html` sits directly in `public_html`.
4. If you uploaded a zip, use File Manager's **Extract** action.

**Option B — FTP**
1. hPanel → **Files → FTP Accounts** → note host/username/password (or
   create a new FTP account).
2. Connect with any FTP client (FileZilla, Cyberduck) and upload the
   contents of `clicon-website/` into `public_html`.

## 2. Point the domain

- hPanel → **Domains** → attach/point the client's domain to this
  hosting plan (or use a subdomain first for review, e.g.
  `clicon-preview.yourhostingaccount.com`).
- DNS propagation can take a few hours — Hostinger's hPanel shows
  propagation status.

## 3. Enable SSL (HTTPS)

- hPanel → **Security → SSL** → issue the free Let's Encrypt certificate
  for the domain (and `www.` variant).
- `.htaccess` (already included) force-redirects HTTP → HTTPS and to the
  `www.` host once SSL is active — comment out the "Force www" block in
  `.htaccess` if the domain should run without `www.` instead.

## 4. Verify PHP is enabled

Hostinger shared hosting runs PHP by default. Confirm the version in
hPanel → **Advanced → PHP Configuration** (PHP 8.x recommended). No
extra setup is required for `php/contact-handler.php` to run — it uses
only PHP's built-in `mail()` and file functions.

## 5. Contact form email delivery

`php/contact-handler.php` uses PHP's `mail()` function, which works on
Hostinger out of the box but can occasionally land in spam or be rate
limited. Two options:

- **Quick check**: submit a test enquiry after deploying and confirm the
  notification email arrives at `NOTIFY_TO_EMAIL`.
- **More reliable**: set up a mailbox in hPanel → **Emails → Email
  Accounts** for the live domain (e.g. `leads@clicon-domain.com`), use it
  as both `NOTIFY_TO_EMAIL` and `NOTIFY_FROM_EMAIL`, and if needed switch
  to SMTP (hPanel → Emails → Connect Apps or Configure Email Client gives
  the SMTP host/port/credentials) via PHPMailer for guaranteed delivery.

Every enquiry is also safely logged to `data/leads.csv` regardless of
whether the email sends — check hPanel File Manager if you ever suspect a
missed notification. `data/.htaccess` blocks public web access to that
folder.

## 6. Update all placeholders

Before announcing the site as live, work through **CONTENT-TODO.md** —
phone/WhatsApp numbers, email, address, domain in canonical/OG tags,
`sitemap.xml`, `robots.txt`, and real photographs.

Update the domain in:
- Every page's `<link rel="canonical">` and `<meta property="og:url">`
- `sitemap.xml` (`<loc>` entries)
- `robots.txt` (`Sitemap:` line)

## 7. Google Analytics / Search Console

1. Create a GA4 property at analytics.google.com, get the Measurement ID
   (`G-XXXXXXX`).
2. Add the standard GA4 snippet just before `</head>` on every page (or
   centralize it if you later move to a templated build). `js/main.js`
   already calls `gtag('event', ...)` for call clicks, WhatsApp clicks,
   FAQ opens and form submissions — those will start showing up in GA4
   automatically once `gtag.js` is loaded.
3. Verify the domain in Google Search Console (HTML tag or DNS method) and
   submit `sitemap.xml`.

## 8. Google Business Profile

Once Clicon's Google Business Profile is set up/confirmed, embed the Maps
location on `contact.html` (replace the placeholder block) and link to the
profile from the footer.

## 9. Ongoing content updates

There's no CMS/admin panel in this build (kept deliberately simple for a
static Hostinger deployment). To update projects, gallery images, service
areas, FAQs, etc., edit the relevant `.html` file directly and re-upload
via File Manager/FTP. If Clicon needs frequent self-service updates without
touching HTML, that's the natural Phase 2 addition (see PRD §21) — a
lightweight admin panel or a headless CMS (e.g. a Hostinger-hosted
WordPress/HeadlessCMS) can be layered on later without changing the public
page structure.

## 10. Post-launch checklist (PRD §27)

- [ ] All nav links work, no 404s
- [ ] Contact form submits and email/CSV log both work
- [ ] WhatsApp buttons open the correct number
- [ ] Call buttons dial the correct number
- [ ] Google Maps opens the correct workshop location
- [ ] Verified on an Android phone over 4G
- [ ] No placeholder phone/email/address remains (`grep -r "TODO" .`)
- [ ] HTTPS active and forced
- [ ] `404.html` renders correctly for a bad URL
- [ ] Google Analytics + Search Console configured
