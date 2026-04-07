'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/lib/CartContext'

const allProduits = [
  { id: 1, nom: 'Tissu Batik Indigo', categorie: 'Textiles', prix: 45000 },
  { id: 2, nom: 'Beurre de Karité Bio', categorie: 'Épices', prix: 7500 },
  { id: 3, nom: "Miel Sauvage d'Atacora", categorie: 'Épices', prix: 12000 },
  { id: 4, nom: 'Collier en Bronze', categorie: 'Bijoux', prix: 25000 },
  { id: 5, nom: 'Panier Tressé Artisanal', categorie: 'Artisans', prix: 18500 },
  { id: 6, nom: "Coffret d'Épices du Bénin", categorie: 'Épices', prix: 22000 },
  { id: 7, nom: 'Miel Pur des Collines', categorie: 'Alimentation', prix: 4500 },
  { id: 8, nom: 'Bol Cérémoniel Argile', categorie: 'Artisanat', prix: 12000 },
  { id: 9, nom: 'Tunique Brodée Kanvô', categorie: 'Mode', prix: 25000 },
  { id: 10, nom: "Jus d'Ananas Pain de Sucre", categorie: 'Alimentation', prix: 1200 },
]

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Produits', href: '/produits' },
  { label: 'Blog', href: '/blog' },
  { label: 'Boutiques', href: '/boutiques' },
]

export default function Navbar() {
  const [recherche, setRecherche] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { totalArticles } = useCart()
  const searchRef = useRef(null)

  // Résultats de recherche en temps réel
  const resultats = recherche.length >= 2
    ? allProduits.filter((p) =>
        p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        p.categorie.toLowerCase().includes(recherche.toLowerCase())
      ).slice(0, 5)
    : []

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocus(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (recherche.trim()) {
      router.push(`/produits?recherche=${encodeURIComponent(recherche.trim())}`)
      setRecherche('')
      setSearchFocus(false)
    }
  }

  const handleResultClick = (id) => {
    router.push(`/produits/${id}`)
    setRecherche('')
    setSearchFocus(false)
  }

  return (
    <nav className="bg-white px-4 md:px-8 py-4 flex items-center justify-between relative" style={{ borderBottom: '1px solid #F0EDE8' }}>

      {/* Logo */}
      <Link href="/" className="flex items-center shrink-0 no-underline">
        <Image src="/logo.png" alt="BéninMarket" width={40} height={40} className="w-10 h-10 object-contain rounded-xl" />
        <span className="hidden sm:block ml-3 text-xl font-extrabold" style={{ color: '#1B6B3A', letterSpacing: '-0.5px' }}>
          BéninMarket
        </span>
      </Link>

      {/* Barre de recherche */}
      <div className="hidden md:flex items-center flex-1 mx-6 lg:mx-10 max-w-md relative" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="flex items-center w-full px-4 py-2.5 rounded-full gap-2 transition-all" style={{ background: searchFocus ? '#fff' : '#F1EFEA', border: searchFocus ? '2px solid #1B6B3A' : '2px solid transparent' }}>
            <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              placeholder="Rechercher un produit, un artisan..."
              className="bg-transparent outline-none text-sm w-full"
              style={{ color: '#374151' }}
            />
            {recherche && (
              <button type="button" onClick={() => { setRecherche(''); setSearchFocus(false) }} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
              </button>
            )}
          </div>
        </form>

        {/* Dropdown résultats */}
        {searchFocus && resultats.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl py-2 z-50"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '1px solid #E5E7EB' }}
          >
            {resultats.map((r) => (
              <button
                key={r.id}
                onClick={() => handleResultClick(r.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{r.nom}</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>{r.categorie}</p>
                </div>
                <p className="text-sm font-bold" style={{ color: '#1B6B3A' }}>
                  {r.prix.toLocaleString('fr-FR')} <span className="text-[10px] font-normal">FCFA</span>
                </p>
              </button>
            ))}
            <button
              onClick={handleSearchSubmit}
              className="w-full px-4 py-3 text-left text-xs font-bold transition-colors hover:bg-gray-50 flex items-center gap-2"
              style={{ color: '#1B6B3A', borderTop: '1px solid #F0EDE8' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>search</span>
              Voir tous les résultats pour "{recherche}"
            </button>
          </div>
        )}

        {searchFocus && recherche.length >= 2 && resultats.length === 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl p-6 z-50 text-center"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '1px solid #E5E7EB' }}
          >
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Aucun résultat pour "{recherche}"</p>
          </div>
        )}
      </div>

      {/* Navigation — liens */}
      <div className="hidden lg:flex items-center gap-5">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium pb-1 transition-colors"
              style={{
                color: isActive ? '#1B6B3A' : '#374151',
                borderBottom: isActive ? '2px solid #1B6B3A' : '2px solid transparent',
              }}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* Icônes droite */}
      <div className="flex items-center gap-3 md:gap-4 ml-4 md:ml-6">

        {/* Recherche mobile */}
        <button
          className="md:hidden text-gray-600 hover:text-green-800 transition-colors"
          onClick={() => router.push('/produits')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        {/* Espace Vendeur */}
        <Link href="/vendeur" className="text-gray-600 hover:text-green-800 transition-colors hidden md:block" title="Espace Vendeur">
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: '20px' }}>storefront</span>
        </Link>
        
        {/* Profil */}
        <Link href="/compte" className="text-gray-600 hover:text-green-800 transition-colors">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </Link>

        {/* Panier */}
        <Link href="/panier" className="relative text-gray-600 hover:text-green-800 transition-colors">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-white flex items-center justify-center transition-all"
            style={{
              background: totalArticles > 0 ? '#D4920A' : '#9CA3AF',
              fontSize: '9px',
              fontWeight: '700',
              transform: totalArticles > 0 ? 'scale(1)' : 'scale(0.8)',
            }}
          >
            {totalArticles}
          </span>
        </Link>

        {/* Menu hamburger mobile */}
        <button
          className="lg:hidden text-gray-600 hover:text-green-800 transition-colors"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
            {mobileMenu ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Menu mobile */}
      {mobileMenu && (
        <div
          className="absolute top-full left-0 right-0 bg-white z-50 py-4 px-6 flex flex-col gap-1 lg:hidden"
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.1)', borderTop: '1px solid #F0EDE8' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenu(false)}
              className="py-3 px-4 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-50"
              style={{ color: pathname === link.href ? '#1B6B3A' : '#374151' }}
            >
              {link.label}
            </Link>
          ))}
          {/* Recherche mobile */}
          <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenu(false) }} className="mt-2">
            <div className="flex items-center px-4 py-3 rounded-xl gap-2" style={{ background: '#F1EFEA' }}>
              <svg width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" value={recherche} onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher..." className="bg-transparent outline-none text-sm w-full" style={{ color: '#374151' }} />
            </div>
          </form>
        </div>
      )}
    </nav>
  )
}