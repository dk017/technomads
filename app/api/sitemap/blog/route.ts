import { NextResponse } from 'next/server';

export async function GET() {
  // Add your blog posts here
  const blogPosts = [
    'answer-where-do-you-see-yourself-in-5-years'
    // Add more blog posts as they're created
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://onlyremotejobs.me</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${blogPosts.map(post => `
        <url>
          <loc>https://onlyremotejobs.me/blog/${post}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')}
    </urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}