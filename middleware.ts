import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_ROUTES } from './app/types/auth';

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.RESET_PASSWORD,
  '/reset-request',
  '/',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Vérifier si la route actuelle est publique
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Rediriger vers la page de connexion si pas de token et route protégée
  if (!token && !isPublicRoute) {
    const url = new URL(AUTH_ROUTES.LOGIN, request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Rediriger vers le dashboard si token présent et sur une route publique
  if (token && isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL(AUTH_ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

// Configurer les routes sur lesquelles le middleware s'applique
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