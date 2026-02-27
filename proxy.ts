import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './app/auth';

export async function proxy(request: NextRequest) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  // Root path redirect
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/trainings', request.url));
  }

  // Protected profile routes
  if (request.nextUrl.pathname.startsWith('/profile')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
  }

  // Protected create training route
  if (request.nextUrl.pathname.startsWith('/trainings/create')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/profile', '/profile/:path*', '/trainings/create'],
};
