# Competitor evidence matrix

Initial public-web audit started 2026-11-23. This document records observable claims and proof patterns; it does not treat marketing claims as independently verified facts. Desktop/mobile visual captures are to be added during the browser QA pass.

| Site | Positioning observed | Evidence / conversion pattern | Useful pattern | Caution |
|---|---|---|---|---|
| [Adeel Irshad](https://adeelirshad.com/) | Senior software and AI engineer; backend, systems, AI, cloud and observability | Searchable work index with filters by capability, industry, language and tool; project inventory is extensive | Make work discoverable by problem and system area | A large taxonomy can overwhelm unless each item has substantive proof |
| [Asad Akmal](https://www.asadakmal.com/) | Team Lead / Full-Stack Engineer; AI SaaS, RAG and LLM agents | Specific leadership and product-ownership language; GitHub, LinkedIn and CV links; client/project counts | State role, scope, stack and engagement geography in the hero | Numeric claims need supporting public evidence |
| [Anshuman Verma](https://www.anshumanverma.com/) | Freelance AI and full-stack developer; production AI systems | Case-study cards describe architecture decisions such as hybrid search, citations, re-embedding and RLS; video links | Explain what makes a project production-grade, not just the stack | Avoid copying exact metrics or product claims without source artifacts |
| [Muhammad Usman](https://usmancodes.netlify.app/) | Full-stack and AI/ML engineer | Broad technology inventory, journey narrative and AI-twin interaction | Show a coherent technical journey and searchable skills | Placeholder-looking counters and overly broad skill lists weaken trust |
| [Adarsh Verma](https://www.avwithai.com/) | Full-stack AI engineer and systems architect | Public GitHub repository count, client/project claims, live apps and freelance CTA | Pair systems specialization with public repositories and shipped-app links | Client/project totals must be auditable or qualified |
| [Prayas Jain](https://prayas17.github.io/portfolio/) | Applied / forward-deployed / full-stack AI engineer | Clear production-AI philosophy; discusses retrieval quality, evaluation and graceful failure | Use engineering principles to distinguish production work from demos | Principles should connect to concrete case-study evidence |
| [Muhammad Sohaib](https://shipwithsohaib.com/) | Freelance full-stack and AI engineer | Services, work, demos, blog, multilingual navigation and direct project CTA; named teams | Make the engagement path and service boundaries obvious | Testimonials, guarantees and client logos require permission/evidence |
| [Danish Ahmed](https://danish-ahmed-head.github.io/) | Full-stack, AI and LLM systems engineer | Explicit end-to-end delivery language; expertise matrix; CV and contact CTA | Describe database/security/deployment/test ownership plainly | Claims about client geography and shipped systems need artifacts where possible |
| [Ibrahim Salman](https://ibrahimsalman.vercel.app/hire) | Hire page for RAG, OCR and automation | Concrete engagement terms, location, payment model and a public test count; service pages link to case studies | A focused hire page can reduce ambiguity for independent work | Payment terms and test counts must remain current and accurate |
| [Amar Sohail](https://amarsohail.com/) | AI engineer and AI architect | Services, work, writing, FAQ, booking CTA, Upwork and CV; named organizations and testimonial | Strong proof/CTA ecosystem around a clear AI-specialist identity | Published testimonials and client logos require authorization |

## Cross-competitor patterns

- Strongest positioning names the production outcome and ownership model before listing technologies.
- The most convincing proof is project-specific: architecture decisions, failure handling, tests, demos, public repositories, videos or case studies.
- Contract conversion is explicit: start a project, send a brief, book a call, or discuss a fixed-scope engagement.
- Broad stacks are common, but unsupported counters, guarantees, testimonials or client logos can reduce credibility.

## Sheraz baseline

The live homepage currently communicates senior software and systems engineering, production focus, SaaS/workflow/AI scope, generalized confidential work, and a project CTA. The repository already contains an evidence ledger, one detailed case study, service routes, structured Person data, sitemap, robots rules and `llms.txt`. The primary gap is breadth and depth of independently verifiable project evidence, not a need for more unsupported positioning.

## Capture checklist

- [ ] Desktop screenshot for each competitor
- [ ] Mobile screenshot for each competitor
- [ ] Project/case-study screenshot samples
- [ ] Sheraz desktop/mobile before screenshots
- [ ] Link and metadata verification recorded with dates

## Visual baseline observed

- Sheraz production desktop homepage was visually inspected 2026-11-23 at the live `/#journey` state. The dark journey section, timeline hierarchy, navigation, contact CTA, and explicit employment/freelance overlap wording were visible and legible.
- The capture was a viewport screenshot rather than a saved file artifact; a persistent before/after image pair still requires an approved local screenshot workflow.

## Metadata snapshot

Fetched 2026-11-23. `JSON-LD blocks` is a structural count from the public HTML, not a quality judgment.

| Site | Title / H1 signal | Description signal | Canonical | JSON-LD blocks |
|---|---|---|---|---:|
| Adeel Irshad | AI and backend engineer / builds AI products and backends | AI products, APIs, apps and cloud | Not found by snapshot parser | 0 |
| Asad Akmal | Team Lead / Full-Stack Engineer / named person | AI SaaS, RAG, agents, Next.js and NestJS | Present | 8 |
| Anshuman Verma | Freelance AI & full-stack / production AI systems | RAG, agents, SaaS, remote | Present | 2 |
| Muhammad Usman | Full-stack & AI/ML / named person | RAG, LLM systems, shipped projects | Present | 1 |
| Adarsh Verma | Autonomous agents and concurrent systems | MCP, agents, Rust distributed systems | Not found by snapshot parser | 1 |
| Prayas Jain | AI / applied / forward-deployed / full-stack AI | Production LLM systems, RAG and agents | Present | 3 |
| Muhammad Sohaib | Freelance full-stack & AI engineer | Web apps, SaaS and AI features | Present | 4 |
| Danish Ahmed | Full-stack & AI engineer / additional business heading | Production software, e-commerce, LLM and automation | Not found by snapshot parser | 0 |
| Ibrahim Salman | Hire page / RAG and automation | Fixed-scope websites, RAG and monitors | Present | 6 |
| Amar Sohail | Freelance AI engineer & architect / production AI systems | AI, models, vision, NLP, MLOps and GPUs | Present | 4 |
| Sheraz Zafar | Senior software & systems / holds up in production | SaaS, workflows, AI integrations and production systems | Present | 2 |

The snapshot parser is intentionally simple and may miss malformed or dynamically generated tags; it should not replace a validator. The useful comparison is that Sheraz's title, description, H1 and canonical are already aligned. The remaining discoverability opportunity is richer, verifiable page-level evidence rather than more keyword-heavy metadata.
