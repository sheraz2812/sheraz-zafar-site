import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const services = {
  'product-engineering': {
    title: 'Product engineering for SaaS teams',
    summary: 'Senior product engineering across frontend, backend, APIs, data, and cloud delivery for teams building or extending SaaS products.',
    detail: 'Sheraz Zafar works across product requirements and implementation: mapping domain workflows, shaping application boundaries, delivering user-facing features, and accounting for integration and operational behavior.',
    fit: 'Useful when a team needs an experienced engineer to own a defined product area, extend an existing SaaS platform, or deliver a cross-layer workflow.',
    keywords: 'SaaS product engineering, full-stack product engineer, Next.js, React, TypeScript, Node.js, NestJS, Laravel, Django, PostgreSQL',
  },
  'ai-integration': {
    title: 'AI integration and retrieval systems',
    summary: 'Practical AI product integration for document workflows, retrieval, extraction, and business applications.',
    detail: 'The work connects ingestion, parsing, metadata, retrieval, model calls, and product controls. The goal is a maintainable workflow with explicit boundaries, useful context, and human review where the product needs it.',
    fit: 'Useful when a product team needs to add document intelligence or retrieval to an existing application, or needs technical discovery before committing to an AI workflow.',
    keywords: 'AI integration engineer, RAG, retrieval augmented generation, LangChain, Pinecone, OpenAI API, Python, document intelligence',
  },
  'production-reliability': {
    title: 'Production reliability and systems engineering',
    summary: 'Engineering support for production workflows, distributed features, integrations, and reliability issues.',
    detail: 'Work starts by tracing state, ownership, retries, and failure paths across application boundaries. Improvements can span APIs, queues, realtime updates, data consistency, deployment, and operational handover.',
    fit: 'Useful when a system has hard-to-reproduce production behavior, brittle integrations, queue or realtime complexity, or needs a bounded reliability improvement.',
    keywords: 'production engineer, systems engineer, reliability engineering, Node.js, NestJS, Redis, BullMQ, WebSockets, PostgreSQL, Docker, AWS',
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
  const url = `https://sherazdevsolutions.com/services/${service}/`;
  const schema = {
    '@context': 'https://schema.org', '@type': 'Service', name: item.title,
    serviceType: item.title, description: item.summary, url,
    provider: { '@type': 'Person', name: 'Sheraz Zafar', url: 'https://sherazdevsolutions.com/' },
    areaServed: 'Worldwide',
  };
  return <main className="service-page">
    <nav className="service-nav"><Link href="/">Sheraz Zafar</Link><Link href="/#contact">Discuss a project →</Link></nav>
    <article>
      <span className="section-index">ENGINEERING SERVICES / {service.replaceAll('-', ' ').toUpperCase()}</span>
      <h1>{item.title}</h1>
      <p className="service-lead">{item.summary}</p>
      <h2>How I can help</h2><p>{item.detail}</p>
      <h2>When this is a fit</h2><p>{item.fit}</p>
      <h2>Relevant experience</h2><p>Five years of full-stack product engineering across SaaS, AI-enabled workflows, integrations, realtime features, and production systems. My background includes React, Next.js, TypeScript, Node.js, NestJS, Laravel/PHP, Python/Django, PostgreSQL, MongoDB, Redis, Docker, and cloud delivery.</p>
      <Link className="cta-primary" href="/#contact">Tell me about your project →</Link>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  </main>;
}
