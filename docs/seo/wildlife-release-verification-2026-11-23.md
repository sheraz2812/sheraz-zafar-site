# Wildlife release verification — 2026-11-23

## Release

- Commit: `5d6c5588a9c3320b7b6c1df2b44fa80a20ba3bb7`
- Branch: `main`
- Production workflow: GitHub `main` → Vercel project `sheraz-zafar-site`
- Public URL: `https://www.sherazdevsolutions.com/case-studies/wildlife-detection/`
- External GitHub and LinkedIn drafts: not published

## Disclosure gate

Passed before deployment. The public page and SVG contain only the approved engineering-project wording and technical components. No client, contract, milestone, engagement, private repository, deployment URL, infrastructure identifier, credential, unsupported ownership, production, scale, accuracy or commercial-outcome claim is present.

The architecture SVG is a generic technical illustration of component boundaries. It does not reproduce private topology, source code, identifiers or operational data. This review does not grant rights to any underlying private artifact; none is linked or published.

## Live verification

- Case-study URL: HTTP 200
- Homepage project link: present and resolves to the case-study route
- Sitemap: route present at `https://www.sherazdevsolutions.com/sitemap.xml`
- Canonical: `https://www.sherazdevsolutions.com/case-studies/wildlife-detection/`
- Article JSON-LD: valid; headline matches the public title
- Existing Person/WebSite/ProfilePage JSON-LD: present
- Architecture SVG: HTTP 200
- Live text scan: passed; no client, contract, milestone or unsupported ownership claims
- Desktop rendering: inspected
- 390px mobile rendering: inspected
- GPTBot and ClaudeBot policy: unchanged

## Tests

- `npm test`: 31 passed
- `npm run build`: passed
- TypeScript: passed during build
- `git diff --check`: passed
- Sitemap smoke test updated for six URLs and passed

## Search Console status

Connected property: `sc-domain:sherazdevsolutions.com`.

The read-only Search Console connector returned no Search Analytics row for the new case-study URL in the 2026-11-01 through 2026-11-23 window. This is expected immediately after release and is not proof of a coverage state. URL Inspection/indexing-request actions are not exposed by the connected read-only connector, so no indexing request was submitted and no duplicate request was created.

## Next measurement

After Google has had time to crawl the URL, repeat the exact ten neutral hiring queries from the November 23 baseline using the same available search surface. Compare inclusion frequency, site citation frequency, Search Console impressions/clicks for this URL, and qualified inquiries. Treat the result as an observation window, not proof of stable AI ranking improvement.
