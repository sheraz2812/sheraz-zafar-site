export type AnalyticsEvent =
  | { name: 'page_view'; pagePath: string }
  | { name: 'contact_click'; method: 'form' | 'email' | 'phone' }
  | { name: 'lead_submission_success'; method: 'contact_form'; submissionId: string };

export function isAnalyticsConfigured(provider: string | undefined, measurementId: string | undefined): boolean;
export function trackAnalyticsEvent(event: AnalyticsEvent, target?: { gtag?: (...args: unknown[]) => void }): boolean;
