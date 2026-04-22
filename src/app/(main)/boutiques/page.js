'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getShops } from '@/lib/api'

export default function BoutiquesPage() {
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getShops()
      .then(data => {
        setBoutiques(data.map(s => ({
          nom: s.name,
          slug: s.slug,
          lieu: s.location || 'Bénin',
          produits: s.products_count || 0,
          logo: s.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1B6B3A&color=fff&size=200`,
          banner: s.banner || null,
          badge: s.status === 'active',
          description: s.description || 'Découvrez cette magnifique boutique et son artisanat d\'exception.',
        })))
        setLoading(false)
      })
      .catch(() => { setBoutiques([]); setLoading(false) })
  }, [])

  const filtered = boutiques.filter(b =>
    b.nom.toLowerCase().includes(search.toLowerCase()) ||
    b.lieu.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Hero — clair, accentué vert */}
      <div className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-20"
        style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #DCFCE7 40%, #F7F5F0 100%)' }}>
        {/* Pattern déco */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30H15L30 0zm0 60L15 30h30L30 60z' fill='%231B6B3A' fill-opacity='0.06'/%3E%3C/svg%3E")` }} />

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-5"
                style={{ background: 'rgba(27,107,58,0.1)', color: '#1B6B3A', border: '1px solid rgba(27,107,58,0.2)' }}>
                <span className="material-symbols-outlined text-[14px]">storefront</span>
                Nos Créateurs
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-[#0D0D0D] tracking-tight leading-[1.05] mb-4">
                Boutiques <span style={{ color: '#1B6B3A' }}>&amp;</span> Artisans
              </h1>
              <p className="text-[16px] font-medium leading-relaxed max-w-xl" style={{ color: '#6B7280' }}>
                Chaque boutique est le reflet d'un savoir-faire unique. Parcourez les univers de nos vendeurs passionnés.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 shrink-0">
              {[
                { v: `${boutiques.length || '—'}`, l: 'Boutiques actives', icon: 'storefront' },
                { v: '500+', l: 'Artisans vérifiés', icon: 'verified' },
              ].map(s => (
                <div key={s.l} className="flex flex-col items-center text-center px-6 py-4 rounded-2xl bg-white"
                  style={{ border: '1px solid rgba(27,107,58,0.15)', boxShadow: '0 4px 20px rgba(27,107,58,0.08)' }}>
                  <span className="material-symbols-outlined text-[22px] mb-1" style={{ color: '#1B6B3A' }}>{s.icon}</span>
                  <span className="font-black text-[22px] text-[#0D0D0D]">{s.v}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide mt-0.5" style={{ color: '#9CA3AF' }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-lg">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white transition-all"
              style={{ border: '1.5px solid rgba(27,107,58,0.25)', boxShadow: '0 4px 20px rgba(27,107,58,0.08)' }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: '#9CA3AF' }}>search</span>
              <input
                type="text"
                placeholder="Rechercher une boutique ou une ville..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-[14px] font-medium outline-none bg-transparent"
                style={{ color: '#0D0D0D' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="transition-colors hover:text-gray-600">
                  <span className="material-symbols-outlined text-[18px]" style={{ color: '#9CA3AF' }}>close</span>
                </button>
              )}
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

                {/* Banner */}
                <div className="relative h-48 overflow-hidden" style={{ borderRadius: '28px 28px 0 0' }}>
                  {b.banner ? (
                    <Image src={b.banner} alt={b.nom} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="400px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #E6F8EA 0%, #D2F4DE 100%)' }}>
                      <span className="material-symbols-outlined text-[80px]" style={{ color: 'rgba(27,107,58,0.15)' }}>storefront</span>
                      {/* decorative circles */}
                      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: 'rgba(27,107,58,0.08)' }} />
                      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full" style={{ background: 'rgba(212,146,10,0.08)' }} />
                    </div>
                  )}
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
                    <span className="shrink-0 text-[10px] font-black px-3 py-1.5 rounded-full"
                      style={{ background: '#F3F4F6', color: '#6B7280' }}>
                      {b.produits} prod.
                    </span>
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
