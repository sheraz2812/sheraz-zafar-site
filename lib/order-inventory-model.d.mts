export type ReferenceStatus = 'draft' | 'reserved' | 'payment-pending' | 'unresolved' | 'confirmed' | 'declined';
export type ReservationStatus = 'none' | 'held' | 'committed' | 'released';
export type ReferenceEventKind =
  | 'reservation-created'
  | 'payment-requested'
  | 'payment-approved'
  | 'payment-declined'
  | 'payment-timeout'
  | 'reconciliation-approved'
  | 'reconciliation-declined';

export type ReferenceOrder = {
  id: string;
  status: ReferenceStatus;
  reservation: ReservationStatus;
  appliedEventIds: string[];
};

export type ReferenceEvent = { id: string; kind: ReferenceEventKind };
export type TransitionResult = {
  order: ReferenceOrder;
  applied: boolean;
  reason: 'applied' | 'duplicate' | 'invalid-transition';
};

export function createReferenceOrder(id: string): ReferenceOrder;
export function applyReferenceEvent(order: ReferenceOrder, event: ReferenceEvent): TransitionResult;
