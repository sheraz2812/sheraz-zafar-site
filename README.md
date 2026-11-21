# Sheraz Zafar — Product & Systems Engineering Portfolio

Public portfolio source for [sherazdevsolutions.com](https://www.sherazdevsolutions.com/). Built with Next.js App Router and TypeScript; deployed on Vercel.

## What this repository demonstrates

- Server-rendered portfolio and service pages with canonical metadata and structured data.
- An interactive, explicitly illustrative order/payment/inventory reference model. It is not a client deployment or a record of shipped architecture.
- Deterministic model tests for duplicate events, unresolved payment timeouts, declined payments, invalid event ordering, and required identifiers.
- A server-side contact endpoint that validates and rate-limits inquiry submissions before sending owner and sender emails through Resend. The website does not persist submissions.
- Optional, consent-gated GA4 events. Tracking remains disabled unless the provider and measurement ID are configured and the visitor opts in; event payloads use an allowlist and exclude submitted form values.

The interactive analysis and its tests are inspectable here:

- [`lib/order-inventory-model.mjs`](./lib/order-inventory-model.mjs)
- [`tests/order-inventory-model.test.mjs`](./tests/order-inventory-model.test.mjs)
- [Public interactive analysis](https://www.sherazdevsolutions.com/case-studies/order-inventory-consistency/)

These checks cover the deterministic reference model only. They do not establish payment-provider behavior, database durability, production concurrency, or client outcomes.

## Local development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npx tsc --noEmit
npm run build
```

The production smoke tests start the built Next.js server and check public routes, metadata, structured data, redirects, assets, and contact endpoint behavior.

## Contact email configuration

Set these server-side variables in Vercel:

- `RESEND_API_KEY` — Resend secret API key; never commit it.
- `CONTACT_FROM_EMAIL` — verified sender identity.
- `CONTACT_TO_EMAIL` — inquiry destination; defaults to `sherazzafar148@gmail.com`.

The sender domain must be verified in Resend and its required DNS records configured before email delivery can work. The form sends two transactional emails and does not store submissions in this website.

## Optional analytics configuration

- `NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...`

The measurement ID is public configuration, not a secret. The site does not load the GA tag until a visitor opts in. No form fields, email addresses, or query strings are included in analytics events. Leave these variables unset to keep analytics disabled.

## Public-content boundaries

Client names and identifying implementation details are generalized. Employment and independent work are shown separately, including their overlap. No client metrics, testimonials, or private architecture are asserted by the illustrative analysis.
