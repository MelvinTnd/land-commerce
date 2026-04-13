'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategories } from '@/lib/api'
import { defaultCategories } from '@/lib/defaultData'

const imagesParCategorie = {
  'artisanat': 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=600',
  'mode-textile': 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=600',
  'alimentation-epices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600',
  'maison-deco': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600',
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState(defaultCategories)

  useEffect(() => {
    getCategories()
      .then(data => {
        if (!data || data.length === 0) return
        const apiCats = data.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon || 'category',
          description: c.description || 'Découvrez nos produits',
          image: imagesParCategorie[c.slug] || 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=600',
        }))
        setCategories(apiCats)
      })
      .catch(() => { })
  }, [])

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#1B6B3A] text-[24px]">category</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
            Explorez la <span className="text-[#1B6B3A]">Diversité</span>
          </h2>
          <p className="text-[15px] font-medium text-gray-500 leading-relaxed">
            Pour faciliter votre recherche, nous avons regroupé l'excellence des artisans dans nos 4 univers fondateurs. Plongez dans votre passion.
          </p>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.slug ? `/produits?category=${cat.slug}` : '/produits'}
              className="group flex flex-col bg-white rounded-[32px] p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D2F4DE] transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative w-full aspect-square rounded-[24px] overflow-hidden bg-gray-100 mb-6">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                {/* Icône flottante */}
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-[14px] bg-white shadow-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#1B6B3A] text-[24px]">{cat.icon}</span>
                </div>
              </div>

              {/* Texte */}
              <div className="flex flex-col px-2 flex-grow">
                <h3 className="text-[20px] font-extrabold text-[#111827] group-hover:text-[#1B6B3A] transition-colors mb-2 leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-6">
                  {cat.description}
                </p>

                {/* Bouton */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[#1B6B3A] font-extrabold text-[11px] uppercase tracking-widest">
                  Découvrir l'univers
                  <div className="w-8 h-8 rounded-full bg-[#E6F8EA] flex items-center justify-center group-hover:bg-[#1B6B3A] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}