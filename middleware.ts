import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get auth cookie
  const authCookie = request.cookies.get('next-auth.session-token')?.value;

  // Allow access to other users' profiles via /profile/[id]
  if (request.nextUrl.pathname.startsWith('/profile/')) {
    return NextResponse.next();
  }

  // Protect the main profile page
  if (request.nextUrl.pathname === '/profile' && !authCookie) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/profile/:path*'],
};
