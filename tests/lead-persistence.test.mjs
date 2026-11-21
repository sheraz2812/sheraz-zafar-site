import assert from 'node:assert/strict';
import test from 'node:test';
import { applySignedDeliveryWebhook, persistLeadBeforeNotifications } from '../lib/leads/persistence.mjs';

const input = {
  submission: { name: 'Test Sender', email: 'SENDER@example.com', problem: 'Safe test payload' },
  idempotencyKey: 'request-key-1234567890',
  ownerRecipient: 'owner@example.com',
  receivedAt: '2026-11-21T10:00:00.000Z',
  expiresAt: '2027-11-21T10:00:00.000Z',
};

test('persists the lead before notification work and separates sender and owner deliveries', async () => {
  const calls = [];
  const adapter = { async persistSubmissionAndOutbox(record) { calls.push(record); return { leadId: 'lead-1', duplicate: false, status: 'new', jobs: [] }; } };
  const result = await persistLeadBeforeNotifications(adapter, input);

  assert.equal(result.leadId, 'lead-1');
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].notifications, [
    { recipientRole: 'owner', recipient: 'owner@example.com' },
    { recipientRole: 'sender', recipient: 'sender@example.com' },
  ]);
  assert.match(calls[0].idempotencyDigest, /^[a-f0-9]{64}$/);
  assert.equal(calls[0].idempotencyDigest.includes(input.idempotencyKey), false);
});

test('same idempotency key maps to same digest; changed key maps to a different digest', async () => {
  const records = [];
  const adapter = { async persistSubmissionAndOutbox(record) { records.push(record); return { leadId: 'same', duplicate: records.length > 1, status: 'new', jobs: [] }; } };
  await persistLeadBeforeNotifications(adapter, input);
  await persistLeadBeforeNotifications(adapter, input);
  await persistLeadBeforeNotifications(adapter, { ...input, idempotencyKey: 'request-key-abcdef-1234' });
  assert.equal(records[0].idempotencyDigest, records[1].idempotencyDigest);
  assert.notEqual(records[1].idempotencyDigest, records[2].idempotencyDigest);
});

test('rejects weak idempotency keys, invalid timestamps, and missing adapter before persistence', async () => {
  let writes = 0;
  const adapter = { async persistSubmissionAndOutbox() { writes += 1; } };
  await assert.rejects(persistLeadBeforeNotifications(adapter, { ...input, idempotencyKey: 'short' }), /at least 16/);
  await assert.rejects(persistLeadBeforeNotifications(adapter, { ...input, expiresAt: input.receivedAt }), /later expiresAt/);
  await assert.rejects(persistLeadBeforeNotifications(null, input), /adapter/);
  assert.equal(writes, 0);
});

test('only a signature-verified webhook reaches persistence', async () => {
  const applied = [];
  const persistence = { async applyVerifiedDeliveryEvent(event) { applied.push(event); } };
  const event = { providerEventId: 'evt-1', deliveryId: 'delivery-1', status: 'delivered', occurredAt: '2026-11-21T10:05:00.000Z' };
  const verifier = { async verify(rawBody) { assert.equal(rawBody, '{"signed":true}'); return event; } };
  await applySignedDeliveryWebhook({ rawBody: '{"signed":true}', headers: new Headers(), verifier, persistence });
  assert.deepEqual(applied, [event]);

  const rejectingVerifier = { async verify() { throw new Error('invalid signature'); } };
  await assert.rejects(applySignedDeliveryWebhook({ rawBody: '{}', headers: new Headers(), verifier: rejectingVerifier, persistence }), /invalid signature/);
  assert.equal(applied.length, 1);
});
