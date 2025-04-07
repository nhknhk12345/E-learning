import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { User } from './types/auth'

// Các routes không cần auth
const publicRoutes = ['/auth/login', '/auth/register', '/courses', "/", "/payment/success", "/payment/failed", "/payment/deposit"]

function decodeJWT(token: string): User | null {
  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')
  const { pathname } = request.nextUrl

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  if (refreshToken && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!refreshToken && !pathname.startsWith('/auth/')) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Kiểm tra role admin cho các route admin
  if (pathname.startsWith('/admin')) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const decodedToken = decodeJWT(refreshToken.value)
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
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
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|payos-logo.svg).*)',
  ],
} 