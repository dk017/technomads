import { createClient } from "@/app/utils/supabase/client";
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";
import { titleOptions } from "@/app/constants/titleOptions";
export async function GET() {
  const supabase = createClient();
  const baseUrl = 'https://onlyremotejobs.me';
  const experienceLevels = ['senior', 'mid-level', 'entry-level'];
  const urlPrefixes = ['remote', 'work-from-home'];

  const urlEntries = new Set<string>();

  // Add static pages
  urlEntries.add(generateUrlEntry(`${baseUrl}`, 1.0, 'yearly'));
  urlEntries.add(generateUrlEntry(`${baseUrl}/jobs`, 0.9, 'daily'));
  urlEntries.add(generateUrlEntry(`${baseUrl}/remote-hiring-companies`, 0.9, 'daily'));

  // Add location pages with variations
  jobLocationOptions.forEach(location => {
    urlPrefixes.forEach(prefix => {
      // Basic location pages
      urlEntries.add(generateUrlEntry(`${baseUrl}/${prefix}-jobs-in-${location.slug}`, 0.8, 'weekly'));

      // Combination with titles
      titleOptions.forEach(title => {
        // Basic title + location
        urlEntries.add(generateUrlEntry(
          `${baseUrl}/${prefix}-${title.value}-jobs-in-${location.slug}`,
          0.8,
          'weekly'
        ));

        // Experience + title + location
        experienceLevels.forEach(exp => {
          urlEntries.add(generateUrlEntry(
            `${baseUrl}/${exp}-${prefix}-${title.value}-jobs-in-${location.slug}`,
            0.8,
            'weekly'
          ));
        });
      });
    });
  });

  // Add title-only pages with variations
  titleOptions.forEach(title => {
    urlPrefixes.forEach(prefix => {
      // Basic title
      urlEntries.add(generateUrlEntry(`${baseUrl}/${prefix}-${title.value}-jobs`, 0.8, 'weekly'));

      // Experience + title
      experienceLevels.forEach(exp => {
        urlEntries.add(generateUrlEntry(
          `${baseUrl}/${exp}-${prefix}-${title.value}-jobs`,
          0.8,
          'weekly'
        ));
      });
    });
  });

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