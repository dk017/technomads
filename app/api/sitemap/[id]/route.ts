import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const URLS_PER_SITEMAP = 45000;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sitemapId = parseInt(params.id);

    // Calculate range for this sitemap
    const startRange = (sitemapId - 1) * URLS_PER_SITEMAP;

    // Get jobs for this range
    const { data: jobs } = await supabase
      .from('jobs_tn')
      .select('job_slug, created_at')
      .range(startRange, startRange + URLS_PER_SITEMAP - 1)
      .order('created_at', { ascending: false });

    if (!jobs) {
      throw new Error('Could not fetch jobs');
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${jobs.map(job => `
          <url>
            <loc>https://onlyremotejobs.me/job/${job.job_slug}</loc>
            <lastmod>${new Date(job.created_at).toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
          </url>
        `).join('')}
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