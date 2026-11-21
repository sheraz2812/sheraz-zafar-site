export type LeadSubmission = {
  name: string;
  email: string;
  company?: string;
  project?: string;
  problem: string;
  budget?: string;
  timeline?: string;
};

export type LeadStatus = 'new' | 'reviewing' | 'qualified' | 'unqualified' | 'closed';
export type DeliveryStatus = 'queued' | 'sending' | 'accepted' | 'delivered' | 'bounced' | 'failed';
export type RecipientRole = 'owner' | 'sender';
export type DeliveryEvent = {
  providerEventId: string;
  deliveryId: string;
  status: Extract<DeliveryStatus, 'delivered' | 'bounced' | 'failed'>;
  occurredAt: string;
};
export type OutboxNotification = { recipientRole: RecipientRole; recipient: string };
export type PersistLeadInput = {
  submission: LeadSubmission;
  idempotencyDigest: string;
  receivedAt: string;
  expiresAt: string;
  notifications: [OutboxNotification, OutboxNotification];
};
export type DeliveryJob = {
  id: string;
  leadId: string;
  recipientRole: RecipientRole;
  status: DeliveryStatus;
  attempts: number;
  nextAttemptAt: string;
  leaseUntil?: string;
};

/** Implementations should use a unique idempotencyDigest and one transaction for lead + both outbox rows. */
export interface LeadPersistence {
  persistSubmissionAndOutbox(input: PersistLeadInput): Promise<{ leadId: string; duplicate: boolean; status: LeadStatus; jobs: DeliveryJob[] }>;
  claimDueDeliveries(input: { now: string; limit: number; leaseSeconds: number }): Promise<DeliveryJob[]>;
  recordDeliveryAttempt(input: { deliveryId: string; outcome: 'accepted' | 'retryable-failure' | 'permanent-failure'; attemptedAt: string; providerMessageId?: string; nextAttemptAt?: string }): Promise<void>;
  applyVerifiedDeliveryEvent(event: DeliveryEvent): Promise<void>;
  deleteExpiredSubmissions(input: { before: string; limit: number }): Promise<number>;
}

export interface SignedWebhookVerifier {
  verify(rawBody: string, headers: Headers): Promise<DeliveryEvent>;
}

export function persistLeadBeforeNotifications(persistence: LeadPersistence, input: Omit<PersistLeadInput, 'idempotencyDigest' | 'notifications'> & { idempotencyKey: string; ownerRecipient: string }): ReturnType<LeadPersistence['persistSubmissionAndOutbox']>;
export function applySignedDeliveryWebhook(input: { rawBody: string; headers: Headers; verifier: SignedWebhookVerifier; persistence: LeadPersistence }): Promise<void>;
