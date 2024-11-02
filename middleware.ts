import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/app/utils/supabase/middleware'
import { createServerClient } from "@supabase/ssr"

// Define public routes that don't require authentication

const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/jobs/.*',
  '/jobs',
  '/company/.*',
  '/companies/.*',
  '/api/.*',
];


// Define auth-related routes that should bypass middleware completely
const bypassRoutes = [
  '/api/webhook/stripe',
  '/_next',
  '/favicon.ico',
  '/static',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;


  if (bypassRoutes.some(route =>
    pathname.startsWith(route) ||
    pathname.match(new RegExp(route)))) {
    return NextResponse.next();
  }

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route ||
    pathname.match(new RegExp(`^${route}$`)));

  try {
    const response = await updateSession(request);

    // If it's a public route, always allow access
    if (isPublicRoute) {
      return response;
    }

    // For protected routes, check authentication
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // If user is not authenticated and trying to access protected route
    if (!user && !isPublicRoute) {
      console.log('Middleware - Redirecting unauthenticated user to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  } catch (error) {
    console.error('Middleware - Error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
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