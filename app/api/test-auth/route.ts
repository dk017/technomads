   // technomads/app/api/test-auth/route.ts
   import { NextResponse } from 'next/server';
   import { cookies } from 'next/headers';
   import { createClient } from '@/app/utils/supabase/server';

   export async function GET(req: Request) {
     const cookieStore = cookies();
     const supabase = createClient(cookieStore);

     const { data: { session } } = await supabase.auth.getSession();

     if (session) {
       return NextResponse.json({ authenticated: true, user: session.user });
     } else {
       return NextResponse.json({ authenticated: false });
     }
   }