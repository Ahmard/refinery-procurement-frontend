import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Route Protection
 * 
 * Runs on the Edge before every request to protected routes.
 * Checks for authentication token and redirects to login if missing.
 * 
 * Benefits:
 * - No flash of unauthenticated content
 * - Works with App Router
 * - Single source of truth for auth logic
 * - Cannot be bypassed by client-side code
 */

export function middleware(request: NextRequest) {
  // Get auth token from cookies
  const authToken = request.cookies.get('auth_token');
  
  // Define protected routes
  const protectedRoutes = [
    '/items',
    '/purchase-orders',
    '/admin',
  ];
  
  // Define public routes (accessible without auth)
  const publicRoutes = [
    '/login',
  ];
  
  // Check if current path is exactly "/" (home page)
  const isHomePage = request.nextUrl.pathname === '/';
  
  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Check if current path is a protected route
  const isProtectedRoute = !isPublicRoute && (isHomePage || protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  ));
  
  // If route is protected and no token, redirect to login
  if (isProtectedRoute && !authToken) {
    // Create login URL with returnTo parameter
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
    
    console.log(
      `[Middleware] Protected route accessed without auth: ${request.nextUrl.pathname}`,
      '-> Redirecting to login'
    );
    
    return NextResponse.redirect(loginUrl);
  }
  
  // Allow request to proceed
  return NextResponse.next();
}

/**
 * Configure which routes the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, sitemap.xml, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
