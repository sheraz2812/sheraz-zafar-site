import type { Metadata } from 'next';
import Link from 'next/link';
import ArchitectureExplorer from '../../../components/architecture/architecture-explorer';
import { orderInventoryAnalysis } from '../../../lib/case-studies';
import { siteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: 'Payment & Inventory Consistency | Illustrative Engineering Analysis | Sheraz Zafar',
  description: 'Explore an interactive, explicitly illustrative architecture analysis of order, payment, and inventory state consistency, failure paths, and engineering trade-offs.',
  alternates: { canonical: `${siteUrl}/case-studies/${orderInventoryAnalysis.slug}/` },
  openGraph: {
    title: 'Payment & Inventory Consistency — Engineering Analysis',
    description: orderInventoryAnalysis.summary,
    url: `${siteUrl}/case-studies/${orderInventoryAnalysis.slug}/`,
    type: 'article',
  },
};

export default function CaseStudyPage() {
  const item = orderInventoryAnalysis;
  const pageUrl = `${siteUrl}/case-studies/${item.slug}/`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: item.title,
    description: item.summary,
    author: { '@id': `${siteUrl}/#person` },
    mainEntityOfPage: { '@id': pageUrl },
    about: ['Order management', 'Payment processing', 'Inventory consistency', 'Reliability engineering'],
    genre: 'Illustrative engineering analysis',
  };

  return <main className="case-page">
    <header className="case-masthead"><Link className="case-brand" href="/">/ SHERAZ ZAFAR</Link><nav aria-label="Case study navigation"><Link href="/#work">Work</Link><Link href="/#services">Services</Link><Link className="case-nav-cta" href="/#contact" data-analytics-contact="form">Discuss a project ↗</Link></nav></header>

    <section className="case-hero">
      <div className="case-hero-copy"><Link className="case-back" href="/#investigations">← Back to engineering work</Link><p className="case-eyebrow">{item.eyebrow}</p><h1>{item.title}</h1><p className="case-lead">{item.summary}</p><div className="case-tags"><span>Payment consistency</span><span>Inventory lifecycle</span><span>Failure recovery</span></div></div>
      <aside className="evidence-banner" aria-label="Publication and evidence status"><span className="evidence-mark">ILLUSTRATIVE</span><h2>This is an engineering analysis, not a client project report.</h2><p>{item.caveat}</p><dl><div><dt>Evidence</dt><dd>Illustrative model</dd></div><div><dt>Delivery</dt><dd>Not a shipped project</dd></div><div><dt>Client topology</dt><dd>Not represented</dd></div></dl></aside>
    </section>

    <section className="business-view" aria-labelledby="business-title"><div className="case-section-kicker">01 / BUSINESS VIEW</div><div className="business-content"><h2 id="business-title">One checkout.<br/><em>Several sources of truth.</em></h2><div><p>{item.problem}</p><div className="role-statement"><b>What this page demonstrates</b><span>{item.role}</span></div></div></div><div className="scope-strip"><span>ENGINEERING QUESTIONS</span>{item.scope.map((scope) => <span key={scope}>{scope}</span>)}</div></section>

    <section className="deep-dive" aria-labelledby="deep-dive-title"><div className="case-section-kicker">02 / ENGINEERING DEEP DIVE</div><div className="deep-dive-heading"><h2 id="deep-dive-title">Explore the boundaries,<br/><em>then follow the state.</em></h2><p>Choose a system component, execution outcome, lifecycle view, or failure scenario. Every diagram on this page is an illustrative reference—not a representation of a particular production deployment.</p></div><ArchitectureExplorer example={item}/></section>

    <section className="decisions-section"><div className="case-section-kicker">03 / ENGINEERING DECISIONS</div><div className="decisions-heading"><h2>Trade-offs belong<br/><em>in the design.</em></h2><p>These are reasoned options for the generalized problem. They are not historical architecture decision records from a client engagement.</p></div><div className="decision-list">{item.decisions.map((decision, index) => <article className="decision-card" key={decision.question}><span className="decision-index">0{index + 1} / ILLUSTRATIVE</span><h3>{decision.question}</h3><div className="decision-options"><div><b>Option A</b><span>{decision.options[0]}</span></div><div><b>Option B</b><span>{decision.options[1]}</span></div></div><p className="decision-selection">{decision.selected}</p><p>{decision.tradeoff}</p></article>)}</div></section>

    <section className="production-section"><div className="case-section-kicker">04 / PRODUCTION CONSIDERATIONS</div><h2>Make uncertainty<br/><em>operable.</em></h2><div className="production-grid">{item.productionConcerns.map((concern) => <article key={concern.title}><h3>{concern.title}</h3><p>{concern.description}</p></article>)}</div><p className="production-disclaimer">These are design considerations for the example. This page does not claim that any specific client implementation includes them.</p></section>

    <section className="validation-section" id="validation" aria-labelledby="validation-title"><div className="case-section-kicker">05 / REFERENCE MODEL CHECKS</div><h2 id="validation-title">Test the transitions<br/><em>that carry risk.</em></h2><p className="validation-intro">A small executable state model accompanies this illustrative analysis. Its automated checks cover the model's declared invariants only; they do not test a payment provider, database durability, production concurrency, or any client deployment.</p><div className="validation-grid"><article><span>01 / DUPLICATE SIGNAL</span><h3>One provider event, one transition</h3><p>Reapplying the same event id leaves a confirmed order and committed reservation unchanged.</p></article><article><span>02 / UNKNOWN OUTCOME</span><h3>Timeout is not decline</h3><p>A payment timeout leaves the order unresolved and the reservation held until reconciliation resolves it.</p></article><article><span>03 / DECLINED PAYMENT</span><h3>Release without reversal</h3><p>A decline releases the held reservation. A later approval cannot reverse the terminal reference state.</p></article><article><span>04 / EVENT ORDER</span><h3>Reject invalid transitions</h3><p>An approval received before a payment request does not mutate the draft order.</p></article></div><p className="validation-boundary">VALIDATION BOUNDARY · Deterministic reference-model tests pass locally. No external integration or production behavior is implied.</p><div className="source-proof"><p><b>Inspect the evidence</b> The public source and tests show exactly which transitions this reference model exercises.</p><a href="https://github.com/sheraz2812/sheraz-zafar-site/blob/main/lib/order-inventory-model.mjs" target="_blank" rel="noreferrer">Read the state model <span aria-hidden="true">↗</span></a><a href="https://github.com/sheraz2812/sheraz-zafar-site/blob/main/tests/order-inventory-model.test.mjs" target="_blank" rel="noreferrer">Read the regression tests <span aria-hidden="true">↗</span></a></div></section>

    <section className="reflection-section"><div className="case-section-kicker">06 / LIMITATIONS &amp; REFLECTION</div><div className="reflection-grid"><div><h2>Useful models<br/><em>show their limits.</em></h2><p>A sequence can make responsibilities legible, but cannot prove atomicity between separate systems. A real design still needs provider semantics, domain rules, concurrency guarantees, operational ownership, and evidence from implementation.</p></div><div><h3>What this analysis makes visible</h3><ul>{item.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul><h3>What it cannot establish</h3><ul>{item.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></div></div></section>

    <section className="case-contact"><div><span className="case-section-kicker">ENGINEERING WORK / SHERAZ ZAFAR</span><h2>Working through a<br/><em>similar system problem?</em></h2><p>Share the workflow, the failure mode, and what is still uncertain. We can scope the right engineering investigation together.</p></div><Link href="/#contact" className="cta-primary" data-analytics-contact="form">Discuss a project ↗</Link></section>

    <footer className="case-footer"><Link href="/">Sheraz Zafar</Link><span>ILLUSTRATIVE SYSTEM ANALYSIS · NO CLIENT ARCHITECTURE REPRODUCED</span><Link href="/#top">Back to portfolio ↑</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  </main>;
}
