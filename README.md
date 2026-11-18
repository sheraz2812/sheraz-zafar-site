# Sheraz Zafar — Engineering Portfolio

A Next.js portfolio for Sheraz Zafar, senior software and systems engineer. The site uses a server-side route for contact form email delivery and is deployed on Vercel.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The project runs on Vercel with the Next.js server runtime. The contact form uses Resend to send a branded inquiry notification to Sheraz and a separate receipt to the person who submitted it.

## Contact email configuration

Set these environment variables in Vercel (Production and Preview):

- `RESEND_API_KEY` — Resend secret API key; never commit it.
- `CONTACT_FROM_EMAIL` — verified Resend sender, for example `Sheraz Dev Solutions <website@mail.sherazdevsolutions.com>`.
- `CONTACT_TO_EMAIL` — inquiry destination; defaults to `sherazzafar148@gmail.com`.

The sender domain must be verified in Resend and its displayed DNS records added at the domain's DNS provider before live delivery will work. The form sends two transactional emails and does not store submissions in this website.

## Public content

Client project names and identifying implementation details are generalized. The interactive payment and inventory case analysis is explicitly illustrative and is not presented as a client deployment.
