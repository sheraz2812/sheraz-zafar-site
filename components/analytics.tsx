'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { initializeAnalytics, isAnalyticsConfigured, trackAnalyticsEvent, trackContactClickFromTarget, updateAnalyticsConsent } from '../lib/analytics.mjs';
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
    __sherazGa4Configured?: string;
    __sherazGa4ScriptRequested?: boolean;
  }
}

export function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(null);
  const [showPreferences, setShowPreferences] = useState(true);
  const lastPageView = useRef<string | null>(null);

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
    initializeAnalytics(measurementId, window);
  }, [consent]);

  useEffect(() => {
    if (consent !== 'accepted' || !configured) return;
    const pagePath = pathname || '/';
    if (lastPageView.current !== pagePath) {
      trackAnalyticsEvent({ name: 'page_view', pagePath }, window);
      lastPageView.current = pagePath;
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      trackContactClickFromTarget(target, window);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [consent, pathname]);

  if (!configured) return null;

  function chooseConsent(choice: 'accepted' | 'rejected') {
    updateAnalyticsConsent(choice, window);
    setConsent(choice);
    setShowPreferences(false);
  }

  return <>
    {consent !== null && !showPreferences && <button className={styles.preferences} type="button" onClick={() => setShowPreferences(true)}>Analytics preferences</button>}
    {(consent === null || showPreferences) && <aside className={styles.notice} aria-label="Analytics preferences">
      <p>Optional site analytics help measure visits and successful inquiries. Form details are never sent to analytics.</p>
      <div><button type="button" onClick={() => chooseConsent('rejected')}>Reject analytics</button><button type="button" onClick={() => chooseConsent('accepted')}>Allow analytics</button></div>
    </aside>}
  </>;
}

export function trackSuccessfulLead(submissionId: string) {
  const event: AnalyticsEvent = { name: 'lead_submission_success', method: 'contact_form', submissionId };
  trackAnalyticsEvent(event, window);
}
