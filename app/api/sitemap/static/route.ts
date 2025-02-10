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
    const staticUrls = [
      ...titleOptions.map(title => ({
        loc: `https://onlyremotejobs.me/remote-${escapeXml(title.value)}-jobs`,
        changefreq: 'daily',
        priority: '0.7'
      })),
      ...jobLocationOptions.map(location => ({
        loc: `https://onlyremotejobs.me/remote-jobs-in-${escapeXml(location.slug)}`,
        changefreq: 'daily',
        priority: '0.7'
      })),
      ...titleOptions.flatMap(title =>
        jobLocationOptions.map(location => ({
          loc: `https://onlyremotejobs.me/remote-${escapeXml(title.value)}-jobs-in-${escapeXml(location.slug)}`,
          changefreq: 'daily',
          priority: '0.6'
        }))
      ),
      ...['entry-level', 'mid-level', 'senior'].flatMap(exp => [
        {
          loc: `https://onlyremotejobs.me/${escapeXml(exp)}-remote-jobs`,
          changefreq: 'daily',
          priority: '0.7'
        },
        ...titleOptions.map(title => ({
          loc: `https://onlyremotejobs.me/${escapeXml(exp)}-remote-${escapeXml(title.value)}-jobs`,
          changefreq: 'daily',
          priority: '0.6'
        }))
      ])
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
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