import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: 'https://sherazdevsolutions.com/', lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: 'https://sherazdevsolutions.com/case-studies/order-inventory-consistency/', lastModified, changeFrequency: 'yearly', priority: 0.8 },
    { url: 'https://sherazdevsolutions.com/services/product-engineering/', lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: 'https://sherazdevsolutions.com/services/ai-integration/', lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: 'https://sherazdevsolutions.com/services/production-reliability/', lastModified, changeFrequency: 'monthly', priority: 0.85 },
  ];
}
