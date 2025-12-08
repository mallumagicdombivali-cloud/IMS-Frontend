import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  const token = request.cookies.get('token')?.value

  // 2. Define the protected routes
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isLoginRoute = request.nextUrl.pathname.startsWith('/login')

  // 3. SCENARIO: User tries to access Dashboard without a token
  if (isDashboardRoute && !token) {
    // Redirect them back to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 4. SCENARIO: User is already logged in but tries to access Login page
  if (isLoginRoute && token) {
    // Redirect them to dashboard (skip login)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/dashboard/:path*', // Protect /dashboard and all sub-routes
    '/login'             // Monitor /login to redirect if already auth'd
  ]
}