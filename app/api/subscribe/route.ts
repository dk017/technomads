import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { email, name, keyword = null, location = null } = await request.json();
    const supabase = createClient();

    const payload = {
      email,
      name,
      ...(keyword && { keyword }),
      ...(location && { location })
    };

    const { error } = await supabase
      .from('subscribers')
      .insert([payload]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    );
  }
}