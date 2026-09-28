# Clicon Climate Control Solutions — Website

Corporate + lead-generation website for **Clicon Climate Control Solutions
Private Limited**, official dealer of Carrier Transicold India, built per the
project PRD (commercial vehicle AC repair, transport refrigeration, reefer
truck maintenance, Fleet AMC, Pune/PCMC service areas).

Plain HTML/CSS/JS + one PHP endpoint — no build step, no framework, no
npm dependency. Upload the contents of this folder to Hostinger as-is.

## Structure

```
clicon-website/
├── index.html           Home
├── about.html            About Clicon
├── services.html          Services (all 8 categories + workflow)
├── industries.html        Industries Served
├── projects.html           Projects Completed (filterable, sample data)
├── gallery.html             Gallery (filterable, placeholder tiles)
├── service-areas.html        Service Areas / local SEO
├── contact.html               Contact + enquiry form
├── privacy.html / terms.html   Legal pages
├── 404.html                     Custom error page
├── css/style.css                  Shared stylesheet (design system)
├── js/main.js                      Nav, WhatsApp links, form handling, filters
├── php/contact-handler.php          Enquiry form backend (CSV log + email)
├── data/                              Leads CSV + rate-limit file (protected, not public)
├── robots.txt, sitemap.xml, .htaccess  SEO + Apache config
├── CONTENT-TODO.md                       What to replace before go-live
└── DEPLOY-HOSTINGER.md                     Step-by-step Hostinger deployment
```

## Before you deploy

Read **CONTENT-TODO.md** — every placeholder (phone number, WhatsApp number,
email, workshop address, domain, social links, Google Maps, GA4 ID) must be
replaced with confirmed Clicon details before this goes live. See
**DEPLOY-HOSTINGER.md** for the upload/DNS/SSL/contact-form steps.

## Local preview

No build tooling is required — open `index.html` directly in a browser, or
serve the folder with any static server, e.g.:

```bash
cd clicon-website
python3 -m http.server 8080
```

The contact form posts to `php/contact-handler.php`, which only runs on a
PHP-enabled server (works out of the box once uploaded to Hostinger).
