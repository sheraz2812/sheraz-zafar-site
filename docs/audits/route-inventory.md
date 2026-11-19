# Route inventory

Audited against the production site and current Next.js App Router source on 2026-11-19. Production route observations describe the currently deployed version; post-fix local observations are in `verification-results.md`.

| Route | Type | Production observation | Purpose / notes |
|---|---|---|---|
| `/` | Static | 200 on `www`; apex redirects permanently to `www` | Portfolio homepage, profile, case-study entry, services, FAQ, inquiry form. |
| `/case-studies/order-inventory-consistency/` | Static | 200; slashless path redirects to slash form | Interactive illustrative system case study. Page explicitly avoids naming a client and labels examples illustrative. |
| `/services/product-engineering/` | SSG | 200; slashless path redirects to slash form | Product engineering service page. |
| `/services/ai-integration/` | SSG | 200; slashless path redirects to slash form | AI integration service page. |
| `/services/production-reliability/` | SSG | 200; slashless path redirects to slash form | Reliability service page. |
| `/api/contact` | Dynamic API | `GET` returns 405 as expected | Contact submission endpoint; POST only. Live safe self-submission succeeded. |
| `/robots.txt` | Generated static metadata | 200 | Agent directives and sitemap location. Search agents are allowed; some training bots are disallowed. |
| `/sitemap.xml` | Generated static metadata | 200 | Homepage, case study, and three service URLs. |
| `/llms.txt` | Public static text | 200 | Human-readable site description and links for language-model discovery. |
| `/favicon.ico` | App icon metadata | 200 | Portrait crop; live bytes match local source. |
| `/apple-icon.png` | App icon metadata | 200 | Portrait crop; live bytes match local source. |
| `/assets/sheraz-portrait.png` | Public static asset | 200 | Owner-provided profile portrait; exact hash match to supplied original. |
| `/resume` and `/resume/` | Legacy URL | Production 404; local `/resume/` returns temporary 307 to `/#journey`; slashless path first normalizes with 308 | Keep temporary redirect because a complete current approved resume is not present in the repository. Browser follows the fragment to the homepage journey section; remove stale search snippet by recrawl after deployment. |
| `/_not-found` / unmatched path | Framework fallback | Unknown path returns 404 | Standard Next.js not-found page. |

## Navigation checks

- Homepage internal navigation and main contact CTA were inspected.
- Service pages have navigation back to the portfolio and contact CTA.
- Case-study controls were exercised with mouse and keyboard focus styling present in source.
- `/manifest.json` and `/site.webmanifest` are not configured and return 404 if requested; neither is linked from the app, so they are not broken in-app dependencies.

## Source map

- Homepage/layout metadata: `app/page.tsx`, `app/layout.tsx`
- Case study: `app/case-studies/order-inventory-consistency/page.tsx`
- Service pages: `app/services/[service]/page.tsx`
- Contact API/form: `app/api/contact/route.ts`, `components/contact-form.tsx`
- Generated discovery routes: `app/robots.ts`, `app/sitemap.ts`, `public/llms.txt`
- Route redirects and response headers: `next.config.mjs`
