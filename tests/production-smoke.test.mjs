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
  assert.match(html, /id="services"/);
  assert.match(html, /Engagements start with a defined problem/);
  assert.match(html, /Start with a paid technical discovery/);
  assert.match(html, /href="\/services\/product-engineering\/"/);
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

test('all indexable pages have unique titles, self canonicals, index directives, and valid structured data', async () => {
  const routes = [
    '/',
    '/services/product-engineering/',
    '/services/ai-integration/',
    '/services/production-reliability/',
    '/case-studies/order-inventory-consistency/',
  ];
  const titles = new Set();

  for (const route of routes) {
    const html = await page(route);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title, `${route} title exists`);
    assert.equal(titles.has(title), false, `${route} has unique title`);
    titles.add(title);
    const canonical = `https://www.sherazdevsolutions.com${route}`;
    assert.ok(html.includes(`href="${canonical}"`), `${route} self canonical`);
    assert.ok(html.includes(`<meta property="og:url" content="${canonical}"`), `${route} Open Graph URL matches canonical`);
    assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/i, `${route} is indexable`);

    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
      .map(([, json]) => JSON.parse(json));
    assert.ok(schemas.length > 0, `${route} structured data exists`);
    assert.ok(schemas.every(schema => schema['@context'] === 'https://schema.org'), `${route} JSON-LD parses`);

    if (route.startsWith('/services/')) {
      const service = schemas.find(schema => schema['@type'] === 'Service');
      assert.ok(service, `${route} Service entity exists`);
      assert.equal(service.provider['@id'], 'https://www.sherazdevsolutions.com/#person');
      assert.ok(html.includes('Engineering evidence'));
      assert.ok(html.includes('How to start'));
      if (route.includes('ai-integration')) {
        assert.ok(html.includes('href="/case-studies/wildlife-detection/"'));
      } else {
        assert.ok(html.includes('href="/case-studies/order-inventory-consistency/"'));
        assert.ok(html.includes('/lib/order-inventory-model.mjs'));
        assert.ok(html.includes('/tests/order-inventory-model.test.mjs'));
      }
    }
    if (route.startsWith('/case-studies/')) {
      const article = schemas.find(schema => schema['@type'] === 'Article');
      assert.ok(article, 'case study Article entity exists');
      assert.equal(article.author['@id'], 'https://www.sherazdevsolutions.com/#person');
      assert.equal('isBasedOn' in article, false, 'does not use an invalid text-valued isBasedOn property');
      assert.match(html, /not a client project report/i);
    }
    if (route === '/') {
      const graph = schemas.find(schema => Array.isArray(schema['@graph']))['@graph'];
      assert.ok(graph.some(entity => entity['@type'] === 'Person' && entity.name === 'Sheraz Zafar'));
      assert.ok(graph.some(entity => entity['@type'] === 'WebSite'));
      assert.ok(graph.some(entity => entity['@type'] === 'ProfilePage'));
      if (!process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
        assert.doesNotMatch(html, /googletagmanager\.com\/gtag|gtag\('config'/i, 'analytics is not emitted without provider configuration');
      }
    }
  }
});

test('interactive case study renders with its canonical and controls', async () => {
  const route = '/case-studies/order-inventory-consistency/';
  const html = await page(route);
  assert.ok(html.includes(`href="https://www.sherazdevsolutions.com${route}"`));
  assert.match(html, /ILLUSTRATIVE/);
  assert.match(html, /Provider timeout|provider timeout/i);
  assert.match(html, /id="validation"/);
  assert.match(html, /automated checks cover the model/);
  assert.match(html, /github\.com\/sheraz2812\/sheraz-zafar-site\/blob\/main\/lib\/order-inventory-model\.mjs/);
  assert.match(html, /github\.com\/sheraz2812\/sheraz-zafar-site\/blob\/main\/tests\/order-inventory-model\.test\.mjs/);
  assert.match(html, /not test a payment provider, database durability, production concurrency, or any client deployment/i);
});

test('legacy resume path permanently redirects and reaches the fragment destination', async () => {
  for (const [route, expectedStatuses] of [['/resume', [308, 308]], ['/resume/', [308]]]) {
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
  assert.match(sitemap, /https:\/\/www\.sherazdevsolutions\.com\/case-studies\/wildlife-detection\//);
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
  assert.equal(urls.length, 6);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.every(url => url.startsWith('https://www.sherazdevsolutions.com/')));
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
