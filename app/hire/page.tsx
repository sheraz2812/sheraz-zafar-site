import type { Metadata } from 'next';
import Link from 'next/link';

const title = 'Hire Sheraz Zafar | Independent Software & Systems Engineer';
const description = 'Remote engineering engagements for SaaS teams that need a scoped feature, a grounded AI integration, or help diagnosing production software.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/hire/' },
  openGraph: { title, description, url: '/hire/', type: 'website' },
};

export default function HirePage() {
  return (
    <main className="service-page">
      <nav className="service-nav" aria-label="Hiring navigation">
        <Link href="/">Sheraz Zafar</Link>
        <Link href="/#contact" data-analytics-contact="form">Discuss a project →</Link>
      </nav>
      <article>
        <h1>Hire an independent software and systems engineer</h1>
        <p className="service-lead">I’m Sheraz Zafar. I work remotely with SaaS teams that need someone to own a defined engineering problem from discovery through handover. I’m based in Pakistan and discuss scheduling and availability when we scope the work.</p>
        <h2>Choose a starting point</h2>
        <dl>
          <dt><strong>Paid technical discovery</strong></dt>
          <dd>Useful when the scope is unclear. Expect a workflow map, key risks and decisions, and a proposed first implementation with acceptance criteria.</dd>
          <dt><strong>Scoped feature delivery</strong></dt>
          <dd>Useful when you know what needs to change. Agree on a first slice, reviewable code, validation steps and handover notes before implementation.</dd>
          <dt><strong>Production investigation</strong></dt>
          <dd>Useful when symptoms are recurring or hard to reproduce. Bring a sanitized timeline. Expect findings tied to evidence, plus a prioritized correction or remediation plan.</dd>
        </dl>
        <h2>Find the closest match</h2>
        <ul>
          <li><Link href="/services/product-engineering/">Product engineering</Link> for a Next.js or Node.js workflow involving UI, APIs, permissions or persisted state.</li>
          <li><Link href="/services/ai-integration/">AI integration</Link> for document retrieval, cited answers and practical review controls.</li>
          <li><Link href="/services/production-reliability/">Production reliability</Link> for retries, background jobs, integrations and data consistency.</li>
        </ul>
        <h2>Review the engineering evidence</h2>
        <ul>
          <li><Link href="/case-studies/order-inventory-consistency/">Payment and inventory consistency</Link> explains the state transitions and links to a runnable public model and tests.</li>
          <li><a href="https://github.com/sheraz-zafar/cited-document-retrieval-reference">Cited document retrieval reference</a> demonstrates ranked passages, citations and abstention on synthetic fixtures.</li>
        </ul>
        <h2>What to send</h2>
        <p>Share what users need to do, what happens today, your stack, the timing constraint, and what a successful first step looks like. A short sanitized example is enough for a first conversation.</p>
        <Link className="cta-primary" href="/#contact" data-analytics-contact="form">Tell me about your project →</Link>
      </article>
    </main>
  );
}
