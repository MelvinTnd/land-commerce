'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/lib/CartContext'
import { getUnreadCount } from '@/lib/api'
import GlobalSearch from '@/components/search/GlobalSearch'

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Catalogue', href: '/produits' },
  { label: 'Créateurs', href: '/boutiques' },
  { label: 'Exclusivités', href: '/promotions' },
]

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const { totalArticles } = useCart()
  const userRef = useRef(null)
  const [unreadMessages, setUnreadMessages] = useState(0)

  // Polling messages non lus
  useEffect(() => {
    if (!session?.user?.apiToken) return
    const fetchUnread = () => {
      getUnreadCount(session.user.apiToken)
        .then(data => setUnreadMessages(data.unread || 0))
        .catch(() => {})
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [session])

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Raccourci clavier ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(s => !s)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    setUserMenu(false)
    await signOut({ redirect: false })
    router.push('/')
  }

  const user = session?.user
  const role = user?.role

  return (
    <>
    {/* ── TOP ANNOUNCEMENT BAR ── */}
    <div className="bg-black text-white text-[10px] font-bold uppercase tracking-widest text-center py-2 relative z-50">
      Livraison offerte à partir de 50.000 CFA d'achat
    </div>

    <nav className="fixed top-8 left-0 right-0 z-40 transition-all duration-300 bg-white"
      style={{
        borderBottom: '1px solid #E5E7EB',
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'white',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center h-[72px] gap-6">

        {/* Hamburger (Mobile) */}
        <button className="lg:hidden w-10 h-10 flex items-center justify-start transition-colors"
          onClick={() => setMobileMenu(!mobileMenu)}>
          <span className="material-symbols-outlined text-[24px] text-gray-900">
            {mobileMenu ? 'close' : 'menu'}
          </span>
        </button>

        {/* Search bare (Desktop) */}
        <button
          onClick={() => setShowSearch(true)}
          className="hidden lg:flex w-8 h-8 items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-[22px] text-gray-900 font-light">search</span>
        </button>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-8 ml-4">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link key={link.label} href={link.href}
                className={`text-[12px] font-bold uppercase tracking-widest transition-all py-2 border-b-2 ${
                  isActive ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}>
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Logo (Center) */}
        <div className="flex-1 flex justify-center items-center">
          <Link href="/" className="flex items-center">
             <span className="font-bold text-[22px] tracking-tight text-gray-900 leading-none">
                CauriMarket.
              </span>
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5 justify-end lg:flex-1 shrink-0">

          {/* Mobile search */}
          <button className="lg:hidden w-8 h-8 flex items-center justify-center transition-colors"
            onClick={() => setShowSearch(true)}>
            <span className="material-symbols-outlined text-[22px] text-gray-900">search</span>
          </button>

          {/* Vendeur space */}
          {role === 'vendeur' && (
            <Link href="/vendeur"
              className="hidden md:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all hover:opacity-70 text-gray-900">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span className="hidden xl:block">Espace Créateur</span>
            </Link>
          )}

          {/* User menu */}
          <div className="relative" ref={userRef}>
            {user ? (
              <button onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 transition-all hover:opacity-70">
                <span className="material-symbols-outlined text-[22px] text-gray-900 font-light">person</span>
              </button>
            ) : (
              <Link href="/connexion"
                className="flex items-center gap-2 transition-all hover:opacity-70">
                <span className="material-symbols-outlined text-[22px] text-gray-900 font-light">person</span>
              </Link>
            )}

            {/* Dropdown user */}
            {userMenu && user && (
              <div className="absolute right-0 top-full mt-4 w-60 bg-white border border-gray-200 shadow-xl py-2 z-50">
                {/* User info */}
                <div className="px-5 py-4 mb-2 border-b border-gray-100">
                  <p className="font-bold text-[13px] text-gray-900">{user.name}</p>
                  <p className="text-[11px] text-gray-500 mb-2 truncate">{user.email}</p>
                  <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-gray-100 text-gray-900">
                    {role || 'Membre'}
                  </span>
                </div>

                {[
                  { href: '/compte', icon: 'person', label: 'Mon compte' },
                  { href: '/messages', icon: 'chat', label: 'Messages', badge: unreadMessages > 0 ? unreadMessages : null },
                  { href: '/panier', icon: 'shopping_bag', label: 'Mon panier' },
                  ...(role === 'vendeur' ? [{ href: '/vendeur', icon: 'storefront', label: 'Espace vendeur' }] : []),
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setUserMenu(false)}
                    className="flex items-center justify-between px-5 py-3 text-[12px] font-bold uppercase tracking-widest transition-colors hover:bg-gray-50 text-gray-600 hover:text-gray-900">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      {item.label}
                    </div>
                    {item.badge && (
                      <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[9px]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}

                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-5 py-3 text-[12px] font-bold uppercase tracking-widest transition-colors hover:bg-red-50 text-red-600 w-full text-left mt-2 border-t border-gray-100">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Panier */}
          <Link href="/panier"
            className="relative flex items-center justify-center transition-colors hover:opacity-70">
            <span className="material-symbols-outlined text-[22px] text-gray-900 font-light">shopping_bag</span>
            {totalArticles > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 rounded-full text-white bg-black flex items-center justify-center font-bold text-[9px]">
                {totalArticles}
              </span>
            )}
          </Link>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200">
          <div className="flex flex-col p-6 gap-6">
            {navLinks.map(link => (
              <Link key={link.label} href={link.href}
                onClick={() => setMobileMenu(false)}
                className={`text-[16px] font-bold uppercase tracking-widest transition-colors ${
                  pathname === link.href ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}>
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 pt-6 mt-2 flex flex-col gap-4">
              {!user ? (
                <>
                  <Link href="/connexion" onClick={() => setMobileMenu(false)}
                    className="w-full py-4 text-center text-[11px] font-bold uppercase tracking-widest text-white bg-black border border-black">
                    Connexion
                  </Link>
                  <Link href="/inscription" onClick={() => setMobileMenu(false)}
                    className="w-full py-4 text-center text-[11px] font-bold uppercase tracking-widest text-black bg-white border border-gray-300">
                    Créer un compte
                  </Link>
                </>
              ) : (
                <button onClick={() => { setMobileMenu(false); handleLogout() }}
                  className="w-full py-4 text-center text-[11px] font-bold uppercase tracking-widest text-white bg-red-600 border border-red-600">
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>

      {/* Modal Recherche Globale */}
      {showSearch && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowSearch(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-[24px] overflow-hidden shadow-2xl"
            style={{ maxHeight: '80vh' }}
            onClick={e => e.stopPropagation()}
          >
            <GlobalSearch onClose={() => setShowSearch(false)} />
          </div>
        </div>
      )}
    </>
  )
}