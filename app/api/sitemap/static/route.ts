import { NextResponse } from 'next/server';
import { jobLocationOptions } from '@/app/constants/jobLocationOptions';
import { titleOptions } from '@/app/constants/titleOptions';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

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

export async function GET() {
  try {
    // Generate static URLs (title-based, location-based, and combinations)
    const staticUrls = [
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

      // Combined URLs
      ...titleOptions.flatMap(title =>
        jobLocationOptions.map(location => ({
          loc: `https://onlyremotejobs.me/remote-${title.value}-jobs-in-${location.slug}`,
          changefreq: 'daily',
          priority: '0.6'
        }))
      ),

      // Experience level variations
      ...['entry-level', 'mid-level', 'senior'].flatMap(exp => [
        {
          loc: `https://onlyremotejobs.me/${exp}-remote-jobs`,
          changefreq: 'daily',
          priority: '0.7'
        },
        ...titleOptions.map(title => ({
          loc: `https://onlyremotejobs.me/${exp}-remote-${title.value}-jobs`,
          changefreq: 'daily',
          priority: '0.6'
        })),
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
${staticUrls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <changefreq>${url.changefreq}</changefreq>
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
    console.error('Error generating static sitemap:', error);
    return new NextResponse('Error generating static sitemap', { status: 500 });
  }
} 