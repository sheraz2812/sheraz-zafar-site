export type EvidenceLevel = 'illustrative' | 'reported' | 'verified' | 'planned' | 'unknown';
export type PublicationStatus = 'public-safe' | 'private-review' | 'excluded';

export type ArchitectureComponent = {
  id: string;
  label: string;
  short: string;
  group: string;
  description: string;
  inputs: string;
  outputs: string;
  boundary: string;
};

export type ExecutionPathKey = 'approved' | 'declined' | 'unknown';
export type ExecutionPath = { label: string; result: string; steps: string[]; note: string };
export type FailureMode = { title: string; description: string };
export type LifecycleStep = { name: string; description: string };
export type EngineeringDecision = { question: string; options: [string, string]; selected: string; tradeoff: string };
export type ProductionConcern = { title: string; description: string };

export type CaseStudy = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  problem: string;
  role: string;
  scope: string[];
  technologies: string[];
  evidence: EvidenceLevel;
  publication: PublicationStatus;
  delivery: string;
  caveat: string;
  outcomes: string[];
  limitations: string[];
  architecture: ArchitectureComponent[];
  executionPaths: Record<ExecutionPathKey, ExecutionPath>;
  lifecycle: LifecycleStep[];
  failureModes: FailureMode[];
  decisions: EngineeringDecision[];
  productionConcerns: ProductionConcern[];
};

/** A public, independently generalized engineering analysis; not a record of a client's deployed system. */
export const orderInventoryAnalysis = {
  slug: 'order-inventory-consistency',
  title: 'Keeping order, payment, and inventory state consistent',
  eyebrow: 'ILLUSTRATIVE ENGINEERING ANALYSIS · COMMERCE SYSTEMS',
  summary: 'A practical model for reasoning about a common commerce failure: an order, a payment provider, and available stock can disagree when requests fail, arrive twice, or complete out of order.',
  problem: 'The engineering challenge is to make ownership of each state explicit and define what happens when an operation is only partly complete. A successful payment must not silently create an unfulfillable order; a delayed or duplicate callback must not create a second effect; and a failed authorization must not leave stock reserved forever.',
  role: 'This page is a generalized engineering analysis. It does not claim that the diagram is a client deployment or that Sheraz implemented every mechanism shown.',
  scope: ['Order lifecycle boundaries', 'Temporary inventory reservation', 'Payment authorization outcome', 'Idempotent state transitions as a design concern', 'Reconciliation and operator visibility'],
  technologies: ['Architecture concepts only', 'No client-specific stack is attributed'],
  evidence: 'illustrative',
  publication: 'public-safe',
  delivery: 'Illustrative model; not a shipped project or client case study.',
  caveat: 'The flow is independently generalized from recurring commerce reliability concerns. It intentionally omits proprietary business rules, client names, schemas, endpoints, infrastructure topology, and unverified implementation details.',
  outcomes: ['Makes state ownership and failure boundaries visible', 'Shows why payment, inventory, and order status need explicit coordination', 'Provides a basis for discussing trade-offs before selecting implementation details'],
  limitations: ['A diagram cannot establish transactional guarantees across independent services', 'Reservation expiry, compensation policy, and reconciliation ownership depend on product rules', 'No measured reliability, latency, scale, or financial outcome is claimed'],
  architecture: [
    { id: 'buyer', label: 'Buyer / client', short: 'Checkout intent', group: 'REQUEST', description: 'Starts checkout and receives the final order state.', inputs: 'Cart intent and payment action', outputs: 'Order confirmation or a recoverable message', boundary: 'The client can retry or abandon; repeated requests are expected behavior.' },
    { id: 'order', label: 'Order boundary', short: 'Coordinates lifecycle', group: 'APPLICATION', description: 'Owns the order lifecycle and coordinates the business operation.', inputs: 'Validated checkout request', outputs: 'Order state and a stable operation identifier', boundary: 'A timeout does not prove the operation failed; status may need to be queried.' },
    { id: 'inventory', label: 'Inventory authority', short: 'Reserve · commit · release', group: 'STATE OWNERS', description: 'Owns available quantity and temporary reservations.', inputs: 'Reservation request and release/commit decision', outputs: 'Reservation outcome and current stock state', boundary: 'Concurrent checkouts can race for the same remaining quantity.' },
    { id: 'payment', label: 'Payment provider', short: 'External, async outcome', group: 'EXTERNAL SYSTEM', description: 'Returns an authorization result and may notify asynchronously.', inputs: 'Payment authorization request', outputs: 'Approved, declined, delayed, or duplicate outcome', boundary: 'External callbacks can be delayed, repeated, or temporarily unavailable.' },
    { id: 'ledger', label: 'Order record', short: 'Explicit state history', group: 'STATE OWNERS', description: 'Persists the order and its explicit lifecycle transitions.', inputs: 'Validated transitions and provider references', outputs: 'Queryable current state and audit history', boundary: 'Cross-service writes are not one shared database transaction.' },
    { id: 'ops', label: 'Operations view', short: 'Exceptions · reconciliation', group: 'OPERATIONS', description: 'Makes unresolved and mismatched states visible for follow-up.', inputs: 'Order, reservation, and payment status', outputs: 'Reconciliation work and operator context', boundary: 'Automated retries need limits and a human path for unresolved cases.' },
  ],
  executionPaths: {
    approved: { label: 'Approved payment', result: 'Desired outcome: one confirmed order with stock committed once.', steps: ['Validate the checkout request and create a stable operation reference.', 'Request a temporary stock reservation; stop if stock cannot be reserved.', 'Authorize payment using the stable operation reference.', 'Record the provider outcome and advance the order through an explicit transition.', 'Commit the reservation after the business rule says the order is confirmed.', 'Expose the final status and retain enough history to reconcile later.'], note: 'This is a proposed reference flow; sequencing and transaction boundaries must be adapted to verified product rules.' },
    declined: { label: 'Declined payment', result: 'Desired outcome: the order is not confirmed and temporary stock is released safely.', steps: ['Receive a declined or failed authorization result.', 'Validate that it belongs to the same operation and has not already been applied.', 'Move the order to a recoverable failed-payment state.', 'Release the reservation once; repeated callbacks must not create duplicate effects.', 'Show a clear retry path without creating a second order unintentionally.'], note: 'Release timing and retry eligibility are product decisions; this example does not assert an existing implementation.' },
    unknown: { label: 'Provider timeout', result: 'Unknown outcome: do not treat a network timeout as proof that payment failed.', steps: ['Mark the payment attempt as unresolved rather than guessing its outcome.', 'Query or await a provider status signal using the original operation reference.', 'Keep reservation expiry explicit and prevent a second independent charge attempt.', 'Reconcile provider state against the order record after a bounded delay.', 'Escalate unresolved mismatches with enough context for an operator.'], note: 'A timeout creates uncertainty. Safe recovery depends on provider capabilities, reservation policy, and operational ownership.' },
  },
  lifecycle: [
    { name: 'Draft', description: 'Checkout intent is validated; no stock or payment outcome is assumed yet.' },
    { name: 'Reserved', description: 'A temporary stock hold exists under a clear expiry policy.' },
    { name: 'Payment pending', description: 'The provider outcome is not final; duplicate or late signals remain possible.' },
    { name: 'Confirmed', description: 'The confirmation rule is satisfied and stock is committed once.' },
    { name: 'Cancelled / expired', description: 'The order cannot proceed; any active reservation is released according to policy.' },
  ],
  failureModes: [
    { title: 'Duplicate callback', description: 'Use a stable provider event or operation key, check current state, and make transition effects idempotent.' },
    { title: 'Stock race', description: 'Make reservation conditional on current availability; define which component owns that atomic decision.' },
    { title: 'Payment result arrives late', description: 'Keep an unresolved state and a reconciliation path; avoid assuming the browser response is authoritative.' },
    { title: 'Reservation expires during authorization', description: 'Define an explicit expiry policy and coordinate the expiry transition with payment status.' },
    { title: 'Reporting lags behind transactions', description: 'Separate operational state from derived reporting and make freshness/reconciliation visible.' },
  ],
  decisions: [
    { question: 'Where should a stock reservation happen?', options: ['Reserve before payment authorization', 'Authorize payment before reserving stock'], selected: 'Reference direction: reserve first, then authorize; define expiry and compensation explicitly.', tradeoff: 'Reserving first can temporarily hold stock for an abandoned checkout. Authorizing first risks charging for an order that cannot be fulfilled. The right policy depends on provider behavior, inventory guarantees, and the business rules.' },
    { question: 'How should duplicate or delayed callbacks behave?', options: ['Apply every callback as received', 'Validate identity and current state before applying an effect'], selected: 'Reference direction: stable operation identity plus guarded, idempotent transitions.', tradeoff: 'Idempotency requires durable keys and retention rules. It reduces duplicate effects but does not by itself solve every cross-system consistency problem.' },
    { question: 'How should mismatched state be resolved?', options: ['Assume the latest response is correct', 'Reconcile against the authoritative provider and order state'], selected: 'Reference direction: explicit unresolved state, bounded reconciliation, and an operator path.', tradeoff: 'Reconciliation adds operational work and may need manual review. It makes uncertainty visible rather than hiding it behind a guessed success or failure.' },
  ],
  productionConcerns: [
    { title: 'State & concurrency', description: 'Identify the authority for each state, define guarded transitions, and make reservation races explicit.' },
    { title: 'Retries & idempotency', description: 'Use stable operation identity, bounded retries, and duplicate-safe effects where the provider and product support them.' },
    { title: 'Reconciliation', description: 'Represent unknown outcomes directly and provide a bounded process for resolving mismatches.' },
    { title: 'Observability', description: 'Give operators a traceable operation reference and enough status history to distinguish delayed, failed, and unresolved work.' },
  ],
} satisfies CaseStudy;

export const caseStudyInventory = [
  { title: orderInventoryAnalysis.title, publication: 'public-safe', evidence: 'illustrative', note: 'Published as a generic engineering analysis; not attributed to a client.' },
  { title: 'Cyber resilience and infrastructure validation', publication: 'private-review', evidence: 'reported', note: 'Keep private until contribution scope and which capabilities shipped are verified; exclude future validation modules from delivered architecture.' },
  { title: 'Computer vision and camera monitoring', publication: 'private-review', evidence: 'reported', note: 'Do not split overlapping camera and wildlife workstreams into separate case studies until engagement boundaries and ownership are resolved.' },
  { title: 'AI knowledge and document intelligence', publication: 'private-review', evidence: 'reported', note: 'Technology exposure is reported; confirm project-specific implementation and safe detail before presenting as an attributable case.' },
  { title: 'Real-time infrastructure monitoring', publication: 'private-review', evidence: 'unknown', note: 'Needs a source-backed delivery record and confidentiality review.' },
  { title: 'Streaming and real-time product engineering', publication: 'private-review', evidence: 'unknown', note: 'Needs verification of personal contribution, delivered scope, and safe public details.' },
];
