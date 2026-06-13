'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getShops } from '@/lib/api'
import { getShopBannerImage, getStorageUrl } from '@/lib/images'
import SafeImage from '@/components/ui/SafeImage'

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
          logo: getStorageUrl(s.logo) || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1B6B3A&color=fff&size=200`,
          banner: getStorageUrl(s.banner) || getShopBannerImage({ name: s.name, description: s.description }),
          badge: s.status === 'active',
          description: s.description || "Découvrez cette magnifique boutique et son artisanat d'exception.",
          avgRating: parseFloat(s.avg_rating) || 0,
          totalReviews: parseInt(s.total_reviews) || 0,
        }))
        setBoutiques(shops)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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

      {/* ── Hero (Dawn aesthetic) ── */}
      <div className="relative overflow-hidden bg-[#F1F2F4] border-b border-gray-200" style={{ minHeight: '380px' }}>
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20 flex flex-col items-center text-center">
          
          {/* Texte */}
          <div className="max-w-2xl mb-8">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
              Nos Créateurs
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              Boutiques & Artisans
            </h1>
            <p className="text-[15px] font-medium leading-relaxed text-gray-600">
              Découvrez des créateurs passionnés. Chaque boutique reflète un savoir-faire unique et une histoire authentique.
            </p>
          </div>

          {/* Stats en version minimale */}
          <div className="flex gap-8 mb-10 text-gray-900 border-t border-b border-gray-200 py-4">
            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl">{boutiques.length || '—'}</span>
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Boutiques</span>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl">500+</span>
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Vendeurs vérifiés</span>
            </div>
          </div>

          {/* Search + Tri */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
            <div className="flex items-center flex-1 border-b border-gray-300 focus-within:border-black transition-colors px-2 py-2">
              <span className="material-symbols-outlined text-gray-400 text-[20px] mr-3">search</span>
              <input
                type="text"
                placeholder="Rechercher une boutique..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-[14px] bg-transparent outline-none text-black placeholder-gray-400"
              />
              {search && (
                <button onClick={() => setSearch('')}>
                  <span className="material-symbols-outlined text-gray-400 text-[18px]">close</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 border-b border-gray-300 focus-within:border-black transition-colors px-2 py-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">sort</span>
              <select
                value={tri}
                onChange={e => setTri(e.target.value)}
                className="text-[13px] font-semibold outline-none bg-transparent cursor-pointer text-gray-900 pr-2"
              >
                <option value="recent">Récents</option>
                <option value="note">Mieux notés</option>
                <option value="produits">Le plus d'articles</option>
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

        {loading && (
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
        )}

        {!loading && filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white mb-6"
              style={{ border: '1px solid #EBEBEB' }}>
              <span className="material-symbols-outlined text-[36px]" style={{ color: '#D1D5DB' }}>store_off</span>
            </div>
            <p className="font-black text-lg text-[#0D0D0D] mb-2">Aucune boutique trouvée</p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Essayez un autre terme de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(b => (
              <div key={b.slug}
                className="group bg-white overflow-hidden flex flex-col border border-gray-200 rounded-none transition-shadow hover:shadow-md">

                {/* Banner */}
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <SafeImage
                    src={b.banner || getShopBannerImage({ name: b.nom, description: b.description })}
                    alt={b.nom}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-black/10" />

                  {/* Badge vérifié */}
                  {b.badge && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest shadow-sm">
                      <span className="material-symbols-outlined text-[11px]">verified</span>
                      Vérifié
                    </div>
                  )}
                </div>

                {/* Logo */}
                <div className="px-5 pt-4 flex items-center gap-3 relative -mt-10">
                  <div className="relative w-16 h-16 bg-white border border-gray-200 overflow-hidden shrink-0 shadow-sm rounded-none">
                    <SafeImage
                      src={b.logo}
                      name={b.nom}
                      alt={b.nom}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 pt-3 pb-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 pr-2">
                      <h2 className="text-[16px] font-bold text-gray-900 group-hover:underline truncate decoration-1 underline-offset-2">
                        <Link href={`/boutiques/${b.slug}`}>
                          {b.nom}
                        </Link>
                      </h2>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {b.lieu}
                      </div>
                    </div>
                    {b.avgRating > 0 && (
                      <div className="flex items-center gap-1 shrink-0 bg-gray-50 px-2 py-1 border border-gray-100">
                        <span className="material-symbols-outlined text-[12px] text-gray-900" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-[12px] font-semibold text-gray-900">{b.avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2 mb-5 flex-1 pt-1">
                    {b.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <span className="text-[12px] font-medium text-gray-700">
                      {b.produits} article{b.produits > 1 ? 's' : ''}
                    </span>
                    <Link href={`/boutiques/${b.slug}`}
                      className="text-[11px] font-bold text-black uppercase tracking-wider flex items-center gap-1 group-hover:underline">
                      Visiter
                      <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward_ios</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
