import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jobLocationOptions } from '@/app/constants/jobLocationOptions';
import { titleOptions } from '@/app/constants/titleOptions';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const URLS_PER_SITEMAP = 45000;


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
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const sitemapId = parseInt(params.id);
    const startRange = (sitemapId - 1) * URLS_PER_SITEMAP;

    const { data: jobs, error } = await supabase
      .from('jobs_tn')
      .select('company_slug, job_slug, created_at')
      .range(startRange, startRange + URLS_PER_SITEMAP - 1)
      .order('created_at', { ascending: false });

    if (error || !jobs) {
      throw error || new Error('Could not fetch jobs');
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${jobs.map(job => `  <url>
    <loc>https://onlyremotejobs.me/${escapeXml(job.company_slug)}/jobs/${escapeXml(job.job_slug)}</loc>
    <lastmod>${new Date(job.created_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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