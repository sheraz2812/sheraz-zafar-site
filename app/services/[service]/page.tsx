import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteUrl } from '../../../lib/site';

const modelSource = 'https://github.com/sheraz2812/sheraz-zafar-site/blob/712ed8dcf7cb4bbdea6ba97d5919839459810a1c';
const paymentEvidence = [
  { href: '/case-studies/order-inventory-consistency/', label: 'Read the payment and inventory consistency analysis' },
  { href: `${modelSource}/lib/order-inventory-model.mjs`, label: 'Inspect the public state model' },
  { href: `${modelSource}/tests/order-inventory-model.test.mjs`, label: 'Inspect the regression tests' },
];

const services = {
  'product-engineering': {
    title: 'Product engineering for SaaS teams',
    summary: 'Senior product engineering across frontend, backend, APIs, data, and cloud delivery for teams building or extending SaaS products.',
    detail: 'Sheraz Zafar works across product requirements and implementation: mapping domain workflows, shaping application boundaries, delivering user-facing features, and accounting for integration and operational behavior.',
    fit: 'Useful when a team needs an experienced engineer to own a defined product area, extend an existing SaaS platform, or deliver a cross-layer workflow.',
    keywords: 'SaaS product engineering, full-stack product engineer, Next.js, React, TypeScript, Node.js, NestJS, Laravel, Django, PostgreSQL',
    scope: ['Clarify the user workflow, product constraints, and the boundaries of the agreed feature.', 'Implement the selected frontend, backend, API, and data changes in the existing product.', 'Review edge cases and leave the feature understandable for the team taking it forward.'],
    deliverables: ['A written scope and implementation direction.', 'Agreed code changes with relevant validation notes.', 'A concise handover covering decisions, open risks, and next steps.'],
    boundary: 'Work is scoped to one agreed product area or feature. A broader rebuild, unrelated backlog items, or ongoing maintenance are separate scope unless agreed before work starts.',
    start: 'Start with paid technical discovery for an unclear workflow, or a scoped implementation when acceptance criteria are ready. Bring the user journey, current stack and release constraints.',
    expertise: 'For React and Next.js interfaces backed by TypeScript, Node.js or NestJS APIs and PostgreSQL, I can trace the workflow across the UI, API contracts and persisted state. Fit includes checkout, permissions and operational workflows where a change touches several layers.',
    evidenceNote: 'The public example uses explicit state transitions to coordinate payment and inventory. Tests cover duplicate callbacks, payment timeouts, declined payments and out-of-order events. The executable model is illustrative and provides no validation of a production integration.',
    evidence: paymentEvidence,
  },
  'ai-integration': {
    title: 'AI integration and retrieval systems',
    summary: 'Practical AI product integration for document workflows, retrieval, extraction, and business applications.',
    detail: 'The work connects ingestion, parsing, metadata, retrieval, model calls, and product controls. The goal is a maintainable workflow with explicit boundaries, useful context, and human review where the product needs it.',
    fit: 'Useful when a product team needs to add document intelligence or retrieval to an existing application, or needs technical discovery before committing to an AI workflow.',
    keywords: 'AI integration engineer, RAG, retrieval augmented generation, LangChain, Pinecone, OpenAI API, Python, document intelligence',
    scope: ['Map the input data, ingestion, retrieval, model, and user-facing steps for one agreed workflow.', 'Integrate the required AI or retrieval steps with the existing application boundaries.', 'Identify quality checks, failure behavior, and where human review is appropriate.'],
    deliverables: ['A bounded workflow design and integration plan.', 'Agreed implementation or technical discovery findings.', 'Validation examples, known limitations, and handover notes.'],
    boundary: 'Model output quality, vendor availability, and third-party usage costs depend on the selected providers and data. The work does not promise a particular accuracy, cost reduction, or business outcome.',
    start: 'Start with a paid feasibility review or scope one integration. Bring a permitted sample of your documents, representative questions and examples that should trigger human review or an insufficient-evidence response.',
    expertise: 'I help product teams add document search, cited answers or structured extraction to an existing application. A first slice can use a Python ingestion workflow, a searchable index with source metadata and an API connected to a Next.js review surface. Validate answer support, source visibility and missing-evidence behavior before expanding scope.',
    evidenceNote: 'The document architecture illustrates ingestion and retrieval. The Wildlife project documents a separate computer-vision implementation with reviewable evidence, a FastAPI backend and a Next.js dashboard. It illustrates an AI-to-product workflow, with no claim about retrieval accuracy or production deployment.',
    evidence: [
      { href: '/#architecture', label: 'See the document ingestion and retrieval architecture' },
      { href: '/case-studies/wildlife-detection/', label: 'Read the computer-vision event processing case study' },
    ],
  },
  'production-reliability': {
    title: 'Production reliability and systems engineering',
    summary: 'Engineering support for production workflows, distributed features, integrations, and reliability issues.',
    detail: 'Work starts by tracing state, ownership, retries, and failure paths across application boundaries. Improvements can span APIs, queues, realtime updates, data consistency, deployment, and operational handover.',
    fit: 'Useful when a system has hard-to-reproduce production behavior, brittle integrations, queue or realtime complexity, or needs a bounded reliability improvement.',
    keywords: 'production engineer, systems engineer, reliability engineering, Node.js, NestJS, Redis, BullMQ, WebSockets, PostgreSQL, Docker, AWS',
    scope: ['Trace the agreed failure or operational concern across relevant state, APIs, queues, integrations, and retries.', 'Separate confirmed behavior from assumptions and identify the smallest safe change.', 'Implement a bounded correction or provide a prioritized remediation plan.'],
    deliverables: ['A concise findings summary with evidence and remaining unknowns.', 'Agreed code or configuration changes, or a prioritized remediation plan.', 'Reproduction or validation steps and an operational handover note.'],
    boundary: 'Investigation is limited to the system areas and access agreed at the start. 24/7 incident response, uptime guarantees, and work outside the scoped issue require a separate agreement.',
    start: 'Start with a bounded production investigation or a scoped remediation. Bring a sanitized incident timeline, observed versus expected behavior and any relevant logs or traces.',
    expertise: 'I help engineering leads diagnose incidents such as duplicate webhook effects, stalled jobs, stale real-time state and mismatches between an API and its datastore. Relevant tools include Node.js, PostgreSQL, Redis, queues and event streams. I trace the state transitions and define an observable validation and rollback plan.',
    evidenceNote: 'The public reference keeps inventory reserved after a payment timeout while reconciliation resolves the unknown outcome. Its state model checks that duplicate callbacks and out-of-order events do not introduce invalid transitions. Provider behavior, database concurrency and production recovery are outside these tests.',
    evidence: paymentEvidence,
  },
} as const;

type ServiceKey = keyof typeof services;

export function generateStaticParams() {
  return Object.keys(services).map((service) => ({ service }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  if (!(service in services)) return {};
  const item = services[service as ServiceKey];
  const path = `/services/${service}/`;
  return {
    title: `${item.title} | Sheraz Zafar`,
    description: item.summary,
    keywords: item.keywords.split(', '),
    alternates: { canonical: path },
    openGraph: { title: `${item.title} | Sheraz Zafar`, description: item.summary, url: path, type: 'website' },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  if (!(service in services)) notFound();
  const item = services[service as ServiceKey];
  const url = `${siteUrl}/services/${service}/`;
  const schema = {
    '@context': 'https://schema.org', '@type': 'Service', '@id': `${url}#service`, name: item.title,
    serviceType: item.title, description: item.summary, url,
    provider: { '@id': `${siteUrl}/#person` },
    areaServed: 'Worldwide',
  };
  return <main className="service-page">
    <nav className="service-nav"><Link href="/">Sheraz Zafar</Link><Link href="/#contact" data-analytics-contact="form">Discuss a project →</Link></nav>
    <article>
      <span className="section-index">ENGINEERING SERVICES / {service.replaceAll('-', ' ').toUpperCase()}</span>
      <h1>{item.title}</h1>
      <p className="service-lead">{item.summary}</p>
      <h2>How I can help</h2><p>{item.detail}</p>
      <h2>When this is a fit</h2><p>{item.fit}</p>
      <h2>Scope and deliverables</h2><h3>Typical scope</h3><ul>{item.scope.map((point) => <li key={point}>{point}</li>)}</ul><h3>Expected deliverables</h3><ul>{item.deliverables.map((point) => <li key={point}>{point}</li>)}</ul>
      <h2>Engagement boundary</h2><p>{item.boundary}</p>
      <h2>Relevant technical expertise</h2><p>{item.expertise}</p>
      <h2>Engineering evidence</h2><p>{item.evidenceNote}</p>
      <ul>{item.evidence.map(({ href, label }) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
      <h2>How to start</h2><p>{item.start}</p>
      <Link className="cta-primary" href="/#contact" data-analytics-contact="form">Tell me about your project →</Link>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  </main>;
}
