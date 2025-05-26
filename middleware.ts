// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Autoriser l'accès aux pages publiques
  if (pathname === '/' || pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Vérifier la présence du token d'accès
  const token = request.cookies.get('sb-access-token')?.value;

  if (!token) {
    // Rediriger vers la page de connexion si non authentifié
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Pour les routes administrateur, une vérification supplémentaire côté serveur est nécessaire
  if (pathname.startsWith('/admin')) {
    // Étant donné les limitations du middleware, effectuez la vérification du rôle dans les composants serveur ou les pages elles-mêmes
    // Par exemple, dans getServerSideProps ou dans un hook useEffect côté client
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
