'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategories } from '@/lib/api'
import { defaultCategories } from '@/lib/defaultData'

const imagesParCategorie = {
  'artisanat':           '/images/products/art.jpg',
  'mode-textile':        '/images/products/wax.jpg',
  'alimentation-epices': '/images/products/epices.jpg',
  'maison-deco':         '/images/products/maison.jpg',
  'beaute-sante':        '/images/products/beaute.jpg',
}

const accents = ['#34d399', '#fbbf24', '#a78bfa', '#fb7185']

export default function CategoriesSection() {
  const [categories, setCategories] = useState(defaultCategories)
  const [hovered, setHovered] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then(data => {
        if (!data || data.length === 0) { setLoading(false); return }
        const apiCats = data.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon || 'category',
          description: c.description || 'Découvrez nos produits',
          image: imagesParCategorie[c.slug] || '/images/products/default.jpg',
          count: c.products_count || 0,
        }))
        setCategories(apiCats)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-10 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20" style={{ background: 'linear-gradient(180deg,#F7F5F0 0%,#EDEAE4 100%)' }}>
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 md:mb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.22em] mb-5 border"
            style={{ background: 'rgba(27,107,58,0.08)', color: '#1B6B3A', borderColor: 'rgba(27,107,58,0.2)' }}>
            <span className="material-symbols-outlined text-[15px]">category</span>
            Univers Exclusifs
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0D0D0D] tracking-tight mb-5 leading-[1.05]">
            Explorez la <span style={{ color: '#1B6B3A' }}>Diversité</span>
          </h2>
          <p className="text-[16px] text-gray-500 font-medium leading-relaxed">
            Quatre univers fondateurs, une infinité de trésors béninois. Chaque catégorie est une invitation au voyage.
          </p>
        </div>

        {/* Skeleton ou grille */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse rounded-[28px] bg-gray-200" style={{ minHeight: '340px' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={cat.slug ? `/produits?category=${cat.slug}` : '/produits'}
                className="group relative flex flex-col overflow-hidden cursor-pointer"
                style={{ borderRadius: '28px', minHeight: '340px' }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                  />
                  <div className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                    }} />
                </div>

                {/* Accent border glow on hover */}
                <div className="absolute inset-0 rounded-[28px] transition-all duration-500 pointer-events-none"
                  style={{
                    boxShadow: hovered === idx
                      ? `0 0 0 2px ${accents[idx % accents.length]}, 0 30px 60px -10px rgba(0,0,0,0.4)`
                      : '0 8px 30px rgba(0,0,0,0.12)',
                  }} />

                {/* Icon top-right */}
                <div className="relative z-10 flex justify-end p-5">
                  <div className="w-11 h-11 rounded-2xl backdrop-blur-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
                    <span className="material-symbols-outlined text-white text-[22px]">{cat.icon}</span>
                  </div>
                </div>

                {/* Bottom content */}
                <div className="relative z-10 mt-auto p-6">
                  {cat.count > 0 && (
                    <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-3 py-1 rounded-full"
                      style={{ background: accents[idx % accents.length], color: '#0D0D0D' }}>
                      {cat.count} produits
                    </span>
                  )}
                  <h3 className="text-[22px] font-black text-white leading-tight mb-2 tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[13px] text-white/60 font-medium mb-5 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300"
                    style={{ color: accents[idx % accents.length] }}>
                    Découvrir
                    <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1.5">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}