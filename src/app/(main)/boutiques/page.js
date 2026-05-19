'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getShops } from '@/lib/api'
import { getShopBannerImage } from '@/lib/images'

const FALLBACK_BOUTIQUES = [
  {
    nom: 'Atelier Abomey Bronze',
    slug: 'atelier-abomey-bronze',
    lieu: 'Abomey',
    produits: 24,
    logo: 'https://ui-avatars.com/api/?name=Atelier+Abomey&background=1B6B3A&color=fff&size=200',
    banner: 'https://images.unsplash.com/photo-1559564484-ac4a9db6b7c0?auto=format&fit=crop&q=80&w=800',
    badge: true,
    description: 'Sculptures et bronzes traditionnels du Royaume du Danxomè, forgés selon les méthodes ancestrales.',
    avgRating: 4.9,
    totalReviews: 87,
  },
  {
    nom: 'Tissus & Couleurs',
    slug: 'tissus-couleurs',
    lieu: 'Cotonou',
    produits: 58,
    logo: 'https://ui-avatars.com/api/?name=Tissus+Couleurs&background=D4920A&color=fff&size=200',
    banner: 'https://images.unsplash.com/photo-1558171813-7d17e96f4e88?auto=format&fit=crop&q=80&w=800',
    badge: true,
    description: 'Wax, Kita, batik et tissus teints à la main. La créativité textile béninoise à votre service.',
    avgRating: 4.7,
    totalReviews: 132,
  },
  {
    nom: 'Bijoux Yoruba',
    slug: 'bijoux-yoruba',
    lieu: 'Porto-Novo',
    produits: 35,
    logo: 'https://ui-avatars.com/api/?name=Bijoux+Yoruba&background=7C3AED&color=fff&size=200',
    banner: 'https://images.unsplash.com/photo-1573408301185-9519f94945b8?auto=format&fit=crop&q=80&w=800',
    badge: true,
    description: 'Perles, colliers et parures inspirés de l\'héritage Yoruba. Chaque bijou raconte une histoire.',
    avgRating: 4.8,
    totalReviews: 64,
  },
  {
    nom: 'Poterie de Glazoué',
    slug: 'poterie-de-glazoue',
    lieu: 'Glazoué',
    produits: 19,
    logo: 'https://ui-avatars.com/api/?name=Poterie+Glazoue&background=DB2777&color=fff&size=200',
    banner: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
    badge: false,
    description: 'Poteries utilitaires et décoratives en terre cuite, façonnées à la main dans la tradition du plateau d\'Abomey.',
    avgRating: 4.5,
    totalReviews: 41,
  },
  {
    nom: 'Mode Parakou',
    slug: 'mode-parakou',
    lieu: 'Parakou',
    produits: 43,
    logo: 'https://ui-avatars.com/api/?name=Mode+Parakou&background=1B6B3A&color=fff&size=200',
    banner: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=800',
    badge: true,
    description: 'Boubous, agbadas et tenues de fête brodées à la main par les tailleurs du nord du Bénin.',
    avgRating: 4.9,
    totalReviews: 95,
  },
  {
    nom: 'Maroquinerie Ouidah',
    slug: 'maroquinerie-ouidah',
    lieu: 'Ouidah',
    produits: 27,
    logo: 'https://ui-avatars.com/api/?name=Maroquinerie+Ouidah&background=D4920A&color=fff&size=200',
    banner: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    badge: false,
    description: 'Sacs, ceintures et accessoires en cuir tanné naturellement. Savoir-faire artisanal de la Cité des Esclaves.',
    avgRating: 4.6,
    totalReviews: 53,
  },
]


export default function BoutiquesPage() {
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tri, setTri] = useState('recent')

  useEffect(() => {
    getShops()
      .then(data => {
        const shops = (Array.isArray(data) ? data : []).map(s => ({
          nom: s.name,
          slug: s.slug,
          lieu: s.location || 'Bénin',
          produits: s.products_count || 0,
          logo: s.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1B6B3A&color=fff&size=200`,
          banner: s.banner || null,
          badge: s.status === 'active',
          description: s.description || "Découvrez cette magnifique boutique et son artisanat d'exception.",
          avgRating: parseFloat(s.avg_rating) || 0,
          totalReviews: parseInt(s.total_reviews) || 0,
        }))
        // Si l'API répond vide (base non seedée, cold-start...) → garder le fallback
        setBoutiques(shops.length > 0 ? shops : FALLBACK_BOUTIQUES)
        setLoading(false)
      })
      .catch(() => { setBoutiques(FALLBACK_BOUTIQUES); setLoading(false) })
  }, [])

  const filtered = boutiques
    .filter(b =>
      b.nom.toLowerCase().includes(search.toLowerCase()) ||
      b.lieu.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (tri === 'note') return (b.avgRating || 0) - (a.avgRating || 0)
      if (tri === 'produits') return (b.produits || 0) - (a.produits || 0)
      return 0 // recent par défaut (ordre API)
    })

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ minHeight: '460px' }}>
        {/* Image de fond */}
        <div className="absolute inset-0">
          <Image src="/images/hero/boutiques-hero.jpg" alt="Boutiques artisanales" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(13,13,13,0.80) 0%, rgba(27,107,58,0.55) 60%, rgba(13,13,13,0.70) 100%)'
          }} />
        </div>
        {/* Ligne rainbow */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg,#1B6B3A,#D4920A,#7C3AED,#1B6B3A)' }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">

            {/* Texte */}
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-5"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                <span className="material-symbols-outlined text-[14px]">storefront</span>
                Nos Créateurs
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-4">
                Boutiques <span style={{ color: '#4ADE80' }}>&amp;</span> Artisans
              </h1>
              <p className="text-[16px] font-medium leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Chaque boutique est le reflet d&apos;un savoir-faire unique. Parcourez les univers de nos vendeurs passionnés.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 shrink-0">
              {[
                { v: `${boutiques.length || '—'}`, l: 'Boutiques actives', icon: 'storefront' },
                { v: '500+', l: 'Artisans vérifiés', icon: 'verified' },
              ].map(s => (
                <div key={s.l} className="flex flex-col items-center text-center px-6 py-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)' }}>
                  <span className="material-symbols-outlined text-[22px] mb-1" style={{ color: '#4ADE80' }}>{s.icon}</span>
                  <span className="font-black text-[22px] text-white">{s.v}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search + Tri */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl flex-1 transition-all"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: 'rgba(255,255,255,0.6)' }}>search</span>
              <input
                type="text"
                placeholder="Rechercher une boutique ou une ville..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-[14px] font-medium outline-none bg-transparent text-white placeholder-white/50"
              />
              {search && (
                <button onClick={() => setSearch('')}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'rgba(255,255,255,0.6)' }}>close</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}>
              <span className="material-symbols-outlined text-[18px]" style={{ color: 'rgba(255,255,255,0.6)' }}>sort</span>
              <select
                value={tri}
                onChange={e => setTri(e.target.value)}
                className="text-[13px] font-bold outline-none bg-transparent cursor-pointer text-white"
              >
                <option value="recent" className="text-black">Récents</option>
                <option value="note" className="text-black">Mieux notés</option>
                <option value="produits" className="text-black">Plus de produits</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-14 pb-28">
        {!loading && (
          <p className="text-[12px] font-black uppercase tracking-widest mb-8" style={{ color: '#9CA3AF' }}>
            {filtered.length} boutique{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[28px] overflow-hidden animate-pulse"
                style={{ border: '1px solid #EBEBEB' }}>
                <div className="h-48 bg-gray-100" />
                <div className="p-6">
                  <div className="h-4 bg-gray-100 rounded mb-3 w-2/3" />
                  <div className="h-3 bg-gray-100 rounded mb-4 w-full" />
                  <div className="h-10 bg-gray-100 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white mb-6"
              style={{ border: '1px solid #EBEBEB' }}>
              <span className="material-symbols-outlined text-[36px]" style={{ color: '#D1D5DB' }}>store_off</span>
            </div>
            <p className="font-black text-lg text-[#0D0D0D] mb-2">Aucune boutique trouvée</p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Essayez un autre terme de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(b => (
              <div key={b.slug}
                className="group bg-white overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-xl flex flex-col"
                style={{ borderRadius: '28px', border: '1px solid #EBEBEB', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>

                {/* Banner avec fallback image locale */}
                <div className="relative h-48 overflow-hidden" style={{ borderRadius: '28px 28px 0 0' }}>
                  <Image
                    src={b.banner || getShopBannerImage({ name: b.nom, description: b.description })}
                    alt={b.nom}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="400px"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.9) 100%)' }} />

                  {/* Logo avatar */}
                  <div className="absolute bottom-0 left-6 translate-y-1/2 w-16 h-16 rounded-2xl overflow-hidden relative z-10 bg-white"
                    style={{ border: '2px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                    <Image src={b.logo} alt={b.nom} fill className="object-cover" sizes="64px" />
                  </div>

                  {/* Badge vérifié */}
                  {b.badge && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                      style={{ background: 'rgba(27,107,58,0.1)', color: '#1B6B3A', border: '1px solid rgba(27,107,58,0.2)', backdropFilter: 'blur(4px)' }}>
                      <span className="material-symbols-outlined text-[11px]">verified</span>
                      Vérifié
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pt-12 px-6 pb-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <h2 className="text-[18px] font-black text-[#0D0D0D] mb-1 leading-snug group-hover:text-[#1B6B3A] transition-colors truncate">
                        {b.nom}
                      </h2>
                      <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: '#9CA3AF' }}>
                        <span className="material-symbols-outlined text-[13px]">location_on</span>
                        {b.lieu}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] font-black px-3 py-1.5 rounded-full" style={{ background: '#F3F4F6', color: '#6B7280' }}>
                        {b.produits} prod.
                      </span>
                      {b.avgRating > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]" style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-[11px] font-black" style={{ color: '#0D0D0D' }}>{b.avgRating.toFixed(1)}</span>
                          <span className="text-[10px]" style={{ color: '#9CA3AF' }}>({b.totalReviews})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[13px] leading-relaxed line-clamp-2 mb-6 flex-1" style={{ color: '#9CA3AF' }}>
                    {b.description}
                  </p>

                  <Link href={`/boutique/${b.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all group-hover:bg-[#1B6B3A] group-hover:text-white"
                    style={{ background: '#F0FDF4', color: '#1B6B3A', border: '1.5px solid rgba(27,107,58,0.2)' }}>
                    Visiter la boutique
                    <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
