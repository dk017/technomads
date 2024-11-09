import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
export const runtime = 'edge'; // Add this line


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 15;
  const offset = (page - 1) * limit;

  const supabase = createClient();

  const { data: companies, error } = await supabase
    .from("companies")
    .select("*")
    .range(offset, offset + limit - 1)
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ companies });
}