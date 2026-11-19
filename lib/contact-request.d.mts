export function sendContactRequest(
  payload: Record<string, unknown>,
  idempotencyKey: string,
  fetcher?: typeof fetch,
  timeoutMs?: number,
): Promise<unknown>;
