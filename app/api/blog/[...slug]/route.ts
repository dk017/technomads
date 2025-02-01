import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Get GitHub details from environment variables with fallbacks
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'dk017';
const GITHUB_REPO = process.env.GITHUB_REPO || 'technomads';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  noStore();

  try {
    const response = await fetch(
      `