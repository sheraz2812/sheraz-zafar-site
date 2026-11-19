# UX, credibility, accessibility, and trust review

Audit date: 2026-11-19. Review included fresh live navigation, local production preview, desktop and 425×705 mobile emulation, the interactive case-study controls, FAQ, and contact flow.

## UX observations

- Homepage and service page fit the inspected mobile viewport without horizontal overflow; titles and service rows wrap. The mobile header remains compact and the contact CTA is available.
- Hero portrait uses static 720px/960px WebP assets with the original crop preserved; browser selected the 720px derivative at 425px width and 960px at 1440px width.
- An existing browser tab showed old “PREPARE EMAIL” state, while a fresh navigation displayed “SEND INQUIRY”. Reopen or hard-refresh after deployment if an old tab persists.
- Case-study system map, outcome scenarios (approved, declined, provider timeout), and reset interaction work. Content is labeled illustrative and does not identify a real client.
- FAQ uses native `<details>` disclosure. It opens and exposes the answer text.
- The successful live form test showed a confirmation state. A client-side 18-second timeout and explicit failure feedback have been added locally for stalled requests.
- One browser console spot check showed no messages. This does not replace testing with a full browser/assistive-technology matrix.

## Accessibility review

- Keyboard focus indicators are present in CSS for links, controls, form elements, FAQ disclosure, and case-study interactions.
- Small muted text `#68727a` on paper `#f5f4ef` had approximately 4.46:1 contrast; the local token is now `#626c73` (~4.87:1).
- Small coral labels `#e45b43` on paper had approximately 3.25:1; a darker `#b9422f` token (~4.91:1) is used for affected small text on light backgrounds. Brand coral remains for backgrounds and large display treatments.
- Ratios are calculated from CSS colors; this is a targeted contrast correction, not a complete WCAG conformance audit. Focus outline contrast, every state, screen readers, zoom, reduced motion, and all color combinations still merit a dedicated pass.

## Credibility and confidentiality

- Current page copy describes systems/product engineering and avoids the obsolete guaranteed cost-reduction claim found in a stale search result.
- The public interactive case study is generalized, labeled illustrative, and does not name the confidential client. Its workflow is an explanatory scenario, not a claim of measured client results.
- No client-identifying details, project metrics, testimonials, certifications, or employment details were added by these changes.
- A prior Fiverr account review was reported in conversation, but its export/screenshot is not in the repository. The homepage omits this count until current evidence can verify it. Orders are not presented as unique clients or engagements.
- Service scope and deliverables added locally are descriptions of possible engagements, not assertions that each item was delivered for a past client.

## Contact trust and behavior

Safe live self-addressed submission succeeded. Two messages arrived at the owner account: a branded owner notification and a branded submitter receipt. SPF and DKIM passed. The owner notification includes the respondent address as Reply-To. No messages were sent to third parties. The final browser check confirmed required email/problem fields are invalid while empty; the form was not submitted. Timeout and non-JSON error behavior are covered by mocked Node tests, not forced against the live service.

## Security boundaries

Local Next config now supplies `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and a Permissions-Policy disabling camera, microphone, and geolocation. Production Vercel supplied HSTS during live inspection. A Content Security Policy was not added: a safe CSP for a Next-rendered app requires a careful nonce/hash strategy and should be handled separately rather than using a brittle blanket rule.
