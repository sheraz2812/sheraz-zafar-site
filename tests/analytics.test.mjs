import assert from 'node:assert/strict';
import test from 'node:test';
import { isAnalyticsConfigured, trackAnalyticsEvent } from '../lib/analytics.mjs';

test('analytics requires an explicitly selected provider and valid measurement ID', () => {
  assert.equal(isAnalyticsConfigured(undefined, undefined), false);
  assert.equal(isAnalyticsConfigured('ga4', ''), false);
  assert.equal(isAnalyticsConfigured('other', 'G-ABC123'), false);
  assert.equal(isAnalyticsConfigured('ga4', 'UA-12345'), false);
  assert.equal(isAnalyticsConfigured('ga4', 'G-ABC123'), true);
});

test('page view reports only the pathname and rejects query strings', () => {
  const calls = [];
  const target = { gtag: (...args) => calls.push(args) };
  assert.equal(trackAnalyticsEvent({ name: 'page_view', pagePath: '/services/ai-integration/' }, target), true);
  assert.deepEqual(calls, [['event', 'page_view', { page_path: '/services/ai-integration/' }]]);
  assert.equal(trackAnalyticsEvent({ name: 'page_view', pagePath: '/?email=private@example.com' }, target), false);
});

test('contact clicks and successful leads are separate allowlisted events', () => {
  const calls = [];
  const target = { gtag: (...args) => calls.push(args) };
  assert.equal(trackAnalyticsEvent({ name: 'contact_click', method: 'email' }, target), true);
  const leadPayload = {
    name: 'lead_submission_success', method: 'contact_form', submissionId: 'lead-001',
    email: 'private@example.com', problem: 'Confidential project details', query: '?token=secret',
  };
  assert.equal(trackAnalyticsEvent(leadPayload, target), true);
  assert.equal(trackAnalyticsEvent(leadPayload, target), false, 'same confirmed submission is counted once');
  assert.deepEqual(calls, [
    ['event', 'contact_click', { contact_method: 'email' }],
    ['event', 'generate_lead', { lead_method: 'contact_form' }],
  ]);
  assert.equal(JSON.stringify(calls).includes('private@example.com'), false);
  assert.equal(JSON.stringify(calls).includes('Confidential project details'), false);
  assert.equal(JSON.stringify(calls).includes('secret'), false);
});

test('events do not send before a configured analytics runtime exists', () => {
  assert.equal(trackAnalyticsEvent({ name: 'lead_submission_success', method: 'contact_form' }, {}), false);
  assert.equal(trackAnalyticsEvent({ name: 'page_view', pagePath: '/private?token=secret' }, { gtag() {} }), false);
  assert.equal(trackAnalyticsEvent({ name: 'lead_submission_success', method: 'contact_form', submissionId: '' }, { gtag() {} }), false);
});
