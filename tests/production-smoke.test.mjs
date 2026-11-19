import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { after, before, test } from 'node:test';
import net from 'node:net';

let server;
let baseUrl;
let serverOutput = '';

async function unusedPort() {
  const listener = net.createServer();
  listener.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  const { port } = listener.address();
  await new Promise((resolve, reject) => listener.close(error => error ? reject(error) : resolve()));
  return port;
}

before(async () => {
  const port = await unusedPort();
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', chunk => { serverOutput += chunk; });
  server.stderr.on('data', chunk => { serverOutput += chunk; });

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next production server exited early:\n${serverOutput}`);
    try {
      const response = await fetch(baseUrl);
      if (response.status === 200) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Next production server did not become ready:\n${serverOutput}`);
});

after(async () => {
  if (!server || server.exitCode !== null) return;
  server.kill('SIGTERM');
  await once(server, 'exit');
});

async function page(path) {
  const response = await fetch(new URL(path, baseUrl));
  assert.equal(response.status, 200, `${path} status`);
  return response.text();
}

test('homepage renders the current experience wording and www canonical', async () => {
  const html = await page('/');
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.sherazdevsolutions\.com\//);
  assert.match(html, /EMPLOYMENT &amp; FREELANCE SHOWN SEPARATELY/);
  assert.doesNotMatch(html, /52\+ COMPLETED CLIENT ENGAGEMENTS/);
  assert.match(html, /<input[^>]*type="email"[^>]*required|<input[^>]*required[^>]*type="email"/);
  assert.match(html, /<textarea[^>]*required/);
});

test('all service routes render with www canonicals', async () => {
  for (const route of [
    '/services/product-engineering/',
    '/services/ai-integration/',
    '/services/production-reliability/',
  ]) {
    const html = await page(route);
    assert.ok(html.includes(`href="https://www.sherazdevsolutions.com${route}"`), `${route} canonical`);
  }
});

test('interactive case study renders with its canonical and controls', async () => {
  const route = '/case-studies/order-inventory-consistency/';
  const html = await page(route);
  assert.ok(html.includes(`href="https://www.sherazdevsolutions.com${route}"`));
  assert.match(html, /ILLUSTRATIVE/);
  assert.match(html, /Provider timeout|provider timeout/i);
});

test('legacy resume path uses temporary redirect and reaches the fragment destination', async () => {
  for (const [route, expectedStatuses] of [['/resume', [308, 307]], ['/resume/', [307]]]) {
    let current = new URL(route, baseUrl);
    let response;
    const statuses = [];
    for (let hop = 0; hop < 3; hop += 1) {
      response = await fetch(current, { redirect: 'manual' });
      if (![301, 302, 307, 308].includes(response.status)) break;
      statuses.push(response.status);
      current = new URL(response.headers.get('location'), current);
      if (current.pathname === '/' && current.hash === '#journey') break;
    }
    assert.deepEqual(statuses, expectedStatuses, `${route} redirect statuses`);
    assert.equal(current.pathname, '/', `${route} destination path`);
    assert.equal(current.hash, '#journey', `${route} fragment`);
  }
  const homepage = await page('/');
  assert.match(homepage, /id="journey"/);
});

test('robots and sitemap point crawlers to the canonical host', async () => {
  const robots = await (await fetch(new URL('/robots.txt', baseUrl))).text();
  assert.match(robots, /Sitemap: https:\/\/www\.sherazdevsolutions\.com\/sitemap\.xml/);
  const sitemap = await (await fetch(new URL('/sitemap.xml', baseUrl))).text();
  assert.match(sitemap, /https:\/\/www\.sherazdevsolutions\.com\/services\/product-engineering\//);
  assert.match(sitemap, /https:\/\/www\.sherazdevsolutions\.com\/case-studies\/order-inventory-consistency\//);
});

test('favicon, profile derivatives, and original image are served with expected types', async () => {
  const checks = [
    ['/favicon.ico', 'image/x-icon'],
    ['/apple-icon.png', 'image/png'],
    ['/assets/sheraz-portrait.png', 'image/png'],
    ['/assets/sheraz-portrait-720.webp', 'image/webp'],
    ['/assets/sheraz-portrait-960.webp', 'image/webp'],
  ];
  for (const [route, type] of checks) {
    const response = await fetch(new URL(route, baseUrl));
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get('content-type') ?? '', new RegExp(type.replace('/', '\\/')));
    assert.ok((await response.arrayBuffer()).byteLength > 0, `${route} response body`);
  }
});

test('contact endpoint rejects GET and unmatched routes remain 404', async () => {
  const contact = await fetch(new URL('/api/contact', baseUrl));
  assert.equal(contact.status, 405);
  const missing = await fetch(new URL('/not-a-real-route/', baseUrl));
  assert.equal(missing.status, 404);
});
