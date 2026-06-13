'use client'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/lib/CartContext'
import { getUnreadCount } from '@/lib/api'
import GlobalSearch from '@/components/search/GlobalSearch'

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Produits', href: '/produits' },
  { label: 'Boutiques', href: '/boutiques' },
  { label: 'Promotions', href: '/promotions' },
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'white',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: '1px solid #F0EDE8',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
      }}>
      <div className="max-w-[1400px] mx-auto flex items-center h-[68px] gap-4">

        {/* Logo — texte seul */}
        <Link href="/" className="flex items-center shrink-0">
          <span className="font-black text-[20px] tracking-tight" style={{ color: '#0D0D0D' }}>
            Cauri<span style={{ color: '#1B6B3A' }}>Market</span>
          </span>
        </Link>

        {/* Search bar */}
        <button
          onClick={() => setShowSearch(true)}
          className="hidden md:flex flex-1 max-w-md mx-4 items-center gap-2 px-4 py-2 border border-gray-200 transition-all duration-200 text-left hover:border-[#1B6B3A] bg-gray-50 hover:bg-white"
        >
          <span className="material-symbols-outlined text-[18px] text-gray-400">search</span>
          <span className="text-[13px] font-medium flex-1 text-gray-400">Rechercher un produit, un artisan...</span>
          <kbd className="hidden lg:flex items-center gap-1 px-2 py-0.5 border text-[10px] font-bold text-gray-400">⌘K</kbd>
        </button>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link key={link.label} href={link.href}
                className="py-2 text-[13px] font-bold uppercase tracking-widest transition-colors relative group"
                style={{ color: isActive ? '#1B6B3A' : '#1A1A1A' }}>
                {link.label}
                <span className="absolute left-0 right-0 bottom-0 h-[2px] transition-all duration-300 bg-[#1B6B3A]" style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }} />
              </Link>
            )
          })}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Mobile search */}
          <button className="md:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setShowSearch(true)}>
            <span className="material-symbols-outlined text-[20px]" style={{ color: '#0D0D0D' }}>search</span>
          </button>

          {/* Messages */}
          {user && (
            <Link href="/messages"
              className="relative w-10 h-10 flex items-center justify-center transition-colors hover:text-[#1B6B3A] text-gray-900">
              <span className="material-symbols-outlined text-[22px]">chat</span>
              {unreadMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-white flex items-center justify-center font-black text-[9px]"
                  style={{ background: '#EF4444' }}>
                  {unreadMessages}
                </span>
              )}
            </Link>
          )}

          {/* Vendeur */}
          {role === 'vendeur' && (
            <Link href="/vendeur"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all hover:opacity-90"
              style={{ background: 'rgba(27,107,58,0.1)', color: '#1B6B3A' }}>
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span className="hidden lg:block">Mon Espace</span>
            </Link>
          )}

          {/* Panier */}
          <Link href="/panier"
            className="relative w-10 h-10 flex items-center justify-center transition-colors hover:text-[#1B6B3A] text-gray-900">
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {totalArticles > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-white flex items-center justify-center font-bold text-[9px]"
                style={{ background: '#D4920A' }}>
                {totalArticles}
              </span>
            )}
          </Link>

          {/* User menu */}
          <div className="relative" ref={userRef}>
            {user ? (
              <button onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 border border-gray-200 transition-colors hover:border-[#1B6B3A] bg-white">
                <div className="w-7 h-7 bg-[#1B6B3A] flex items-center justify-center overflow-hidden">
                  <span className="text-[12px] font-black text-white">{(user.name || 'U')[0].toUpperCase()}</span>
                </div>
                <span className="hidden sm:block text-[12px] font-black max-w-[80px] truncate" style={{ color: '#0D0D0D' }}>
                  {user.name?.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-[16px]" style={{ color: '#9CA3AF' }}>expand_more</span>
              </button>
            ) : (
              <Link href="/connexion"
                className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest border border-gray-200 transition-colors hover:border-[#1B6B3A] hover:text-[#1B6B3A] bg-white"
                style={{ color: '#0D0D0D' }}>
                <span className="material-symbols-outlined text-[16px]">person</span>
                <span className="hidden sm:block">Connexion</span>
              </Link>
            )}

            {/* Dropdown */}
            {userMenu && user && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white py-2 z-50 border border-gray-200 shadow-lg">
                <div className="px-4 py-3 mb-1" style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <p className="font-black text-[13px]" style={{ color: '#0D0D0D' }}>{user.name}</p>
                  <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{user.email}</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wide"
                    style={{ background: role === 'vendeur' ? 'rgba(27,107,58,0.1)' : 'rgba(0,0,0,0.06)', color: role === 'vendeur' ? '#1B6B3A' : '#6B7280' }}>
                    {role || 'acheteur'}
                  </span>
                </div>

                {[
                  { href: '/compte', icon: 'person', label: 'Mon compte' },
                  { href: '/messages', icon: 'chat', label: 'Mes messages' },
                  { href: '/panier', icon: 'shopping_bag', label: 'Mon panier' },
                  ...(role === 'vendeur' ? [{ href: '/vendeur', icon: 'storefront', label: 'Espace vendeur' }] : []),
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold transition-colors hover:bg-gray-50"
                    style={{ color: '#374151' }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: '#9CA3AF' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}

                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold transition-colors hover:bg-red-50 w-full text-left mt-1"
                  style={{ color: '#EF4444', borderTop: '1px solid #F3F4F6' }}>
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Se déconnecter
                </button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="lg:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenu(!mobileMenu)}>
            <span className="material-symbols-outlined text-[22px]" style={{ color: '#0D0D0D' }}>
              {mobileMenu ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white py-4 px-6"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1)', borderTop: '1px solid #F0EDE8' }}>
          {navLinks.map(link => (
            <Link key={link.label} href={link.href}
              onClick={() => setMobileMenu(false)}
              className="flex items-center py-3 px-0 text-[14px] font-bold uppercase tracking-widest border-b border-gray-100 last:border-0"
              style={{ color: pathname === link.href ? '#1B6B3A' : '#0D0D0D' }}>
              {link.label}
            </Link>
          ))}
          {!user ? (
            <div className="flex gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #F0EDE8' }}>
              <Link href="/connexion" onClick={() => setMobileMenu(false)}
                className="flex-1 py-3 text-center text-[13px] font-black text-white border border-gray-900"
                style={{ background: '#0D0D0D' }}>
                Connexion
              </Link>
              <Link href="/inscription" onClick={() => setMobileMenu(false)}
                className="flex-1 py-3 text-center text-[13px] font-black border border-gray-200"
                style={{ color: '#374151' }}>
                S&apos;inscrire
              </Link>
            </div>
          ) : (
            <button onClick={() => { setMobileMenu(false); handleLogout() }}
              className="w-full mt-4 py-3 text-[13px] font-black text-white border border-red-500"
              style={{ background: '#EF4444' }}>
              Se déconnecter
            </button>
          )}
        </div>
      )}
    </nav>

      {/* Modal Recherche */}
      {showSearch && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowSearch(false)}
        >
          <div
            className="w-full max-w-xl bg-white overflow-hidden shadow-2xl"
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