# Verification results

Audit date: 2026-11-19 (Asia/Karachi). No deployment, commit, push, or production configuration change was made.

## Baseline

- Repository: `main`, HEAD `b2f30ac7816c501a0fbc4fde848b7e6555359577`.
- Existing baseline `npm run build` passed.
- Baseline `package.json` had no test, lint, or standalone typecheck scripts. This pass adds a small Node built-in test suite; lint remains unconfigured.
- Existing untracked user materials (`AGENTS.md`, `docs/`, `work/`, `public/assets/portfolio-concept.png`) were preserved. Only the new files in `docs/audits/` were added to that user-owned untracked docs tree.

## Local checks after changes

| Check | Result |
|---|---|
| `npm run build` | Pass. Static homepage, case study, three service pages, robots, sitemap, and Apple icon generated; `/api/contact` remains dynamic. TypeScript passed. |
| `npm test` | Pass: 11 Node built-in tests (4 mocked contact request tests; 7 production-route smoke tests). |
| `./node_modules/.bin/tsc --noEmit` | Pass. |
| `npm audit --audit-level=moderate` | Pass; 0 vulnerabilities reported. |
| `git diff --check` | Pass; no whitespace errors. |
| Lint | No lint script or lint tool is configured in `package.json`; not run. |
| Local production `/` | 200; title and canonical metadata present, canonical host is `www`; homepage no longer renders an unsupported order/client count. |
| `/resume` and `/resume/` | Both finish at `/#journey`; `/resume/` returns temporary 307, while slashless `/resume` first receives canonical 308 normalization, then temporary 307. Browser confirmed the fragment scrolls to the journey section. |
| Case study and three service routes | 200 in local production preview. Service pages contain scope, deliverables, and engagement-boundary sections. |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | 200; discovery URLs use `www`. |
| `/favicon.ico`, `/apple-icon.png` | 200. Source pixels/bytes checked against current owner portrait. |
| Profile hero derivatives | 720px WebP (56,338 bytes) on mobile; 960px WebP (98,108 bytes) on desktop. Original PNG (2,163,994 bytes) preserved. |
| `GET /api/contact` | 405, expected for POST-only endpoint. |
| Unknown route | Returns 404. |
| Response headers | Local production responses include nosniff, SAMEORIGIN, strict-origin referrer policy, and limited Permissions-Policy. |
| Mobile visual preview | Homepage and product-engineering service inspected at 425px width; document width stayed 425px. Browser selected 720px WebP. Required contact fields were invalid while blank. |
| Desktop visual preview | Homepage inspected at 1440px; no horizontal overflow. Browser selected 960px WebP. Page console had no warnings/errors in the observed checks. |
| Contact live safe test | Success state shown; owner and submitter messages delivered to self-addressed owner inbox; SPF and DKIM passed. |
| Interactive case study / FAQ | Main controls and outcomes exercised; FAQ disclosure opened. |
| Final interactive browser smoke | Switched to Execution flow, selected Declined payment and Provider timeout, and confirmed each state updated to its corresponding failure/unknown-outcome content. |

## Live production spot checks (pre-fix deployment)

- Homepage, service pages, case study, robots, sitemap, llms, favicon, Apple icon, and portrait return 200 on `www`.
- Apex redirects to `www`.
- `/resume` and `/resume/` return 404 in the current production deployment.
- Live image/icon files matched the checked-out source at audit time.
- Vercel deployment was Ready; runtime logs view showed no events in the preceding 30 minutes. This is only a point-in-time observation.
- Existing search results included old portfolio claims even though the current live HTML did not. Index state is external and not verified as refreshed.

## Not verified / limits

- No Google Search Console login/property/sitemap submission was performed in this task; indexing and ranking remain pending owner/browser-side follow-up.
- No production deployment was made, so the local fixes are not yet live.
- No dedicated resume page was added because the repository lacks a complete current approved resume; `/resume` remains a temporary redirect.
- No exhaustive browser/device, assistive-technology, form-abuse, load, or security penetration test was run.
- Contact timeout behavior was code-reviewed but not induced against the live email provider.
- Lighthouse/PageSpeed and quantitative before/after LCP/Core Web Vitals measurements were not run; only portrait transfer bytes were compared.
- No guarantee can be made that Google or an LLM search/recommendation product will rank or suggest this site.

## Local preview cleanup

The production preview server was run on port 3102 for QA and should be stopped after the final browser inspection. No build output or generated `.next` files are intended for commit.
