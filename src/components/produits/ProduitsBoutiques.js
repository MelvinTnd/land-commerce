'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getShops } from '@/lib/api'

const FALLBACK_BOUTIQUES = [
  { id: 1, name: 'Atelier Kanvô', location: 'Abomey', slug: 'atelier-kanvo',
    avatar: 'https://images.unsplash.com/photo-1582641748784-8d3d06ad87e0?w=200&h=200&fit=crop', ventes: 142, note: 4.8 },
  { id: 2, name: 'Kaba & Fils', location: 'Dassa-Zoumé', slug: 'kaba-et-fils',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', ventes: 210, note: 4.6 },
  { id: 3, name: 'Monteiro Fashion', location: 'Cotonou', slug: 'monteiro-fashion',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', ventes: 76, note: 4.9 },
]

const COLORS = ['#1B6B3A', '#D4920A', '#6B3A1B', '#1B3A6B']

export default function ProduitsBoutiques() {
  const [boutiques, setBoutiques] = useState(FALLBACK_BOUTIQUES)

  useEffect(() => {
    getShops()
      .then(data => {
        const list = data.data || data
        if (Array.isArray(list) && list.length > 0) {
          setBoutiques(list.slice(0, 4).map((s, i) => ({
            id: s.id,
            name: s.name,
            location: s.location || 'Bénin',
            slug: s.slug || s.id,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.name)}&backgroundColor=${COLORS[i % COLORS.length].slice(1)}`,
            ventes: s.products_count || 0,
            note: 4.5 + Math.random() * 0.5,
          })))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="px-6 md:px-10 py-20" style={{ background: '#F7F5F0' }}>
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#1B6B3A] mb-2 block">
              Nos partenaires
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: '#1A1A1A' }}>
              Boutiques d'Exception
            </h2>
            <p className="text-sm mt-2 max-w-sm" style={{ color: '#9CA3AF' }}>
              Des artisans soigneusement sélectionnés pour la qualité de leur travail et leur authenticité.
            </p>
          </div>
          <Link
            href="/boutiques"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border transition-all hover:bg-[#1B6B3A] hover:text-white"
            style={{ borderColor: '#1B6B3A', color: '#1B6B3A' }}
          >
            Toutes les boutiques
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Grille boutiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boutiques.map((boutique, i) => (
            <Link
              key={boutique.id}
              href={`/boutiques/${boutique.slug}`}
              className="group bg-white rounded-3xl p-6 flex flex-col items-center text-center gap-4 transition-all hover:-translate-y-2 hover:shadow-2xl"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F0EDE8' }}
            >
              {/* Badge numéro */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden"
                  style={{ border: `3px solid ${COLORS[i % COLORS.length]}20` }}>
                  <img
                    src={boutique.avatar}
                    alt={boutique.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
                  style={{ background: COLORS[i % COLORS.length] }}>
                  {i + 1}
                </div>
              </div>

              {/* Infos */}
              <div className="flex flex-col gap-1">
                <h4 className="font-extrabold text-[15px]" style={{ color: '#1A1A1A' }}>
                  {boutique.name}
                </h4>
                <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
                  📍 {boutique.location}
                </p>
              </div>

              {/* Étoiles */}
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} width="13" height="13"
                    fill={star <= Math.round(boutique.note) ? '#F5B731' : 'none'}
                    stroke="#F5B731" strokeWidth="1.5" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
                <span className="text-xs font-bold ml-1" style={{ color: '#374151' }}>
                  {boutique.note.toFixed(1)}
                </span>
              </div>

              {/* CTA */}
              <span className="text-xs font-bold px-4 py-1.5 rounded-full transition-all group-hover:text-white"
                style={{ background: `${COLORS[i % COLORS.length]}15`, color: COLORS[i % COLORS.length] }}>
                Voir la boutique →
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}