export async function sendContactRequest(payload, idempotencyKey, fetcher = fetch, timeoutMs = 18_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetcher('/api/contact', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(result?.error || 'Your message could not be sent. Please try again.');
    }
    return result;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('The request took too long. Please try again or email Sheraz directly.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
