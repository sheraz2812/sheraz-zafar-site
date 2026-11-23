const ga4MeasurementIdPattern = /^G-[A-Z0-9]+$/;
const consentKey = 'sheraz-analytics-consent-v1';
const seenLeadSubmissionIds = new Set();

/** Analytics is opt-in at both deployment configuration and visitor-consent layers. */
export function isAnalyticsConfigured(provider, measurementId) {
  return provider === 'ga4' && typeof measurementId === 'string' && ga4MeasurementIdPattern.test(measurementId);
}

function hasConsent(target) {
  try {
    return target?.localStorage?.getItem(consentKey) === 'accepted';
  } catch {
    return false;
  }
}

/**
 * Initialize one GA4 runtime. The first-party stub queues config before events,
 * and the script is inserted only after consent has been granted.
 */
export function initializeAnalytics(measurementId, target = globalThis.window) {
  if (!isAnalyticsConfigured('ga4', measurementId) || !hasConsent(target)) return false;

  target.dataLayer = target.dataLayer || [];
  target.gtag = target.gtag || function gtag(...args) { target.dataLayer.push(args); };
  target.gtag('consent', 'update', { analytics_storage: 'granted' });

  if (!target.__sherazGa4Configured) {
    target.gtag('js', new Date());
    target.gtag('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      anonymize_ip: true,
    });
    target.__sherazGa4Configured = measurementId;
  }

  if (!target.__sherazGa4ScriptRequested && target.document?.createElement) {
    const script = target.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    target.document.head.appendChild(script);
    target.__sherazGa4ScriptRequested = true;
  }
  return true;
}

/** Send typed allowlisted events only while the authoritative consent remains accepted. */
export function trackAnalyticsEvent(event, target = globalThis.window) {
  if (!hasConsent(target) || typeof target?.gtag !== 'function') return false;

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

/** Apply Google's consent state and make the local gate authoritative immediately. */
export function updateAnalyticsConsent(choice, target = globalThis.window) {
  if (choice !== 'accepted' && choice !== 'rejected') return false;
  try {
    target.localStorage?.setItem(consentKey, choice);
  } catch {
    if (choice === 'accepted') return false;
  }
  if (typeof target?.gtag === 'function') {
    if (choice === 'rejected') {
      target.dataLayer = (target.dataLayer || []).filter((entry) => {
        return !(entry?.[0] === 'event' && ['page_view', 'contact_click', 'generate_lead'].includes(entry[1]));
      });
      target.gtag('consent', 'update', { analytics_storage: 'denied' });
    } else {
      target.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  }
  return true;
}
