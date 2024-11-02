import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  console.log("Middleware - Processing request for:", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
)

try {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Middleware - Processing request for:", request.nextUrl.pathname);
  console.log("Middleware - User check:", {
    hasUser: !!user,
    path: request.nextUrl.pathname
  });

  if (!user) {
    console.log("Middleware - Unauthenticated user accessing:", request.nextUrl.pathname);
  }

} catch (error) {
  console.error("Middleware - Error checking user:", error);
}

  return supabaseResponse;
}