import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/case-studies/order-inventory-consistency/`, lastModified, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${siteUrl}/case-studies/wildlife-detection/`, lastModified, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${siteUrl}/services/product-engineering/`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${siteUrl}/services/ai-integration/`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${siteUrl}/services/production-reliability/`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
  ];
}
