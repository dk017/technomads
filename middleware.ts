import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/app/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/webhook/stripe") {
    console.log('Webhook route detected, bypassing middleware');
    return NextResponse.next();
  }
  console.log("Applying middleware to route:", request.nextUrl.pathname);

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}