# Content TODO — required before public launch

This site was built from the Clicon PRD with clearly-marked placeholder
content. Per the PRD's Contact Data Governance and Content Acceptance
Criteria (sections 26 & 28), **no placeholder contact information or
unverified content may remain on the production site.** Work through this
list before pointing the live domain at it.

## 1. Contact details (search-and-replace across every page + PHP)

| Placeholder | Find | Replace with |
|---|---|---|
| Phone number | `+919900000000` / `919900000000` / `+91 99000 00000` | Clicon's confirmed phone number |
| WhatsApp number | `919900000000` (in `js/main.js` → `CLICON.whatsappNumber`) | Clicon's confirmed WhatsApp number |
| Email | `info@clicon.example` | Clicon's confirmed inbox |
| Domain | `https://www.clicon.example` (canonical/OG tags, sitemap.xml, robots.txt) | The real live domain on Hostinger |
| Workshop address | `TODO — confirm exact address` (footer, contact.html, JSON-LD schema) | Exact address matching the Google Business listing |
| Opening hours | `Mon–Sat: 9:00 AM – 7:00 PM` | Confirmed hours |
| Legal/GST footer | `terms.html` GST line | GST number if applicable |

Search for the literal string `TODO` across the folder to find every
remaining placeholder (`grep -r "TODO" clicon-website/`).

## 2. `js/main.js` config block

At the top of `js/main.js`:

```js
var CLICON = {
  whatsappNumber: "919900000000", // digits only, country code first, no + or spaces
  phoneNumber: "+919900000000",
  ...
};
```

Update both values once — every WhatsApp/Call button on every page reads
from here.

## 3. `php/contact-handler.php` config block

```php
const NOTIFY_TO_EMAIL   = "leads@clicon.example";
const NOTIFY_FROM_EMAIL = "no-reply@clicon.example";
```

`NOTIFY_FROM_EMAIL` should be an address on the live domain (Hostinger's
`mail()` delivery is more reliable when the From address matches the
sending domain). If Hostinger flags delivery issues, switch to SMTP — see
DEPLOY-HOSTINGER.md.

## 4. Photographs (Projects, Gallery, Home, OG image)

Every gallery tile and project thumbnail is currently a styled placeholder
(no stock photography of people or vehicles was used, since none could be
verified as genuine Clicon work). Replace with real, compressed Clicon
photographs:

- Workshop, reefer units, commercial vehicle AC, technicians, repair work,
  refrigeration systems, fleet projects, completed installations,
  before/after — see `gallery.html` categories.
- Add an Open Graph cover image at `images/og-cover.jpg` (referenced in
  `index.html` / `contact.html` `<meta property="og:image">`).
- Compress everything to WebP/AVIF where possible (see PRD §24 Performance).

## 5. Projects Completed data

`projects.html` currently contains six **sample** project cards clearly
labelled "(sample)". Per PRD §28: *no example project should be represented
as an actual completed project unless verified by Clicon.* Replace with
real projects (title, vehicle type, service category, location, problem,
diagnosis, work performed, result, photos, completion date) or remove the
"(sample)" markers only once each entry is verified.

## 6. Google Maps + Google Business Profile

`contact.html` has a placeholder map block. Once Clicon's Google Business
Profile is finalized:

- Embed the real Google Maps iframe (get the embed code from Google Maps →
  Share → Embed a map).
- Link to the Google Business Profile and review-generation link from the
  footer/contact page.
- Make sure the address on this website matches the Google listing exactly.

## 7. Social links

Footer social icons (`index.html` etc.) currently point to `#` with a
`title="TODO..."`. Update `href` to Clicon's real Facebook / Instagram /
LinkedIn / YouTube URLs, or remove icons for platforms Clicon doesn't use.

## 8. Analytics & Search Console

Add Google Analytics (GA4) and Google Search Console per
`js/main.js`'s `gaEvent()` hooks (it already fires `call_click`,
`whatsapp_click`, `faq_open`, `generate_lead` events once `gtag` is loaded).
See DEPLOY-HOSTINGER.md for where to paste the GA4 snippet.

## 9. Legal pages

`privacy.html` and `terms.html` are baseline drafts. Have them reviewed
against applicable Indian data-protection law (including the Digital
Personal Data Protection Act, 2023) before publishing.

## 10. Favicon

Add a real `favicon.ico` (and ideally `apple-touch-icon.png`) at the site
root — currently referenced but not provided.
