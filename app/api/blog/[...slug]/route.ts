import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    const filePath = path.join(process.cwd(), 'content', 'blog', `${params.slug.join('/')}.mdx`);
    const content = await readFile(filePath, 'utf-8');

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    return new NextResponse('Not found', { status: 404 });
  }
}