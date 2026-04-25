import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Public routes that don't require authentication
const publicRoutes = ['/login', '/_next', '/favicon.ico'];

// Routes accessible by lawyers
const lawyerRoutes = ['/dashboard'];

// Routes accessible by clients
const clientRoutes = ['/portal'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          request.cookies.getAll().forEach((cookie) => {
            if (!cookiesToSet.some((c) => c.name === cookie.name)) {
              request.cookies.delete(cookie.name);
            }
          });
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user }, error } = await supabase.auth.getUser();

  // If not authenticated, redirect to login
  if (error || !user) {
    if (pathname === '/') {
      return NextResponse.next();
    }
    if (pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Fetch user role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const userRole = profile?.role || 'client';

  // Role-based redirects for root path
  if (pathname === '/') {
    if (userRole === 'lawyer') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/portal', request.url));
  }

  // Role-based route protection
  if (pathname.startsWith('/dashboard') && userRole !== 'lawyer') {
    return NextResponse.redirect(new URL('/portal', request.url));
  }

  if (pathname.startsWith('/portal') && userRole !== 'client') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};