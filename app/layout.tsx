import type { Metadata } from 'next';
import './globals.css';
import { siteUrl } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Sheraz Zafar | Senior Software & Systems Engineer',
  description: 'Sheraz Zafar is a senior software and systems engineer in Pakistan, building SaaS products, complex workflows, AI integrations, and dependable production systems for teams worldwide.',
  applicationName: 'Sheraz Zafar — Engineering Portfolio',
  authors: [{ name: 'Sheraz Zafar', url: siteUrl }],
  creator: 'Sheraz Zafar',
  publisher: 'Sheraz Zafar',
  category: 'technology',
  alternates: { canonical: '/' },
  openGraph: { title: 'Sheraz Zafar | Senior Software & Systems Engineer', description: 'SaaS product engineering, complex workflows, AI integration, and production systems engineering.', url: `${siteUrl}/`, siteName: 'Sheraz Zafar', locale: 'en_US', type: 'profile', images: [{ url: '/assets/sheraz-portrait.png', width: 1254, height: 1254, alt: 'Sheraz Zafar, senior software and systems engineer' }] },
  twitter: { card: 'summary_large_image', title: 'Sheraz Zafar | Senior Software & Systems Engineer', description: 'SaaS product engineering, complex workflows, AI integration, and production systems engineering.', images: ['/assets/sheraz-portrait.png'] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Person', '@id': `${siteUrl}/#person`, name: 'Sheraz Zafar', url: `${siteUrl}/`, image: `${siteUrl}/assets/sheraz-portrait.png`, jobTitle: 'Senior Software and Systems Engineer', description: 'Product-focused software engineer building SaaS applications, backend systems, AI integrations, and dependable production workflows.', email: 'mailto:sherazzafar148@gmail.com', sameAs: ['https://github.com/sheraz-zafar', 'https://www.linkedin.com/in/sheraz-zafar/'], knowsAbout: ['SaaS product engineering', 'Full-stack engineering', 'Production systems engineering', 'AI integration', 'Retrieval augmented generation', 'Real-time systems', 'Distributed workflows', 'Production reliability', 'Next.js', 'React', 'TypeScript', 'Node.js', 'NestJS', 'Laravel', 'Python', 'Django', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker'] },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'Sheraz Zafar — Product & Systems Engineering', inLanguage: 'en', publisher: { '@id': `${siteUrl}/#person` } },
    { '@type': 'ProfilePage', '@id': `${siteUrl}/#profile`, url: `${siteUrl}/`, name: 'Sheraz Zafar — Senior Software & Systems Engineer', mainEntity: { '@id': `${siteUrl}/#person` }, isPartOf: { '@id': `${siteUrl}/#website` } },
  ] };
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body></html>;
}
