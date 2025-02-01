import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Get GitHub details from environment variables with fallbacks
const GITHUB_USERNAME = process.env.GITHUB_USERNAME ;
const GITHUB_REPO = process.env.GITHUB_REPO ;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  noStore();

  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/content/blog/${params.slug.join('/')}.mdx`
    );

    if (!response.ok) {
      return new NextResponse('Not found', { status: 404 });
    }

    const content = await response.text();

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}