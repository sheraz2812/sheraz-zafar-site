const allowedEvents = new Set([
  'reservation-created',
  'payment-requested',
  'payment-approved',
  'payment-declined',
  'payment-timeout',
  'reconciliation-approved',
  'reconciliation-declined',
]);

export function createReferenceOrder(id) {
  if (typeof id !== 'string' || !id.trim()) throw new TypeError('Order id is required.');
  return { id: id.trim(), status: 'draft', reservation: 'none', appliedEventIds: [] };
}

export function applyReferenceEvent(order, event) {
  if (!order || !Array.isArray(order.appliedEventIds)) throw new TypeError('A reference order is required.');
  if (!event || typeof event.id !== 'string' || !event.id.trim() || !allowedEvents.has(event.kind)) {
    throw new TypeError('A valid event id and supported event kind are required.');
  }

  if (order.appliedEventIds.includes(event.id)) return { order, applied: false, reason: 'duplicate' };

  let nextStatus = order.status;
  let nextReservation = order.reservation;
  const canResolvePayment = order.status === 'payment-pending' || order.status === 'unresolved';

  switch (event.kind) {
    case 'reservation-created':
      if (order.status === 'draft' && order.reservation === 'none') {
        nextStatus = 'reserved';
        nextReservation = 'held';
      }
      break;
    case 'payment-requested':
      if (order.status === 'reserved' && order.reservation === 'held') nextStatus = 'payment-pending';
      break;
    case 'payment-approved':
    case 'reconciliation-approved':
      if (canResolvePayment && order.reservation === 'held') {
        nextStatus = 'confirmed';
        nextReservation = 'committed';
      }
      break;
    case 'payment-declined':
    case 'reconciliation-declined':
      if (canResolvePayment && order.reservation === 'held') {
        nextStatus = 'declined';
        nextReservation = 'released';
      }
      break;
    case 'payment-timeout':
      if (order.status === 'payment-pending' && order.reservation === 'held') nextStatus = 'unresolved';
      break;
  }

  if (nextStatus === order.status && nextReservation === order.reservation) {
    return { order, applied: false, reason: 'invalid-transition' };
  }

  return {
    order: {
      ...order,
      status: nextStatus,
      reservation: nextReservation,
      appliedEventIds: [...order.appliedEventIds, event.id],
    },
    applied: true,
    reason: 'applied',
  };
}
