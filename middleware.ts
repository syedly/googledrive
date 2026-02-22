import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protect routes under /dashboard — redirect unauthenticated users to /login
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/dashboard')) {
    const cookie = req.headers.get('cookie') || ''
    const hasSession = cookie.includes('session=')
    if (!hasSession) {
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
