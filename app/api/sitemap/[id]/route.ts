import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jobLocationOptions } from '@/app/constants/jobLocationOptions';
import { titleOptions } from '@/app/constants/titleOptions';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const URLS_PER_SITEMAP = 45000;

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority: string;
}

// Helper function to escape special characters in XML
function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sitemapId = parseInt(params.id);
    const startRange = (sitemapId - 1) * URLS_PER_SITEMAP;

    // Fetch jobs with company info
    const { data: jobs } = await supabase
      .from('jobs_tn')
      .select('job_slug, company_slug, created_at')
      .range(startRange, startRange + URLS_PER_SITEMAP - 1)
      .order('created_at', { ascending: false });

    if (!jobs) {
      throw new Error('Could not fetch jobs');
    }

    // Generate URLs for all patterns
    const urls: SitemapUrl[] = [
      // Individual job and company pages
      ...jobs.map(job => ({
        loc: `https://onlyremotejobs.me/${job.company_slug}/jobs/${job.job_slug}`,
        lastmod: new Date(job.created_at).toISOString(),
        changefreq: 'daily',
        priority: '0.8'
      })),

      // Title-based URLs
      ...titleOptions.map(title => ({
        loc: `https://onlyremotejobs.me/remote-${title.value}-jobs`,
        changefreq: 'daily',
        priority: '0.7'
      })),

      // Location-based URLs
      ...jobLocationOptions.map(location => ({
        loc: `https://onlyremotejobs.me/remote-jobs-in-${location.slug}`,
        changefreq: 'daily',
        priority: '0.7'
      })),

      // Combined title and location URLs
      ...titleOptions.flatMap(title =>
        jobLocationOptions.map(location => ({
          loc: `https://onlyremotejobs.me/remote-${title.value}-jobs-in-${location.slug}`,
          changefreq: 'daily',
          priority: '0.6'
        }))
      ),

      // Experience level variations
      ...['entry-level', 'mid-level', 'senior'].flatMap(exp => [
        // Experience only
        {
          loc: `https://onlyremotejobs.me/${exp}-remote-jobs`,
          changefreq: 'daily',
          priority: '0.7'
        },
        // Experience + title
        ...titleOptions.map(title => ({
          loc: `https://onlyremotejobs.me/${exp}-remote-${title.value}-jobs`,
          changefreq: 'daily',
          priority: '0.6'
        })),
        // Experience + title + location
        ...titleOptions.flatMap(title =>
          jobLocationOptions.map(location => ({
            loc: `https://onlyremotejobs.me/${exp}-remote-${title.value}-jobs-in-${location.slug}`,
            changefreq: 'daily',
            priority: '0.6'
          }))
        )
      ])
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq || 'daily'}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}