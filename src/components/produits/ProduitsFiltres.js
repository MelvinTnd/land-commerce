'use client'
import { useState, useEffect } from 'react'
import { getCategories } from '@/lib/api'
import Link from 'next/link'

const defaultCategories = [
  { label: 'Tous', icon: 'grid_view', slug: null },
]

export default function ProduitsFiltres({ categorieActive, setCategorieActive, prixMax, setPrixMax }) {
  const [categories, setCategories] = useState(defaultCategories)

  useEffect(() => {
    getCategories()
      .then(data => {
        const apiCats = data.map(c => ({
          label: c.name,
          icon:  c.icon || 'category',
          slug:  c.slug,
        }))
        setCategories([...defaultCategories, ...apiCats])
      })
      .catch(() => {
        // fallback statique si API indisponible
        setCategories([
          { label: 'Tous',               icon: 'grid_view',        slug: null },
          { label: 'Artisanat',          icon: 'palette',          slug: 'artisanat' },
          { label: 'Mode & Textile',     icon: 'checkroom',        slug: 'mode-textile' },
          { label: 'Beauté & Santé',     icon: 'spa',              slug: 'beaute-sante' },
          { label: 'Alimentation & Épices', icon: 'restaurant',   slug: 'alimentation-epices' },
          { label: 'Art & Culture',      icon: 'brush',            slug: 'art-culture' },
          { label: 'Maison & Déco',      icon: 'chair',            slug: 'maison-deco' },
          { label: 'Électronique',       icon: 'devices',          slug: 'electronique' },
          { label: 'Sports & Loisirs',   icon: 'sports_soccer',    slug: 'sports-loisirs' },
        ])
      })
  }, [])

  return (
    <aside className="hidden lg:flex flex-col gap-6 w-64 shrink-0">

      {/* Titre filtres */}
      <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-4">
        <span className="material-symbols-outlined text-[20px] text-[#1B6B3A]">
          tune
        </span>
        <span className="font-extrabold text-[15px] text-[#111827]">Affiner la recherche</span>
      </div>

      {/* Catégories depuis API */}
      <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500 mb-4 bg-gray-50 inline-block px-3 py-1 rounded-full">
          Univers Produits
        </p>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setCategorieActive(cat.slug)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-[13px] font-bold transition-all text-left group ${
                categorieActive === cat.slug
                  ? 'bg-[#1B6B3A] text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-[#F9FAFA] hover:text-[#1B6B3A]'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] transition-colors ${
                categorieActive === cat.slug ? 'text-white' : 'text-gray-400 group-hover:text-[#1B6B3A]'
              }`}>
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtre Prix */}
      <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500 mb-6 bg-gray-50 inline-block px-3 py-1 rounded-full">
          Budget (CFA)
        </p>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="1500000"
            step="5000"
            value={prixMax}
            onChange={(e) => setPrixMax(Number(e.target.value))}
            className="w-full accent-[#1B6B3A] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>0</span>
            <span>1.5M</span>
          </div>
          <div className="mt-4 bg-[#F9FAFA] border border-gray-100 rounded-xl py-3 px-4 flex items-center justify-center">
            <p className="text-[13px] font-extrabold text-[#1B6B3A]">
              Jusqu'à : {prixMax.toLocaleString('fr-FR')} CFA
            </p>
          </div>
        </div>
      </div>

      {/* Bannière Publicitaire Vendeur */}
      <div className="rounded-[24px] p-6 relative overflow-hidden bg-[#EAB308] border-2 border-transparent hover:border-[#422006]/10 transition-colors shadow-lg group">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-[#422006]">
             <span className="material-symbols-outlined text-[20px]">storefront</span>
          </div>
          <h4 className="font-extrabold text-[#422006] text-[15px] leading-tight">
            Vendez dans le monde entier
          </h4>
          <p className="text-[#422006]/80 text-[11px] font-medium leading-relaxed mb-4">
            Ouvrez votre e-boutique gratuitement sur BéninMarket en 2 minutes.
          </p>
          <Link
            href="/inscription-vendeur"
            className="w-full text-center px-4 py-3 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all bg-[#422006] hover:bg-black text-white shadow-xl hover:-translate-y-1"
          >
            Créer ma boutique
          </Link>
        </div>
      </div>

    </aside>
  )
}