import { createClient } from "@/app/utils/supabase/client";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";

export async function GET() {
  const supabase = createClient();

  // Fetch all unique job titles and experience levels
  const { data: jobs } = await supabase
    .from('jobs_tn')
    .select('title, experience_level')
    .order('title');

  // Generate URLs for different page types
  const urls: string[] = [];
  const baseUrl = 'https://onlyremotejobs.me'; // Replace with your actual domain

  // Add static pages
  urls.push(baseUrl);
  urls.push(`${baseUrl}/jobs`);

  // Add location-based pages
  jobLocationOptions.forEach(location => {
    urls.push(`${baseUrl}/remote-jobs-in-${location.slug}`);
  });

  // Process jobs data to generate dynamic URLs
  if (jobs) {
    const processedTitles = new Set<string>();

    jobs.forEach(job => {
      if (job.title) {
        // Convert title to URL-friendly slug
        const titleSlug = job.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Basic job title URL
        if (!processedTitles.has(titleSlug)) {
          urls.push(`${baseUrl}/remote-${titleSlug}-jobs`);
          processedTitles.add(titleSlug);

          // Add experience level variants
          if (job.experience_level) {
            const expLevel = job.experience_level.toLowerCase().replace(/\s+/g, '-');
            urls.push(`${baseUrl}/${expLevel}-remote-${titleSlug}-jobs`);
          }

          // Add location variants
          jobLocationOptions.forEach(location => {
            urls.push(`${baseUrl}/remote-${titleSlug}-jobs-in-${location.slug}`);
          });
        }
      }
    });
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(url => `
        <url>
          <loc>${url}</loc>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')}
    </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}