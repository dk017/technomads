import { MetadataRoute } from 'next'
import { createClient } from '@/app/utils/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the Cloudflare Pages URL if available, otherwise fallback to relative paths
  const baseUrl = process.env.CF_PAGES_URL || ''
  const supabase = createClient()

  // Fetch all jobs
  const { data: jobs } = await supabase
    .from('jobs_tn')
    .select('company_name, job_slug')

  const jobsUrls = jobs?.map((job) => ({
    url: `${baseUrl}/companies/${job.company_name}/jobs/${job.job_slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) || []

  return [
    {
      url: baseUrl || '/',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...jobsUrls,
  ]
}