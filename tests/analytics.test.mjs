import assert from 'node:assert/strict';
import test from 'node:test';
import {
  initializeAnalytics,
  isAnalyticsConfigured,
  trackAnalyticsEvent,
  updateAnalyticsConsent,
} from '../lib/analytics.mjs';

function makeWindow(consent = null) {
  const calls = [];
  const scripts = [];
  const storage = new Map();
  if (consent) storage.set('sheraz-analytics-consent-v1', consent);
  const target = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    dataLayer: [],
    document: {
      createElement: () => ({}),
      head: { appendChild: (script) => scripts.push(script) },
    },
  };
  return { target, calls, scripts, storage };
}

test('analytics requires an explicitly selected provider and valid measurement ID', () => {
  assert.equal(isAnalyticsConfigured(undefined, undefined), false);
  assert.equal(isAnalyticsConfigured('ga4', ''), false);
  assert.equal(isAnalyticsConfigured('other', 'G-ABC123'), false);
  assert.equal(isAnalyticsConfigured('ga4', 'UA-12345'), false);
  assert.equal(isAnalyticsConfigured('ga4', 'G-ABC123'), true);
});

test('initial visit without consent creates no GA script or collection events', () => {
  const { target, scripts } = makeWindow();
  assert.equal(initializeAnalytics('G-ABC123', target), false);
  assert.equal(trackAnalyticsEvent({ name: 'page_view', pagePath: '/' }, target), false);
  assert.equal(scripts.length, 0);
  assert.equal(target.dataLayer.length, 0);
});

test('granting consent before initialization configures first, then injects exactly one script', () => {
  const { target, scripts } = makeWindow();
  updateAnalyticsConsent('accepted', target);
  assert.equal(initializeAnalytics('G-ABC123', target), true);
  assert.equal(initializeAnalytics('G-ABC123', target), true);
  assert.equal(scripts.length, 1);
  assert.deepEqual(target.dataLayer.slice(0, 3).map((entry) => entry[0]), ['consent', 'js', 'config']);
  assert.deepEqual(target.dataLayer[0], ['consent', 'update', { analytics_storage: 'granted' }]);
  assert.equal(target.dataLayer[2][1], 'G-ABC123');
  assert.equal(target.dataLayer[2][2].send_page_view, false);
});

test('granting consent after page load enables a page view and CTA event', () => {
  const { target, calls } = makeWindow();
  assert.equal(trackAnalyticsEvent({ name: 'page_view', pagePath: '/' }, target), false);
  updateAnalyticsConsent('accepted', target);
  initializeAnalytics('G-ABC123', target);
  target.gtag = (...args) => calls.push(args);

  assert.equal(trackAnalyticsEvent({ name: 'page_view', pagePath: '/' }, target), true);
  assert.equal(trackAnalyticsEvent({ name: 'contact_click', method: 'form' }, target), true);
  assert.deepEqual(calls, [
    ['event', 'page_view', { page_path: '/' }],
    ['event', 'contact_click', { contact_method: 'form' }],
  ]);
});

test('page view accepts only clean pathname and a navigation is represented once by caller', () => {
  const { target, calls } = makeWindow('accepted');
  target.gtag = (...args) => calls.push(args);
  assert.equal(trackAnalyticsEvent({ name: 'page_view', pagePath: '/services/ai-integration/' }, target), true);
  assert.equal(trackAnalyticsEvent({ name: 'page_view', pagePath: '/?email=private@example.com' }, target), false);
  assert.deepEqual(calls, [['event', 'page_view', { page_path: '/services/ai-integration/' }]]);
});

test('revocation gates all future events and updates GA consent state', () => {
  const { target, calls } = makeWindow('accepted');
  target.gtag = (...args) => calls.push(args);
  assert.equal(updateAnalyticsConsent('rejected', target), true);
  assert.equal(trackAnalyticsEvent({ name: 'page_view', pagePath: '/' }, target), false);
  assert.equal(trackAnalyticsEvent({ name: 'contact_click', method: 'email' }, target), false);
  assert.equal(trackAnalyticsEvent({ name: 'lead_submission_success', method: 'contact_form', submissionId: 'revoke-1' }, target), false);
  assert.deepEqual(calls, [['consent', 'update', { analytics_storage: 'denied' }]]);
});

test('revocation removes queued app events and later consent can be granted again', () => {
  const { target, calls } = makeWindow('accepted');
  initializeAnalytics('G-ABC123', target);
  trackAnalyticsEvent({ name: 'page_view', pagePath: '/' }, target);
  assert.equal(target.dataLayer.some((entry) => entry[0] === 'event'), true);

  updateAnalyticsConsent('rejected', target);
  assert.equal(target.dataLayer.some((entry) => entry[0] === 'event'), false);
  assert.equal(trackAnalyticsEvent({ name: 'contact_click', method: 'form' }, target), false);
  updateAnalyticsConsent('accepted', target);
  assert.equal(trackAnalyticsEvent({ name: 'contact_click', method: 'form' }, target), true);
  assert.equal(target.dataLayer.filter((entry) => entry[0] === 'consent').at(-1)[2].analytics_storage, 'granted');
});

test('generate_lead requires accepted consent, only follows success caller, and deduplicates', () => {
  const { target, calls } = makeWindow();
  target.gtag = (...args) => calls.push(args);
  const event = { name: 'lead_submission_success', method: 'contact_form', submissionId: 'lead-unique-1' };
  assert.equal(trackAnalyticsEvent(event, target), false);
  updateAnalyticsConsent('accepted', target);
  assert.equal(trackAnalyticsEvent(event, target), true);
  assert.equal(trackAnalyticsEvent(event, target), false);
  assert.deepEqual(calls, [
    ['consent', 'update', { analytics_storage: 'granted' }],
    ['event', 'generate_lead', { lead_method: 'contact_form' }],
  ]);
});

test('event payloads never include personal form values', () => {
  const { target, calls } = makeWindow('accepted');
  target.gtag = (...args) => calls.push(args);
  trackAnalyticsEvent({
    name: 'lead_submission_success', method: 'contact_form', submissionId: 'lead-private-1',
    email: 'private@example.com', problem: 'Confidential project details',
  }, target);
  assert.equal(JSON.stringify(calls).includes('private@example.com'), false);
  assert.equal(JSON.stringify(calls).includes('Confidential project details'), false);
});
