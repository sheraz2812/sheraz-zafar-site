'use client';

import { useMemo, useState } from 'react';
import type { CaseStudy, ExecutionPathKey } from '../../lib/case-studies';

type View = 'system' | 'flow' | 'state' | 'failure';
type Path = ExecutionPathKey;

export default function ArchitectureExplorer({ example }: { example: CaseStudy }) {
  const [view, setView] = useState<View>('system');
  const [selected, setSelected] = useState<string>('order');
  const [path, setPath] = useState<Path>('approved');
  const current = useMemo(() => example.architecture.find((item) => item.id === selected) ?? example.architecture[1], [example.architecture, selected]);

  return <div className="case-explorer">
    <div className="explorer-toolbar" role="group" aria-label="Choose architecture view">
      <button type="button" aria-pressed={view === 'system'} onClick={() => setView('system')}>System map</button>
      <button type="button" aria-pressed={view === 'flow'} onClick={() => setView('flow')}>Execution flow</button>
      <button type="button" aria-pressed={view === 'state'} onClick={() => setView('state')}>State path</button>
      <button type="button" aria-pressed={view === 'failure'} onClick={() => setView('failure')}>Failure analysis</button>
      <button type="button" className="explorer-reset" onClick={() => { setView('system'); setSelected('order'); setPath('approved'); }}>Reset view</button>
    </div>

    {view === 'system' && <div className="system-map-layout">
      <div className="system-map" aria-label="Illustrative order and inventory system map">
        <div className="map-lanes">{['REQUEST', 'APPLICATION', 'STATE OWNERS', 'EXTERNAL SYSTEM', 'OPERATIONS'].map((group) => <div className="map-group" key={group}><span>{group}</span>{example.architecture.filter((item) => item.group === group).map((item) => <button key={item.id} className={selected === item.id ? 'system-node selected' : 'system-node'} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id}><b>{item.label}</b><small>{item.short}</small></button>)}</div>)}</div>
        <div className="map-edges" aria-label="Conceptual relationships"><span>REQUEST → ORDER LIFECYCLE</span><span>ORDER ↔ STOCK / PAYMENT OUTCOMES</span><span>UNRESOLVED STATE → OPERATIONS REVIEW</span></div>
        <p className="map-caption">ILLUSTRATIVE BOUNDARIES · NOT A CLIENT DEPLOYMENT DIAGRAM</p>
      </div>
      <aside className="component-inspector" aria-live="polite"><span className="inspector-kicker">{current.group} / COMPONENT DETAIL</span><h3>{current.label}</h3><p>{current.description}</p><dl><dt>Inputs</dt><dd>{current.inputs}</dd><dt>Outputs</dt><dd>{current.outputs}</dd><dt>Failure boundary</dt><dd>{current.boundary}</dd></dl><p className="keyboard-note">Select any diagram node to inspect it. Nodes work with keyboard focus and Enter or Space.</p></aside>
    </div>}

    {view === 'flow' && <section className="flow-view" aria-label="Illustrative execution sequence">
      <div className="path-tabs" role="group" aria-label="Choose payment outcome">{(Object.keys(example.executionPaths) as Path[]).map((key) => <button type="button" key={key} aria-pressed={path === key} onClick={() => setPath(key)}>{example.executionPaths[key].label}</button>)}</div>
      <div className="sequence-header"><span>BUYER</span><span>ORDER</span><span>INVENTORY</span><span>PAYMENT</span><span>OPERATIONS</span></div>
      <ol className="sequence-steps">{example.executionPaths[path].steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
      <p className="sequence-result"><b>{example.executionPaths[path].result}</b><br/>{example.executionPaths[path].note}</p>
    </section>}

    {view === 'state' && <section className="state-view" aria-label="Illustrative order state model"><p className="failure-intro">One possible order lifecycle. Transitions and expiry rules must be confirmed against the real product domain before implementation.</p><ol className="state-path">{example.lifecycle.map(({name,description}, index) => <li key={name}><span className="state-index">0{index + 1}</span><div><b>{name}</b><p>{description}</p></div></li>)}</ol><div className="state-guardrail"><b>State invariant to discuss</b><p>A repeated or delayed external event should not make an order move backward or apply the same inventory effect twice.</p></div></section>}

    {view === 'failure' && <section className="failure-view" aria-label="Potential failure modes and recovery questions"><p className="failure-intro">These are design questions for a generalized system. They are not claims that a particular client system used these mechanisms.</p><div className="failure-list">{example.failureModes.map(({title,description}, index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>}
  </div>;
}
