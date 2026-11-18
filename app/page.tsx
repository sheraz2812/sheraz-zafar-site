const capabilities = [
  ['Product systems', 'Turn ambiguous product ideas into reliable workflows, clear boundaries, and software teams can operate.'],
  ['SaaS platforms', 'Build the multi-tenant foundations, billing, permissions, dashboards, and integrations that survive real usage.'],
  ['AI in production', 'Use LLMs, RAG, agents, and automation where they create leverage—inside systems with controls and observability.'],
  ['Real-time infrastructure', 'Design event-driven products with queues, WebSockets, WebRTC, media pipelines, and resilient recovery paths.'],
];

const systems = [
  ['01', 'Architecture', 'A system map that makes the hard parts visible before implementation starts.'],
  ['02', 'Execution', 'Focused product engineering across frontend, backend, data, integrations, and deployment.'],
  ['03', 'Ownership', 'Production-minded decisions, useful diagnostics, and a handoff your team can actually maintain.'],
];

const stack = ['React', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'Python', 'Django', 'Laravel', 'PHP', 'PostgreSQL', 'MongoDB', 'Redis', 'BullMQ', 'Docker', 'AWS', 'WebSockets', 'WebRTC', 'LangChain', 'Pinecone', 'OpenAI', 'YOLO', 'FFmpeg'];

export default function Home() {
  return (
    <main>
      <nav className="nav shell">
        <a className="wordmark" href="#top"><span>SZ</span><em>Shiraz Zafar</em></a>
        <div className="nav-links"><a href="#work">Selected work</a><a href="#approach">Approach</a><a href="#contact">Contact</a></div>
        <a className="nav-cta" href="mailto:Shiraz.Zafar148@gmail.com">Start a conversation <span>↗</span></a>
      </nav>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">PRODUCT &amp; SYSTEMS ENGINEER <span>•</span> PAKISTAN / WORLDWIDE</p>
          <h1>I build the systems<br /><i>after the demo.</i></h1>
          <p className="hero-lede">I take ambitious products past the prototype: into the part where real users, real data, real integrations, and failure paths start asking difficult questions.</p>
          <div className="hero-actions"><a className="button button-dark" href="#work">See the work <span>↓</span></a><a className="text-link" href="https://www.linkedin.com/in/shiraz-zafar/" target="_blank">LinkedIn <span>↗</span></a></div>
        </div>
        <div className="hero-aside">
          <div className="portrait"><div className="portrait-grid" /><strong>SZ</strong><small>SHIRAZ<br />ZAFAR</small></div>
          <p className="aside-note">Senior engineering for founders and teams who need the product to become dependable—not just impressive.</p>
          <div className="availability"><span /> Available for select engagements <b>2026</b></div>
        </div>
      </section>

      <section className="signal-band"><div className="shell signal-inner"><p>52+ completed client engagements across SaaS, AI, enterprise workflows, and real-time systems.</p><p>One engineer across the full product boundary.</p></div></section>

      <section id="work" className="section shell">
        <div className="section-intro"><p className="eyebrow">WHAT I WORK ON</p><h2>Complex software,<br /><i>made legible.</i></h2></div>
        <div className="capability-grid">{capabilities.map(([title, body]) => <article className="capability" key={title}><span className="line-mark" /><h3>{title}</h3><p>{body}</p><span className="arrow">↗</span></article>)}</div>
      </section>

      <section className="proof-section"><div className="shell proof-grid"><div><p className="eyebrow">WHAT THAT MEANS IN PRACTICE</p><h2>Not another<br /><i>feature factory.</i></h2></div><div className="proof-copy"><p>I have worked across the whole path: shaping product decisions, designing architecture, building interfaces, writing APIs, connecting third-party systems, debugging production failures, and deploying the result.</p><p>The differentiator is not a longer list of tools. It is being able to see how a decision in one layer changes the behavior of the whole system.</p><div className="proof-metrics"><div><strong>01</strong><span>Product thinking<br />inside engineering</span></div><div><strong>02</strong><span>Full-stack depth<br />without silos</span></div><div><strong>03</strong><span>Production ownership<br />after launch</span></div></div></div></div></section>

      <section className="case-section"><div className="shell case-grid"><div><p className="eyebrow">A RECENT PATTERN</p><h2>When “working” is<br /><i>not enough.</i></h2></div><div className="case-copy"><p className="case-kicker">PRODUCTION REALITY</p><p>A payment fails after inventory is reserved. A webhook arrives twice. A background job runs again after a restart. An API works locally and times out under real traffic.</p><p>These are not edge cases. They are part of the product. My work is making those failure paths explicit: clear state transitions, safe retries, useful diagnostics, and recovery that the team can understand.</p><a className="text-link light" href="mailto:Shiraz.Zafar148@gmail.com">Bring me the hard part <span>↗</span></a></div></div></section>

      <section id="approach" className="section shell approach-section"><div className="section-intro"><p className="eyebrow">HOW I CONTRIBUTE</p><h2>Depth without<br /><i>the theatre.</i></h2><p className="intro-copy">I work across the product boundary: understanding the business constraint, shaping the system, building the critical path, and leaving the team with something they can own.</p></div><div className="systems-list">{systems.map(([num, title, body]) => <div className="system-row" key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p></div>)}</div></section>

      <section className="stack-section"><div className="shell"><p className="eyebrow">TOOLS ARE CONTEXT</p><h2>The stack follows<br /><i>the problem.</i></h2><div className="stack-cloud">{stack.map((item, i) => <span className={i % 5 === 0 ? 'accent' : ''} key={item}>{item}</span>)}</div></div></section>

      <section id="contact" className="contact-section shell"><p className="eyebrow">LET’S TALK ABOUT THE WORK</p><h2>Have a system that<br /><i>needs to hold?</i></h2><div className="contact-bottom"><p>For product engineering, architecture, rescue work, or a serious second opinion.</p><a className="button button-light" href="mailto:sherazzafar148@gmail.com">Email Shiraz <span>↗</span></a></div><div className="contact-links"><a href="mailto:sherazzafar148@gmail.com">sherazzafar148@gmail.com</a><a href="https://github.com/sheraz-zafar" target="_blank">github.com/sheraz-zafar</a><a href="https://www.linkedin.com/in/shiraz-zafar/" target="_blank">linkedin.com/in/shiraz-zafar</a></div></section>

      <footer className="footer shell"><span>© 2026 Shiraz Zafar</span><span>Product &amp; Systems Engineering</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
