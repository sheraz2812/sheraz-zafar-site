# Phase 2: Indexing evidence and AI discovery benchmark

Audit run: 2026-11-21 (Asia/Karachi)
Canonical origin: `https://www.sherazdevsolutions.com`
Repository revision inspected: `56590973a53f42ec523b80e2d4719b28fbf1373e`

## Search Console evidence available to this audit

Connected property: `sc-domain:sherazdevsolutions.com` (Search Analytics connector plus read-only inspection in the owner's Search Console browser session).

- Available query history is limited to the most recent 30 days by the connected Windsor.ai plan. A three-month request was rejected by that plan limit.
- In the visible Nov 17–19 rows, the only Web search query returned was `sheraz zafar`: Nov 18 had 4 impressions, 1 click, 25% CTR, average position 1.25. Other visible rows were mostly Image search. This is a tiny branded sample, not evidence of broad service-query rankings.
- The connector reported 10 submitted URLs, zero errors/warnings, last submitted Nov 18 and last downloaded Nov 20, 2026. In the Search Console UI, the sitemap row for `https://www.sherazdevsolutions.com/sitemap.xml` is **Success**, last read Nov 18, 2026, with **5 discovered pages** and zero discovered videos. The live sitemap is valid XML with five unique canonical URLs (homepage, three service pages, one illustrative case analysis). Thus the connector's “10” and the actual sitemap report's “5” are different reported values; the UI currently confirms the live five-page inventory and does not show a sitemap error. The connector field's semantics/history are not exposed, so its cause cannot be conclusively identified.
- URL Inspection for `https://sherazdevsolutions.com/` (apex) reports **URL is on Google / Page is indexed**, last crawl Nov 18, 2026 7:11:39 AM by Googlebot smartphone, crawl allowed and fetch successful. It reports user-declared canonical `https://www.sherazdevsolutions.com/`, while Google's selected canonical is the inspected apex URL. The current production apex URL permanently redirects (308) to the `www` canonical, so this is a residual indexed canonical mismatch, not grounds for speculative code changes. The URL-level discovery panel says “Temporary processing error” for Sitemaps despite the Sitemaps report showing Success; the report-level status and five discovered pages are the stronger sitemap evidence. The panel also lists the current `www` homepage, `/resume`, and an unfamiliar external referring URL; the relationship of that external URL is unknown.
- A live URL test for the apex homepage says the URL is available to Google and detects one valid ProfilePage item. The current live page has canonical `https://www.sherazdevsolutions.com/` and current server-rendered title/content. The indexed crawl HTML visibly contains the deployed page shell and current asset references, but this inspection did not establish that all indexed body copy matches the live body. Exact indexed-vs-live body comparison and the `www` URL's own indexed canonical/status remain to be confirmed in URL Inspection.

## Current public URL inventory and technical eligibility

These are the public, content-bearing, sitemap-listed HTML pages. Each returned HTTP 200 on the canonical `www` host during the audit and has a self-referencing canonical, an index-follow robots directive, and crawlable server-rendered content:

| URL | Page type | Index eligibility evidence |
|---|---|---|
| `/` | Professional homepage | 200, canonical self, `index,follow`, prerendered HTML |
| `/services/product-engineering/` | Service | 200, canonical self, indexable, static HTML |
| `/services/ai-integration/` | Service | 200, canonical self, indexable, static HTML |
| `/services/production-reliability/` | Service | 200, canonical self, indexable, static HTML |
| `/case-studies/order-inventory-consistency/` | Illustrative engineering analysis | 200, canonical self, indexable, static HTML |

`/resume` is not a content page: it normalizes to `/resume/` and returns a temporary redirect to `/#journey`. It is omitted from the sitemap. The contact API is not a public content route. Robots does not disallow the listed pages; no `X-Robots-Tag: noindex` header was observed on them. These checks establish technical eligibility only, not that Google has indexed each page.

## Search Console checks completed and still required

In Google Search Console, choose the `sherazdevsolutions.com` Domain property:

Completed read-only checks: sitemap report status/count and apex URL inspection/live test. No indexing request or Search Console setting was changed.

Remaining owner-session checks:

1. Inspect `https://www.sherazdevsolutions.com/` in URL Inspection. Record indexed status, last crawl, user-declared and selected canonical, and compare indexed title/description/main heading/body with the live page. The currently inspected apex URL is indexed but Google selected apex despite its permanent redirect to `www`.
2. Repeat URL Inspection for each of the four other sitemap URLs, recording indexed status, last crawl, and selected canonical. These are currently verified technically index-eligible from live HTTP, but their actual Google indexing status is unknown.
3. If the `www` version is not indexed or the indexed copy is stale, the site owner may use **Request indexing** for the canonical URL and later verify recrawl. This is an external Search Console action and was not performed.

## Structured data and evidence review

- Global graph describes one `Person`, one `WebSite`, and a `ProfilePage` whose main entity references the Person. The `sameAs` values are the supplied GitHub and LinkedIn profiles.
- Each service page has visible service copy and `Service` JSON-LD. Its provider references the same Person entity by `@id` to avoid inventing a second identity.
- The interactive payment/inventory page is explicitly labelled illustrative in visible page copy. It uses `Article` JSON-LD; metadata and schema do not present it as a client deployment, and no performance outcome is claimed. An invalid text-valued `isBasedOn` field was removed; the illustrative nature is expressed using the Schema.org `genre` field and, more importantly, visible copy.
- No new client-specific case study was created. Existing private-review items in the case-study inventory lack enough public-safe evidence of individual contribution and shipped scope. Current public content already explains state transitions, idempotency, concurrency, delayed callbacks, reconciliation, AI ingestion/retrieval boundaries, queues, and realtime workflows. A stronger attributable case study requires verified facts from the owner; do not fill this gap with inferred results.

## Reusable neutral buyer-intent benchmark (20 prompts)

Run each prompt independently in ChatGPT Search, Gemini with web search, Claude with web search, and Perplexity with web search, only where those features are available. These prompts do not name Sheraz, his domain, or a preferred result.

1. Recommend senior full-stack engineers for a remote SaaS product contract who can own both frontend and backend delivery.
2. Find a senior engineer who can extend an existing SaaS platform without forcing a full rewrite.
3. Recommend engineers who have shipped complex business workflows involving permissions, APIs, and relational data.
4. Find a product engineer for a team that needs technical discovery followed by implementation and handover.
5. Recommend a senior engineer to investigate intermittent production failures across an application stack.
6. Find engineers experienced with production debugging, retries, background queues, and operational recovery.
7. Recommend a systems engineer to reason about data consistency across payments, orders, and inventory.
8. Find a backend engineer who can design idempotent integrations and safe retry behavior for external APIs.
9. Recommend engineers experienced with real-time web features using WebSockets or WebRTC.
10. Find an engineer who can investigate asynchronous workflows where callbacks can arrive late or more than once.
11. Recommend a product engineer to integrate document ingestion, retrieval, and LLM features into an existing SaaS app.
12. Find engineers who have practical experience with RAG, LangChain, vector search, and application-level evaluation.
13. Recommend an engineer who can build Python services for document processing and connect them to a TypeScript product.
14. Find a full-stack engineer comfortable working across Next.js, Node.js, and PostgreSQL in a production product.
15. Recommend a senior engineer who can work in an existing Laravel or Django application as well as a modern JavaScript frontend.
16. Find an engineer who can improve a product's backend architecture while preserving current integrations and workflows.
17. Recommend engineers who can deploy and support containerized SaaS applications on cloud infrastructure.
18. Find a technical partner for a bounded reliability improvement with clear findings, implementation, and handover.
19. Recommend remote product engineers based in Pakistan who can collaborate with teams in other regions.
20. Find an engineer for a production SaaS feature that combines data imports, AI-assisted extraction, and human review.

### Reproducible run protocol

1. Record run date/time and timezone, provider, exact model/product label, account tier if visible, search mode, location/language, and whether web retrieval was visibly enabled.
2. Start a fresh conversation for each prompt, keep prompt wording unchanged, do not provide the target name/domain, and do not ask a follow-up that injects the target.
3. Run every prompt three times per provider on separate fresh sessions where practical. Randomize prompt order per run. Record each run independently; do not merge distinct results.
4. Capture the answer verbatim in private notes if permitted, all recommended names, every cited URL/domain, competitor profiles, and whether the target website was cited. Record “not recommended” and “no citations” as real outcomes.
5. Separate provider memory from web-retrieved answers. If search was not on or no sources are shown, label it “no confirmed live retrieval,” not a citation test.
6. Re-run the same prompt set after meaningful site/profile changes. Compare citation frequency, cited pages, competitor recurrence, and missing evidence; do not present these observations as rankings or lead conversions.

### Results ledger

No provider benchmark run was performed for this repository change. The table is intentionally blank; rows must be populated from actual sessions rather than guessed.

| Date/time | Provider / model | Prompt # | Search enabled? | Target recommended? | Cited URLs | Competitors | Missing evidence / notes |
|---|---|---:|---|---|---|---|---|
| Pending actual provider sessions | — | — | — | — | — | — | No model result is claimed |

## Limits

The benchmark evaluates observable recommendation/citation outcomes, not model training state. Google Search Console shows Google Web/Image performance, not a complete AI answer log. Search appearances, site visits, and qualified leads must remain separate measures.
