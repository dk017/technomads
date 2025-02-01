import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jobLocationOptions } from "@/app/constants/jobLocationOptions";
import { titleOptions } from "@/app/constants/titleOptions";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic'; // Mark as dynamic route
export const runtime = 'edge'; // Use edge runtime

const URLS_PER_SITEMAP = 45000;

export async function GET() {
  try {
    // Get total count of jobs
    const { count } = await supabase
      .from('jobs_tn')
      .select('*', { count: 'exact', head: true });

    if (!count) {
      throw new Error('Could not get job count');
    }

    // Calculate number of needed sitemaps
    const sitemapCount = Math.ceil(count / URLS_PER_SITEMAP);

    // Generate sitemap index XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${Array.from({ length: sitemapCount }, (_, i) => `
        <sitemap>
          <loc>https://onlyremotejobs.me/api/sitemap/${i + 1}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
      `).join('')}
      <sitemap>
        <loc>https://onlyremotejobs.me/api/sitemap/blog</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
    </sitemapindex>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      },
    });
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
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