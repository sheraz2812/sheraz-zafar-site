# Portfolio audit and production readiness

Audit date: 2026-11-19 (Asia/Karachi)
Production target: <https://www.sherazdevsolutions.com/>
Repository baseline: `b2f30ac7816c501a0fbc4fde848b7e6555359577` on `main`

## Executive summary

The production site is responding and its current portrait, favicon, Apple icon, and social preview source match the checked-out assets. The observed old portrait/icon is therefore not explained by a bad or out-of-date repository asset. A stale open browser tab was directly observed, and stale search results for an older version remain indexed; browser, search, and social caches are the likely explanation. A cache purge or Google refresh was not performed and cannot be guaranteed from this repository.

The confirmed code-level SEO defect was a hostname mismatch: the apex domain redirects visitors to `www`, while canonical URLs, structured data, sitemap, robots sitemap directive, and `llms.txt` previously advertised the apex. These references now use the deployed `www` host. The old `/resume/` URL returned 404 and had stale search copy; locally it now reaches `/#journey` through a temporary 307 redirect (with a preceding slash-normalization 308 for `/resume`).

The contact email flow completed a safe live test: the form reported success and the owner inbox received both the branded owner notification and the branded sender confirmation. SPF and DKIM passed. The client request now also has an 18-second abort timeout and a readable error for non-JSON failure responses.

Local changes are build-verified and ready for owner review. **Nothing in this audit has been committed, pushed, or deployed.** Production continues to serve the pre-audit version until an approved deployment occurs.

## Severity-ranked findings

### Resolved locally

| Severity | Finding and evidence | Change | Verification / remaining limit |
|---|---|---|---|
| P1 | Canonical identity split across apex and `www`; the live apex redirects to `www`, while page canonicals, JSON-LD, sitemap, robots, and `llms.txt` used apex. | Added shared `lib/site.ts` canonical base and aligned page/schema/sitemap/robots/LLM references to `https://www.sherazdevsolutions.com`. | Production build and local rendered HTML/resource checks passed. Not live until deployment; search engines must recrawl. |
| P1 | `/resume/` returned 404 while old search results still linked to it and showed obsolete claims. | Temporary redirect `/resume/` → `/#journey` (307); Next's trailing-slash normalization adds a preceding 308 from `/resume` → `/resume/`. | Local smoke test verifies `/resume/` returns 307 and `/resume` follows 308 then 307, both ending at the homepage journey fragment. The temporary code avoids indefinitely caching a placeholder destination. |
| P2 | Contact submission had no client-side timeout; a delayed network/API response could leave the form appearing to load indefinitely. | Added an 18-second `AbortController` timeout, cleanup, and tolerant response parsing with a user-facing timeout/error message. | Safe live self-submission succeeded and both messages arrived. Timeout path is code-reviewed, not forced against live Resend. |
| P2 | Small muted and coral text on light backgrounds fell below WCAG AA contrast in quick calculation (`#68727a` on `#f5f4ef`: 4.46:1; `#e45b43` on that background: 3.25:1). | Darkened muted text to `#626c73` and added `#b9422f` for small coral text on light backgrounds; preserved brand coral for fills and large display text. | Calculated ratios are 4.87:1 and 4.91:1 respectively on the paper background. This is targeted contrast correction, not a full automated accessibility certification. |
| P2 | Response lacked several baseline browser-protection headers. | Added `nosniff`, `SAMEORIGIN`, strict-origin referrer policy, and disabled camera/microphone/geolocation via Permissions-Policy. | Headers verified from local production server. Vercel supplies HSTS in production; local server does not. No CSP was added because this Next app needs a nonce/hash-aware CSP review. |
| P2 | Service detail pages provided limited scope and deliverable context. | Added factual, forward-looking scope/deliverable/boundary descriptions to the three service pages. | Build passed; reviewed as engagement descriptions, not claimed completed client outcomes. |
| P2 | The original portrait PNG is 2,163,994 bytes; Next image optimization is disabled. | Preserved the original and generated 720px/960px WebP derivatives; responsive hero selects the smaller mobile file. | Visually reviewed in mobile browser. 56,338-byte mobile derivative and 98,108-byte desktop derivative; no Core Web Vitals measurement. |

### Confirmed but not fixable by source-only work

| Severity | Finding | Evidence / next step |
|---|---|---|
| P1 | Public search results retain old page title/copy, including a “40% Cost Reduction Guaranteed” result and an old `/resume` result with “3.5+ years”. | Search query snapshots showed stale content while current live HTML did not contain those claims. After deployment, verify Google Search Console property and submit the sitemap plus homepage and former resume URL for indexing. Search result refresh is controlled by crawlers; ranking or timing cannot be promised. |
| P2 | An already-open browser tab showed prior “PREPARE EMAIL” content while a fresh navigation showed the current “SEND INQUIRY” form. | Fresh cache-busted navigation and live assets were current; Vercel deployment was Ready. Hard-refresh/reopen the tab after deploy. A service worker is absent, so no service-worker cache root cause was established. |
| P2 | AI crawler policy is selective: search/user agents are allowed, model-training crawlers `GPTBot` and `ClaudeBot` are disallowed. | This follows the current explicit site policy. Search-agent discoverability and training permission are different controls; change only if the owner wants to revise that policy. No crawler can be forced to recommend or rank the site. |

## Visual and functionality review

- Desktop and 425×705 mobile views were inspected for the homepage and service page. Text wraps without horizontal overflow in the inspected viewports; no redesign was performed.
- The interactive case study’s system map, accepted/declined/provider-timeout scenarios, and reset behavior were exercised. It clearly labels the material as illustrative and not a named client case.
- Homepage FAQ disclosure opens using native `details` behavior.
- Contact flow successfully delivered both the owner notification and submitter confirmation to the self-addressed test account. Both had branded formatting, SPF/DKIM passed, and the owner notification included the submitter reply address.
- Local browser console showed no messages during the observed page check. This is a spot check, not exhaustive browser/assistive-technology coverage.
- Route-by-route details and limits are in `route-inventory.md`, `seo-and-assets.md`, `ux-and-credibility.md`, and `verification-results.md`.

## Owner confirmation before launch

The prior conversation reported a Fiverr completed-order count, but no account export or screenshot is in the repository. The homepage no longer displays a count. Do not publish the count until current evidence is available, and do not equate completed orders with unique clients or engagements. No new client names, measured results, testimonials, credentials, or project outcomes were added in this audit.

## Resume route decision

The repository contains a partial professional timeline and generalized project summaries, but not a complete current resume suitable for a dedicated recruiter page (for example, verified education, complete role dates/responsibilities, and a reviewed employment/freelance distinction in resume format). The supplied conversations include more detail but are not a complete source document inside the repository. Keep the temporary `/resume` → `/#journey` 307 redirect until a current approved resume is supplied; do not construct a resume from incomplete fragments.

## Deployment gate

Local production build passes and the audit fixes are reviewable. Production deployment remains pending explicit owner approval. After deployment, verify canonical tags and response headers on `www`, check `/resume/`, refresh Google Search Console sitemap/indexing, and re-fetch social previews. Search ranking, LLM recommendations, and indexing timing cannot be guaranteed.
