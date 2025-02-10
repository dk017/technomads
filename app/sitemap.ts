import { MetadataRoute } from 'next'
import { createClient } from '@/app/utils/supabase/client'

const URLS_PER_SITEMAP = 45000; // Keep under 50k limit

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.CF_PAGES_URL || 'https://onlyremotejobs.me'
  const supabase = createClient()

  // Get total count of jobs
  const { count } = await supabase
    .from('jobs_tn')
    .select('*', { count: 'exact', head: true });

  if (!count) {
    return [];
  }

  // Calculate number of sitemaps needed
  const numberOfSitemaps = Math.ceil(count / URLS_PER_SITEMAP);

  const sitemaps: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...Array.from({ length: numberOfSitemaps }, (_, i) => ({
      url: `${baseUrl}/api/sitemap/${i + 1}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/api/sitemap/static`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }
  ];

  return sitemaps;
}