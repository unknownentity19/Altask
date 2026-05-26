# Altask — Marketing Site + Visual Editor

Production-ready startup site for **Altask**, a drag-and-drop website builder. Pure HTML, CSS, and vanilla JavaScript — no build step, zero dependencies.

## Pages

| Page | Path | Description |
| --- | --- | --- |
| Home | `index.html` | Hero, problem, tabbed showcase, features, templates, pricing, testimonials, FAQ, CTA |
| Product | `product.html` | Editor walkthrough |
| Features | `features.html` | Full feature matrix |
| Templates | `templates.html` | 9 production templates |
| Pricing | `pricing.html` | Plans, comparison table, monthly/yearly toggle |
| Docs | `docs.html` | Sticky sidebar + content |
| Blog | `blog.html` | 6-post grid with custom SVG covers |
| Contact | `contact.html` | Form wired to Formspree |
| Editor | `editor.html` | Working drag-and-drop builder |
| 404 | `404.html` | Branded not-found page |

## Production checklist

- [x] Semantic HTML5, `<main id="main">` landmark per page
- [x] Skip-to-content link on every page
- [x] Focus-visible rings on every interactive element
- [x] Honors `prefers-reduced-motion`
- [x] Responsive across phone, tablet, desktop
- [x] Open Graph + Twitter card tags per page
- [x] JSON-LD `Organization` + `SoftwareApplication` structured data
- [x] Canonical URL per page
- [x] Web App Manifest (`/site.webmanifest`)
- [x] `robots.txt` + `sitemap.xml`
- [x] Custom 404 page
- [x] Security headers (CSP-friendly, HSTS, X-Frame-Options) via `_headers` (Netlify) + `vercel.json`
- [x] Cache-Control: 1-year immutable on `/assets/*`, no-cache on HTML
- [x] Deferred JS, font preconnect
- [x] Contact form with Formspree integration, honeypot, validation, success/error states
- [x] GitHub Actions CI (HTML/JS validation + broken link check)
- [x] No external runtime dependencies

## Deploy

### Netlify
```bash
# Drag the project folder into the Netlify deploy area, or:
npm i -g netlify-cli
netlify deploy --prod
```
The included `netlify.toml` and `_headers` configure caching, security headers, and redirects automatically.

### Vercel
```bash
npm i -g vercel
vercel --prod
```
The `vercel.json` handles clean URLs, headers, and cache rules.

### Static host (any)
Upload the project root to any static file server. The site has no build step.

## Wiring the contact form

The form on `contact.html` is configured to POST to Formspree. Replace `YOUR_FORM_ID` in `contact.html`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Sign up free at https://formspree.io and paste in your form ID. The honeypot field, validation, and success/error states are already wired up.

## Local development

No build step. Open `index.html` directly in a browser, or:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then visit http://localhost:8000.

## Project structure

```
.
├── index.html / product.html / features.html / ...      ← marketing pages
├── editor.html                                           ← drag-and-drop builder
├── 404.html                                              ← branded not-found
├── sitemap.xml / robots.txt / site.webmanifest           ← SEO foundation
├── _headers / netlify.toml / vercel.json                 ← deploy + security config
├── .github/workflows/ci.yml                              ← validation pipeline
├── assets/
│   ├── css/
│   │   ├── base.css     ← tokens, nav, footer, motion utilities
│   │   ├── pages.css    ← hero, features, pricing, testimonials, FAQ
│   │   └── editor.css   ← editor-specific styles
│   ├── js/
│   │   ├── site.js      ← reveals, submenus, pricing toggle, contact form
│   │   └── editor.js    ← editor engine (palette, DnD, inspector, undo, export)
│   └── og-image.svg     ← social share image
└── README.md
```

## The Editor

`editor.html` is a working visual builder.

15 components: Hero · Heading · Text · Image · Features (3-col grid) · Two columns · Quote · Button · CTA banner · Footer · Navbar · Form · Gallery · Spacer · Divider

Per-block style controls: padding · font size · text alignment · background color (in addition to component-specific fields).

Features: drag-to-reorder · inline edit · duplicate / delete · undo/redo (⌘Z, ⌘⇧Z) · device preview · live preview · export to dependency-free HTML · auto-save via localStorage.
