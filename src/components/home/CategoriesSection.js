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

export default function CategoriesSection() {
  const [categories, setCategories] = useState(defaultCategories)
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
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-[1280px] mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-5 leading-tight">
            Les Univers.
          </h2>
          <p className="text-[14px] text-gray-500 font-normal leading-relaxed">
            Parcourez nos collections prestigieuses et trouvez des pièces uniques conçues par des créateurs de talent.
          </p>
        </div>

        {/* ── GRID ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-gray-100 aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={cat.slug ? `/produits?category=${cat.slug}` : '/produits'}
                className="group relative flex flex-col overflow-hidden bg-gray-100 aspect-[3/4] border border-gray-200 hover:border-gray-900 transition-colors duration-500"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                </div>

                {/* Bottom content */}
                <div className="relative z-10 mt-auto p-6 lg:p-8 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2 tracking-tight group-hover:underline">
                    {cat.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/90">
                    Découvrir
                    <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-1.5 border-b border-transparent">
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