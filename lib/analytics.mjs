const ga4MeasurementIdPattern = /^G-[A-Z0-9]+$/;
const seenLeadSubmissionIds = new Set();

/** Analytics is opt-in at both deployment configuration and visitor-consent layers. */
export function isAnalyticsConfigured(provider, measurementId) {
  return provider === 'ga4' && typeof measurementId === 'string' && ga4MeasurementIdPattern.test(measurementId);
}

/** Send only the typed, allowlisted event fields. Never pass form data or URL query strings. */
export function trackAnalyticsEvent(event, target = globalThis.window) {
  if (typeof target?.gtag !== 'function') return false;

  if (event?.name === 'page_view' && typeof event.pagePath === 'string' && event.pagePath.startsWith('/') && !event.pagePath.includes('?')) {
    target.gtag('event', 'page_view', { page_path: event.pagePath });
    return true;
  }

  if (event?.name === 'contact_click' && ['form', 'email', 'phone'].includes(event.method)) {
    target.gtag('event', 'contact_click', { contact_method: event.method });
    return true;
  }

  if (event?.name === 'lead_submission_success' && event.method === 'contact_form') {
    if (typeof event.submissionId !== 'string' || event.submissionId.length === 0) return false;
    if (seenLeadSubmissionIds.has(event.submissionId)) return false;
    seenLeadSubmissionIds.add(event.submissionId);
    target.gtag('event', 'generate_lead', { lead_method: 'contact_form' });
    return true;
  }

  return false;
}
