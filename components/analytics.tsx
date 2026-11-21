'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { isAnalyticsConfigured, trackAnalyticsEvent } from '../lib/analytics.mjs';
import type { AnalyticsEvent } from '../lib/analytics.mjs';
import styles from './analytics.module.css';

const consentKey = 'sheraz-analytics-consent-v1';
const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const configured = isAnalyticsConfigured(provider, measurementId);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function AnalyticsTags({ id }: { id: string }) {
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />;
}

export function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(null);
  const [showPreferences, setShowPreferences] = useState(true);

  useEffect(() => {
    if (!configured) return;
    const saved = window.localStorage.getItem(consentKey);
    if (saved === 'accepted' || saved === 'rejected') {
      setConsent(saved);
      setShowPreferences(false);
    }
  }, []);

  useEffect(() => {
    if (consent !== 'accepted' || !configured || !measurementId) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer!.push(args));
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      anonymize_ip: true,
    });
  }, [consent]);

  useEffect(() => {
    if (consent !== 'accepted' || !configured) return;
    trackAnalyticsEvent({ name: 'page_view', pagePath: pathname || '/' });

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trackedLink = target.closest<HTMLAnchorElement>('[data-analytics-contact]');
      if (!trackedLink) return;
      const method = trackedLink.dataset.analyticsContact;
      if (method === 'form' || method === 'email' || method === 'phone') {
        trackAnalyticsEvent({ name: 'contact_click', method });
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [consent, pathname]);

  if (!configured) return null;

  function chooseConsent(choice: 'accepted' | 'rejected') {
    window.localStorage.setItem(consentKey, choice);
    setConsent(choice);
    setShowPreferences(false);
  }

  return <>
    {consent === 'accepted' && measurementId && <AnalyticsTags id={measurementId} />}
    {consent !== null && !showPreferences && <button className={styles.preferences} type="button" onClick={() => setShowPreferences(true)}>Analytics preferences</button>}
    {(consent === null || showPreferences) && <aside className={styles.notice} aria-label="Analytics preferences">
      <p>Optional site analytics help measure visits and successful inquiries. Form details are never sent to analytics.</p>
      <div><button type="button" onClick={() => chooseConsent('rejected')}>Reject analytics</button><button type="button" onClick={() => chooseConsent('accepted')}>Allow analytics</button></div>
    </aside>}
  </>;
}

export function trackSuccessfulLead(submissionId: string) {
  const event: AnalyticsEvent = { name: 'lead_submission_success', method: 'contact_form', submissionId };
  trackAnalyticsEvent(event);
}
