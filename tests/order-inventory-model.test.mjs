import assert from 'node:assert/strict';
import test from 'node:test';
import { applyReferenceEvent, createReferenceOrder } from '../lib/order-inventory-model.mjs';

function apply(order, id, kind) {
  const result = applyReferenceEvent(order, { id, kind });
  assert.equal(result.applied, true, `${kind} should apply`);
  return result.order;
}

function beginPayment(order) {
  return apply(apply(order, 'reserve-1', 'reservation-created'), 'request-1', 'payment-requested');
}

test('a confirmed payment commits a held reservation once and duplicate callbacks are no-ops', () => {
  const pending = beginPayment(createReferenceOrder('order-1'));
  const approved = apply(pending, 'provider-event-1', 'payment-approved');
  const duplicate = applyReferenceEvent(approved, { id: 'provider-event-1', kind: 'payment-approved' });

  assert.equal(approved.status, 'confirmed');
  assert.equal(approved.reservation, 'committed');
  assert.deepEqual(duplicate, { order: approved, applied: false, reason: 'duplicate' });
});

test('a timeout keeps the reservation held until reconciliation resolves it', () => {
  const pending = beginPayment(createReferenceOrder('order-2'));
  const unresolved = apply(pending, 'timeout-1', 'payment-timeout');
  assert.equal(unresolved.status, 'unresolved');
  assert.equal(unresolved.reservation, 'held');

  const confirmed = apply(unresolved, 'reconcile-1', 'reconciliation-approved');
  assert.equal(confirmed.status, 'confirmed');
  assert.equal(confirmed.reservation, 'committed');
});

test('a declined payment releases the reservation and a repeated signal cannot reverse it', () => {
  const pending = beginPayment(createReferenceOrder('order-3'));
  const declined = apply(pending, 'decline-1', 'payment-declined');
  assert.equal(declined.status, 'declined');
  assert.equal(declined.reservation, 'released');

  const lateApproval = applyReferenceEvent(declined, { id: 'late-approval', kind: 'payment-approved' });
  assert.equal(lateApproval.applied, false);
  assert.equal(lateApproval.reason, 'invalid-transition');
  assert.equal(lateApproval.order.status, 'declined');
  assert.equal(lateApproval.order.reservation, 'released');
});

test('out-of-order events do not mutate the model', () => {
  const order = createReferenceOrder('order-4');
  const result = applyReferenceEvent(order, { id: 'early-approval', kind: 'payment-approved' });

  assert.equal(result.applied, false);
  assert.equal(result.reason, 'invalid-transition');
  assert.equal(result.order, order);
  assert.equal(order.status, 'draft');
});

test('ids and event kinds are required', () => {
  assert.throws(() => createReferenceOrder('  '), /Order id is required/);
  assert.throws(() => applyReferenceEvent(createReferenceOrder('order-5'), { id: '', kind: 'payment-approved' }), /valid event id/);
});
