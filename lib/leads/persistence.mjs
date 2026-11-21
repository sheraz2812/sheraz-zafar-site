import { createHash } from 'node:crypto';

/**
 * Adapter contract only: implementations must atomically and durably insert the
 * inquiry plus separate owner/sender outbox jobs before this function returns.
 * No database or provider is bundled with this module.
 */
export async function persistLeadBeforeNotifications(persistence, input) {
  if (!persistence || typeof persistence.persistSubmissionAndOutbox !== 'function') {
    throw new TypeError('A lead persistence adapter is required.');
  }
  const { submission, idempotencyKey, ownerRecipient, receivedAt, expiresAt } = input ?? {};
  if (!submission || typeof submission.email !== 'string' || !submission.email.trim()) {
    throw new TypeError('A valid lead submission is required.');
  }
  if (typeof idempotencyKey !== 'string' || idempotencyKey.trim().length < 16) {
    throw new TypeError('An idempotency key of at least 16 characters is required.');
  }
  if (typeof ownerRecipient !== 'string' || !ownerRecipient.includes('@')) {
    throw new TypeError('A valid owner recipient is required.');
  }
  if (!Number.isFinite(Date.parse(receivedAt)) || !Number.isFinite(Date.parse(expiresAt)) || Date.parse(expiresAt) <= Date.parse(receivedAt)) {
    throw new TypeError('Valid receivedAt and later expiresAt timestamps are required.');
  }

  const idempotencyDigest = createHash('sha256').update(idempotencyKey).digest('hex');
  return persistence.persistSubmissionAndOutbox({
    submission,
    idempotencyDigest,
    receivedAt,
    expiresAt,
    notifications: [
      { recipientRole: 'owner', recipient: ownerRecipient },
      { recipientRole: 'sender', recipient: submission.email.trim().toLowerCase() },
    ],
  });
}

/** Verify the raw signed webhook before allowing a persistence adapter to mutate delivery state. */
export async function applySignedDeliveryWebhook({ rawBody, headers, verifier, persistence }) {
  if (typeof rawBody !== 'string' || !verifier || typeof verifier.verify !== 'function') {
    throw new TypeError('Raw webhook body and signature verifier are required.');
  }
  if (!persistence || typeof persistence.applyVerifiedDeliveryEvent !== 'function') {
    throw new TypeError('A lead persistence adapter is required.');
  }
  const event = await verifier.verify(rawBody, headers);
  return persistence.applyVerifiedDeliveryEvent(event);
}
