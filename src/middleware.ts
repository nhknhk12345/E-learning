import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Các routes không cần auth
const publicRoutes = ['/auth/login', '/auth/register', '/']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')
  const { pathname } = request.nextUrl

  // Cho phép truy cập public routes mà không cần auth
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Nếu đã có token và cố truy cập trang auth, redirect về home
  if (token && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Nếu chưa có token và truy cập protected route, redirect về login
  if (!token && !pathname.startsWith('/auth/')) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 