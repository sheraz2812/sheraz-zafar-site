# SEO, crawlability, and asset audit

Audit date: 2026-11-19. Live observations were compared with the local source and production build.

## Findings

### Canonical host — P1, fixed locally

The apex domain redirects to `https://www.sherazdevsolutions.com/`. Before edits, metadata canonical/Open Graph URL, JSON-LD identity, sitemap entries, robots sitemap directive, and `llms.txt` used the apex host. This created mixed signals between the preferred public host and discovery metadata.

The local change centralizes `https://www.sherazdevsolutions.com` in `lib/site.ts` and uses it across page metadata, structured data, sitemap, robots, and `llms.txt`. Production remains unchanged pending approved deploy.

### Resume decision

There is no complete current resume document in the repository. The timeline and generalized project entries are partial and do not constitute a recruiter-ready resume with verified education, role-specific responsibilities, and all needed dates. A temporary 307 redirect to `/#journey` remains until an approved current resume is available. The site-wide trailing-slash rule adds a 308 normalization hop for `/resume` without a slash.

### Legacy `/resume/` URL — P1, fixed locally

Live `/resume` and `/resume/` returned 404 while search results still exposed an old resume snapshot with outdated experience/claims. `next.config.mjs` now temporarily redirects `/resume/` to `/#journey` with status 307. The site-wide trailing-slash rule first normalizes slashless `/resume` to `/resume/` with status 308. This provides a working landing destination but does not itself remove stale snippets; submit the changed URL for recrawl after deploy.

### Search result freshness — P1, external indexing

Queries such as `site:sherazdevsolutions.com "40% Cost Reduction Guaranteed"` and `site:sherazdevsolutions.com "3.5+ years"` surfaced obsolete search snapshots. Current live homepage HTML did not contain these old claims. Treat this as stale indexed content unless fresh crawling shows otherwise. Do not repeat old guarantees in public copy. Google Search Console must be used after deployment to validate the property, submit the sitemap, and request indexing of the homepage and former resume URL. Search ranking or refresh time is not controllable from source code.

### Favicon/profile/social image — P1 concern investigated, no source mismatch

- Local `public/assets/sheraz-portrait.png` SHA-256: `0af342262f1f286adf64eb7294f15893ac87446beb2a83a72906f7b9fe56335`.
- This hash matches the owner-provided portrait exactly.
- Live `/assets/sheraz-portrait.png`, `/favicon.ico`, and `/apple-icon.png` matched local files at audit time; favicon and Apple icon visibly render the supplied portrait crop.
- Open Graph/Twitter metadata points to the current portrait.

Conclusion: there is no evidence the source or active production deployment contains the wrong portrait. An already-open browser tab was observed rendering prior page content while a fresh navigation showed the current form. Stale browser state/cache is a plausible explanation; stale social previews also need platform re-fetch after deployment. A specific browser cache mechanism was not proven.

### Crawl directives and AI discovery

`robots.txt` allows general crawling and explicitly allows `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, and `Google-Extended`; it blocks `GPTBot` and `ClaudeBot`. `llms.txt` provides a readable summary and route links. These controls can permit access for compliant crawlers but cannot ensure that an AI product retrieves, cites, ranks, or recommends the site. The distinction between search crawlers and training crawlers should be preserved unless the owner wants to change policy.

### Sitemap coverage

The sitemap contains the homepage, three service pages, and the illustrative case study. The legacy resume route is not listed. The generated sitemap currently stamps `lastModified` at build/render time; this is acceptable for a small static site but can look like every URL changed when the sitemap is regenerated. Consider using content-specific dates if crawl scheduling becomes important.

### Image transfer and performance — P2 follow-up

The original profile PNG is 2,163,994 bytes; it is preserved. A 720px WebP derivative is about 55 KB and a 960px WebP derivative is about 96 KB. Both were visually reviewed; the same crop/color/saturation treatment is applied in CSS, and the source image remains available for social metadata and fallback. The hero uses the 720px derivative on mobile and 960px on larger screens. Next image optimization is explicitly disabled in `next.config.mjs`, so these static assets bypass `/_next/image` and work as ordinary Vercel static files. The static approach avoids dependence on runtime `sharp`; no server-side image-optimizer route is exercised. The byte transfer for the hero portrait is reduced by approximately 97% versus the 2.1 MB PNG on mobile, and 95.5% on desktop. No Lighthouse/PageSpeed/Core Web Vitals run or before/after browser performance baseline was captured; do not infer an LCP score.

## Metadata and structured data

Local homepage and service metadata consistently use the `www` identity after the fix. JSON-LD describes the owner/site and professional services; content should stay aligned with verifiable visible page copy. No unsupported client outcomes, guarantee, testimonial, credential, or ranking claims were added.

## Post-deploy SEO actions

1. Verify `https://www.sherazdevsolutions.com/` as the canonical Search Console property.
2. Inspect the deployed homepage canonical and JSON-LD; verify `robots.txt` and `sitemap.xml` use `www`.
3. Submit `https://www.sherazdevsolutions.com/sitemap.xml`.
4. Request indexing for `/`, `/resume/` (redirect), and key service pages; monitor coverage/canonical selection rather than assuming immediate refresh.
5. Re-fetch Open Graph previews using each platform’s own debugger after deployment.
6. Recheck branded-name and obsolete-claim queries over time; rankings cannot be guaranteed.
