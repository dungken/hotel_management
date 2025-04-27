import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_KEYS, ROUTES } from '@/constants';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path.startsWith('/auth');
  const token = request.cookies.get(AUTH_KEYS.TOKEN)?.value || '';

  // If trying to access protected routes without token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  // If trying to access auth routes with token, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
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
};
