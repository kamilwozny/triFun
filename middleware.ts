import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('next-auth.session-token')?.value;
  const secureCookie = request.cookies.get(
    '__Secure-next-auth.session-token'
  )?.value;
  const isAuthenticated = !!(authCookie || secureCookie);

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/trainings', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/profile')) {
    isAuthenticated
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/signin', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/trainings/create')) {
    isAuthenticated
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/profile', '/profile/:path*'],
};
