import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Routes protégées et leurs rôles requis
const PROTECTED_ROUTES = [
  { path: '/vendeur', roles: ['vendeur', 'admin'] },
  { path: '/compte', roles: ['acheteur', 'vendeur', 'admin'] },
  { path: '/panier', roles: null },       // connexion requise pour voir le panier
  { path: '/paiement', roles: null },     // connexion requise pour payer
]

export default auth(async (req) => {
  const { nextUrl, auth: session } = req
  const pathname = nextUrl.pathname

  // Trouver la règle correspondante
  const rule = PROTECTED_ROUTES.find(r => pathname.startsWith(r.path))
  if (!rule) return NextResponse.next()

  // Non connecté → redirection vers connexion
  if (!session) {
    const loginUrl = new URL('/connexion', nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const userRole = session.user?.role

  // Vérification du rôle si nécessaire
  if (rule.roles && !rule.roles.includes(userRole)) {
    // Vendeur essaie d'accéder à /admin → 403
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', nextUrl.origin))
    }
    // Acheteur essaie d'accéder à /vendeur → rediriger vers inscription-vendeur
    if (pathname.startsWith('/vendeur')) {
      return NextResponse.redirect(new URL('/inscription-vendeur', nextUrl.origin))
    }
    return NextResponse.redirect(new URL('/', nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/vendeur/:path*',
    '/compte/:path*',
    '/panier/:path*',
    '/paiement/:path*',
  ],
}

