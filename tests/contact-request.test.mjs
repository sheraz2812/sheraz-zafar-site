import assert from 'node:assert/strict';
import test from 'node:test';
import { sendContactRequest } from '../lib/contact-request.mjs';

const payload = { name: 'Test Sender', email: 'sender@example.com', problem: 'Mocked test only' };

test('sends JSON with the idempotency key and returns a successful response', async () => {
  let request;
  const result = await sendContactRequest(payload, 'test-key', async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  });

  assert.equal(request.url, '/api/contact');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers['Idempotency-Key'], 'test-key');
  assert.deepEqual(JSON.parse(request.options.body), payload);
  assert.deepEqual(result, { ok: true });
});

test('uses a useful fallback when a failed response is not JSON', async () => {
  await assert.rejects(
    sendContactRequest(payload, 'test-key', async () => new Response('upstream failure', { status: 502 }), 100),
    /Your message could not be sent/,
  );
});

test('surfaces a server-provided JSON error', async () => {
  await assert.rejects(
    sendContactRequest(payload, 'test-key', async () => Response.json({ error: 'Validation failed' }, { status: 400 }), 100),
    /Validation failed/,
  );
});

test('aborts a stalled request and returns the timeout message', async () => {
  const neverCompletes = (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  });

  await assert.rejects(
    sendContactRequest(payload, 'test-key', neverCompletes, 10),
    /request took too long/i,
  );
});
