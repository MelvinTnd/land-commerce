'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getShops } from '@/lib/api'

export default function BoutiquesPage() {
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getShops()
      .then(data => {
        const apiShops = data.map(s => ({
          nom: s.name,
          slug: s.slug,
          lieu: s.location || 'Bénin',
          produits: s.products_count || 0,
          image: s.logo || 'https://images.unsplash.com/photo-1544626154-1fe3bfab5dd1?auto=format&fit=crop&q=80',
          badge: s.status === 'active' ? 'Vérifié' : null,
          description: s.description || 'Découvrez cette magnifique boutique et son artisanat d\'exception.',
        }))
        setBoutiques(apiShops)
        setLoading(false)
      })
      .catch(() => {
        setBoutiques([])
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }} className="pt-10 pb-20">
      
      {/* En-tête */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 text-center mb-16">
        <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#1B6B3A' }}>
          Nos Créateurs
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: '#1A1A1A' }}>
          Boutiques & Artisans
        </h1>
        <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
          Parcourez les univers de nos vendeurs passionnés. Chaque boutique est le reflet d'un savoir-faire unique et authentique, prêt à enrichir votre quotidien.
        </p>
      </div>

      {/* Grille */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            Chargement des boutiques...
          </div>
        ) : boutiques.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined mb-4" style={{ fontSize: '48px', color: '#9CA3AF' }}>store_off</span>
            <p className="text-gray-500 font-medium">Aucune boutique n'est encore disponible sur la plateforme.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boutiques.map((b) => (
              <div
                key={b.slug}
                className="bg-white rounded-3xl overflow-hidden group transition-all duration-300 hover:-translate-y-2"
                style={{ border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
              >
                {/* Couverture/Logo */}
                <div className="relative h-48 overflow-hidden bg-[#F0EDE8]">
                  <img
                    src={b.image}
                    alt={b.nom}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <h2 className="text-2xl font-extrabold text-white mb-1">{b.nom}</h2>
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                      <span className="text-xs font-semibold">{b.lieu}</span>
                    </div>
                  </div>
                  {b.badge && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]" style={{ color: '#1B6B3A' }}>verified</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#1A1A1A' }}>{b.badge}</span>
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="p-6">
                  <p className="text-sm line-clamp-2 leading-relaxed mb-6" style={{ color: '#6B7280' }}>
                    {b.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className="material-symbols-outlined" style={{ color: '#1B6B3A', fontSize: '18px' }}>inventory_2</span>
                       <span className="text-xs font-bold" style={{ color: '#1A1A1A' }}>{b.produits} produits</span>
                    </div>
                    <Link
                      href={`/boutique/${b.slug}`}
                      className="px-5 py-2.5 rounded-full text-xs font-bold transition-all hover:bg-gray-100"
                      style={{ border: '2px solid #E5E7EB', color: '#1A1A1A' }}
                    >
                      Visiter
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
