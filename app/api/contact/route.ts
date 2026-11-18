import { Resend } from 'resend';

export const runtime = 'nodejs';
export const maxDuration = 15;

type Inquiry = {
  name: string;
  email: string;
  company: string;
  project: string;
  problem: string;
  budget: string;
  timeline: string;
  company_website: string;
};

const projectTypes = new Set([
  'Product engineering',
  'Complex feature implementation',
  'AI integration',
  'Technical discovery',
  'Modernization or reliability',
  'Other',
]);
const budgets = new Set(['Prefer not to say', 'Under $5,000', '$5,000–$15,000', '$15,000–$40,000', '$40,000+', 'To be discussed']);
const timelines = new Set(['Flexible / to be discussed', 'Within 2 weeks', 'Within a month', '1–3 months', 'Researching options']);
const recentRequests = new Map<string, number[]>();
const windowMs = 10 * 60 * 1000;
const maxPerWindow = 5;

function clean(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[\u0000-\u001f\u007f]/g, '').slice(0, maxLength);
}

function allowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.host.toLowerCase();
    const requestHost = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(',')[0].trim().toLowerCase();
    const productionHosts = new Set(['sherazdevsolutions.com', 'www.sherazdevsolutions.com']);
    if (productionHosts.has(originUrl.hostname.toLowerCase())) return originUrl.protocol === 'https:';
    if (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1') return originHost === requestHost;
    return originUrl.protocol === 'https:' && originHost === requestHost && originUrl.hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

function rateLimited(request: Request): boolean {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const address = forwardedFor || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const attempts = (recentRequests.get(address) || []).filter((time) => now - time < windowMs);
  if (attempts.length >= maxPerWindow) {
    recentRequests.set(address, attempts);
    return true;
  }
  attempts.push(now);
  recentRequests.set(address, attempts);
  return false;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

function emailShell(preheader: string, content: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f1f1ed;font-family:Arial,Helvetica,sans-serif;color:#17212a"><span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden">${escapeHtml(preheader)}</span><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f1ed;padding:32px 12px"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#fff"><tr><td style="background:#526b78;padding:26px 34px;color:#fff"><div style="font-size:12px;letter-spacing:2px;font-weight:bold">SHERAZ DEV SOLUTIONS</div><div style="font-size:12px;margin-top:7px;color:#e5ece8">PRODUCT &amp; SYSTEMS ENGINEERING</div></td></tr><tr><td style="padding:34px">${content}</td></tr><tr><td style="padding:20px 34px;background:#f7f7f4;border-top:1px solid #e3e5e1;color:#65717a;font-size:12px;line-height:1.6">Sheraz Zafar · Senior Software &amp; Systems Engineer<br><a href="https://www.sherazdevsolutions.com/" style="color:#526b78">sherazdevsolutions.com</a> · <a href="mailto:sherazzafar148@gmail.com" style="color:#526b78">sherazzafar148@gmail.com</a></td></tr></table></td></tr></table></body></html>`;
}

export async function POST(request: Request) {
  if (!allowedOrigin(request)) return Response.json({ error: 'This request could not be verified. Please refresh the page and try again.' }, { status: 403 });
  if (rateLimited(request)) return Response.json({ error: 'Too many submissions. Please wait a few minutes and try again.' }, { status: 429 });

  const length = Number(request.headers.get('content-length') || 0);
  if (length > 12_000) return Response.json({ error: 'Your message is too long. Please shorten it and try again.' }, { status: 413 });

  let body: Partial<Inquiry>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Please check the form and try again.' }, { status: 400 });
  }

  // Quietly accept bot traps without sending or disclosing the filtering rule.
  if (clean(body.company_website, 200)) return Response.json({ ok: true });

  const inquiry: Inquiry = {
    name: clean(body.name, 120),
    email: clean(body.email, 254).toLowerCase(),
    company: clean(body.company, 160),
    project: clean(body.project, 80),
    problem: clean(body.problem, 3000),
    budget: clean(body.budget, 40),
    timeline: clean(body.timeline, 40),
    company_website: '',
  };

  if (!inquiry.name || !inquiry.problem || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    return Response.json({ error: 'Please provide your name, a valid work email, and a short description of the project.' }, { status: 400 });
  }
  if (inquiry.project && !projectTypes.has(inquiry.project)) return Response.json({ error: 'Please select a project type from the list.' }, { status: 400 });
  if (inquiry.budget && !budgets.has(inquiry.budget)) return Response.json({ error: 'Please select a budget option from the list.' }, { status: 400 });
  if (inquiry.timeline && !timelines.has(inquiry.timeline)) return Response.json({ error: 'Please select a timeline option from the list.' }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || 'sherazzafar148@gmail.com';
  if (!apiKey || !from) return Response.json({ error: 'Email delivery is not configured yet. Please email Sheraz directly.' }, { status: 503 });

  const resend = new Resend(apiKey);
  const escaped = {
    name: escapeHtml(inquiry.name),
    email: escapeHtml(inquiry.email),
    company: escapeHtml(inquiry.company || 'Not provided'),
    project: escapeHtml(inquiry.project || 'Not specified'),
    problem: escapeHtml(inquiry.problem).replace(/\n/g, '<br>'),
    budget: escapeHtml(inquiry.budget || 'Not provided'),
    timeline: escapeHtml(inquiry.timeline || 'Not provided'),
  };
  const summary = `Name: ${inquiry.name}\nEmail: ${inquiry.email}\nCompany: ${inquiry.company || 'Not provided'}\nProject: ${inquiry.project || 'Not specified'}\nBudget: ${inquiry.budget || 'Not provided'}\nTimeline: ${inquiry.timeline || 'Not provided'}\n\nWhat they need:\n${inquiry.problem}`;
  const requestId = request.headers.get('idempotency-key')?.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || crypto.randomUUID();

  try {
    const [ownerResult, clientResult] = await Promise.all([
      resend.emails.send({
        from,
        to: [to],
        replyTo: inquiry.email,
        subject: `[Website inquiry] ${inquiry.project || 'Project discussion'} — ${inquiry.name}`,
        text: summary,
        html: emailShell('A new project inquiry was submitted on your website.', `<h1 style="margin:0 0 8px;font-size:24px;line-height:1.3">New project inquiry</h1><p style="margin:0 0 24px;color:#64717a;font-size:14px">A visitor sent this through the contact form.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;line-height:1.6"><tr><td style="padding:9px 0;color:#6b7780;width:130px">Name</td><td style="padding:9px 0;font-weight:bold">${escaped.name}</td></tr><tr><td style="padding:9px 0;color:#6b7780">Email</td><td style="padding:9px 0"><a href="mailto:${escaped.email}" style="color:#526b78">${escaped.email}</a></td></tr><tr><td style="padding:9px 0;color:#6b7780">Company</td><td style="padding:9px 0">${escaped.company}</td></tr><tr><td style="padding:9px 0;color:#6b7780">Project type</td><td style="padding:9px 0">${escaped.project}</td></tr><tr><td style="padding:9px 0;color:#6b7780">Budget range</td><td style="padding:9px 0">${escaped.budget}</td></tr><tr><td style="padding:9px 0;color:#6b7780">Timeline</td><td style="padding:9px 0">${escaped.timeline}</td></tr></table><div style="margin-top:24px;padding:20px;background:#f5f5f1;border-left:3px solid #ed624a"><div style="font-size:11px;letter-spacing:1px;color:#66747b;margin-bottom:9px">WHAT THEY NEED</div><div style="font-size:14px;line-height:1.7">${escaped.problem}</div></div><p style="margin:24px 0 0;font-size:13px;color:#66747b">Reply directly to this email to respond to ${escaped.name}.</p>`),
      }, { idempotencyKey: `${requestId}-owner` }),
      resend.emails.send({
        from,
        to: [inquiry.email],
        replyTo: to,
        subject: 'We received your inquiry — Sheraz Dev Solutions',
        text: `Hi ${inquiry.name},\n\nThanks for getting in touch with Sheraz Dev Solutions. Your project inquiry has been received. Sheraz will review the details and follow up by email.\n\nYour message:\n${summary}\n\nRegards,\nSheraz Zafar\nSheraz Dev Solutions\nhttps://www.sherazdevsolutions.com/`,
        html: emailShell('Your project inquiry has reached Sheraz Dev Solutions.', `<h1 style="margin:0 0 12px;font-size:25px;line-height:1.3">Thanks for getting in touch, ${escaped.name}.</h1><p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#53616b">Your inquiry has reached Sheraz. He’ll review the details and follow up by email.</p><div style="margin:24px 0;padding:20px;background:#f5f5f1;border-left:3px solid #ed624a"><div style="font-size:11px;letter-spacing:1px;color:#66747b;margin-bottom:10px">YOUR INQUIRY</div><p style="margin:0 0 8px;font-size:13px;color:#53616b"><strong>Project:</strong> ${escaped.project}</p><p style="margin:0 0 8px;font-size:13px;color:#53616b"><strong>Company:</strong> ${escaped.company}</p><p style="margin:0;font-size:14px;line-height:1.7;color:#17212a">${escaped.problem}</p></div><p style="margin:0;font-size:14px;line-height:1.7;color:#53616b">If you need to add anything, reply to this email and it will reach Sheraz.</p><p style="margin:24px 0 0;font-size:14px;line-height:1.7">Regards,<br><strong>Sheraz Zafar</strong><br>Sheraz Dev Solutions</p>`),
      }, { idempotencyKey: `${requestId}-client` }),
    ]);

    if (ownerResult.error || clientResult.error) {
      console.error('Contact email delivery partially failed', { owner: ownerResult.error?.name, client: clientResult.error?.name });
      return Response.json({ error: 'Email delivery could not be confirmed. Please try again or email Sheraz directly.' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Contact email delivery failed', error instanceof Error ? error.name : 'unknown');
    return Response.json({ error: 'Email delivery could not be completed. Please try again or email Sheraz directly.' }, { status: 502 });
  }
}
