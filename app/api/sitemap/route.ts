import { createClient } from "@/app/utils/supabase/client";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";

export async function GET() {
  const supabase = createClient();
  const baseUrl = 'https://onlyremotejobs.me';

  // Fetch all unique job titles and experience levels
  const { data: jobs } = await supabase
    .from('jobs_tn')
    .select('title, experience_level, company_name, created_at')
    .order('created_at', { ascending: false });

  const urlEntries = new Set<string>();

  // Add static pages
  urlEntries.add(generateUrlEntry(`${baseUrl}`, 1.0, 'yearly'));
  urlEntries.add(generateUrlEntry(`${baseUrl}/jobs`, 0.9, 'daily'));

  // Add location pages
  jobLocationOptions.forEach(location => {
    urlEntries.add(generateUrlEntry(`${baseUrl}/remote-jobs-in-${location.slug}`, 0.8, 'weekly'));
  });

  // Add job pages
  if (jobs) {
    jobs.forEach(job => {
      if (job.title && job.company_name) {
        const companySlug = encodeURIComponent(job.company_name);
        const jobSlug = encodeURIComponent(job.title.toLowerCase().replace(/\s+/g, '-'));
        const jobUrl = `${baseUrl}/companies/${companySlug}/jobs/${jobSlug}`;
        urlEntries.add(generateUrlEntry(jobUrl, 0.8, 'daily'));
      }
    });
  }

  // Generate the complete XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urlEntries).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function generateUrlEntry(url: string, priority: number, changefreq: string): string {
  const escapedUrl = url
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const lastmod = new Date().toISOString();

  return `  <url>
    <loc>${escapedUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}