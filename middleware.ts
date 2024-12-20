
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/app/utils/supabase/middleware'
import { createClient } from "@/app/utils/supabase/server"

const publicRoutes = [
  '/login',
  '/signup',
  '/jobs',
  '/companies/.*/jobs/.*', // Updated regex for job details pages
  '/companies',
  '/jobs/.*',  // Add this for job detail pages
  '/[^/]+/jobs/[^/]+',  // Add this pattern for company job detail pages
  '/companies/.*/jobs/.*',
  '/company/.*',
  '/api/.*',
  '/blog/.*',
  '/auth/callback',
  '/pricing'
];

const bypassRoutes = [
  '/api/webhooks/stripe',
  '/api/create-checkout-session',
  '/_next',
  '/favicon.ico',
  '/static',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (bypassRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  console.log('Middleware - Processing request for:', pathname);
  if (pathname === '/') {
    console.log('Middleware - Root path access');
    return NextResponse.next();
  }


  if (pathname === '/auth/callback') {
    console.log('Middleware - Processing auth callback');
    return NextResponse.next();
  }

  if (bypassRoutes.some(route =>
    pathname.startsWith(route) ||
    pathname.match(new RegExp(route)))) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route ||
    pathname.match(new RegExp(`^${route}$`)));

  try {
    if (pathname !== '/') {
    const response = await updateSession(request);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    console.log('Middleware - User check:', { hasUser: !!user, path: pathname });

    if (user && ['/login', '/signup'].includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (isPublicRoute) {
      console.log('Middleware - Public route access:', pathname);
      return response;
    }

    if (!user && !isPublicRoute) {
      console.log('Middleware - Unauthenticated user accessing:', pathname);
      console.log('Middleware - Redirecting unauthenticated user to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  }
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware - Error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks/stripe|api/create-checkout-session).*)'
  ],
}