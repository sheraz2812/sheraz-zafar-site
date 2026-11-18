'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import styles from './contact-form.module.css';

type SubmissionState = { kind: 'success' | 'error'; message: string } | null;

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<SubmissionState>(null);
  const idempotencyKey = useRef<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();

    setSending(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey.current,
        },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          project: data.get('project'),
          problem: data.get('problem'),
          budget: data.get('budget'),
          timeline: data.get('timeline'),
          company_website: data.get('company_website'),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your message could not be sent. Please try again.');

      form.reset();
      idempotencyKey.current = null;
      setStatus({
        kind: 'success',
        message: 'Thanks for reaching out. Your message has been sent, and a confirmation email is on its way to your inbox.',
      });
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again or email Sheraz directly.',
      });
    } finally {
      setSending(false);
    }
  }

  function resetSubmissionKey() {
    idempotencyKey.current = null;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-row">
        <label>Your name<input name="name" autoComplete="name" maxLength={120} required placeholder="Name" onChange={resetSubmissionKey}/></label>
        <label>Work email<input name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@company.com" onChange={resetSubmissionKey}/></label>
      </div>
      <div className="form-row">
        <label>Company<input name="company" autoComplete="organization" maxLength={160} placeholder="Company (optional)" onChange={resetSubmissionKey}/></label>
        <label>Project type<select name="project" defaultValue="" onChange={resetSubmissionKey}>
          <option value="">Choose a project type</option><option>Product engineering</option><option>Complex feature implementation</option><option>AI integration</option><option>Technical discovery</option><option>Modernization or reliability</option><option>Other</option>
        </select></label>
      </div>
      <label>What are you trying to solve?<textarea name="problem" required maxLength={3000} rows={5} placeholder="A few sentences about the product, the problem, and what you need help deciding or building." onChange={resetSubmissionKey}/></label>
      <div className="form-row">
        <label>Budget range <small>Optional</small><select name="budget" defaultValue="Prefer not to say" onChange={resetSubmissionKey}>
          <option>Prefer not to say</option><option>Under $5,000</option><option>$5,000–$15,000</option><option>$15,000–$40,000</option><option>$40,000+</option><option>To be discussed</option>
        </select></label>
        <label>Timeline <small>Optional</small><select name="timeline" defaultValue="Flexible / to be discussed" onChange={resetSubmissionKey}>
          <option>Flexible / to be discussed</option><option>Within 2 weeks</option><option>Within a month</option><option>1–3 months</option><option>Researching options</option>
        </select></label>
      </div>
      <p className="privacy-note">Your inquiry is emailed to Sheraz. You’ll receive a confirmation at the work email you provide. The site does not store form submissions.</p>
      {status && <p className={`${styles.status} ${status.kind === 'success' ? styles.success : styles.error}`} role={status.kind === 'error' ? 'alert' : 'status'} aria-live="polite">{status.message}</p>}
      <button className="cta-primary" type="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Send inquiry'} <Mail size={15}/>
      </button>
    </form>
  );
}
