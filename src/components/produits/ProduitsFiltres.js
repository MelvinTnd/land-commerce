'use client'
import { useState, useEffect } from 'react'
import { getCategories } from '@/lib/api'
import Link from 'next/link'

const defaultCategories = [
  { label: 'Tous', icon: 'grid_view', slug: null },
]

export default function ProduitsFiltres({ categorieActive, setCategorieActive, recherche, setRecherche }) {
  const [categories, setCategories] = useState(defaultCategories)
  const [localRecherche, setLocalRecherche] = useState(recherche || '')

  useEffect(() => {
    getCategories()
      .then(data => {
        const apiCats = data.map(c => ({ label: c.name, icon: c.icon || 'category', slug: c.slug }))
        setCategories([...defaultCategories, ...apiCats])
      })
      .catch(() => {
        setCategories([
          { label: 'Tous',                  icon: 'grid_view',     slug: null },
          { label: 'Artisanat',             icon: 'palette',       slug: 'artisanat' },
          { label: 'Mode & Textile',        icon: 'checkroom',     slug: 'mode-textile' },
          { label: 'Beauté & Santé',        icon: 'spa',           slug: 'beaute-sante' },
          { label: 'Alimentation & Épices', icon: 'restaurant',    slug: 'alimentation-epices' },
          { label: 'Art & Culture',         icon: 'brush',         slug: 'art-culture' },
          { label: 'Maison & Déco',         icon: 'chair',         slug: 'maison-deco' },
          { label: 'Électronique',          icon: 'devices',       slug: 'electronique' },
          { label: 'Sports & Loisirs',      icon: 'sports_soccer', slug: 'sports-loisirs' },
        ])
      })
  }, [])

  // Debounce 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (setRecherche) setRecherche(localRecherche)
    }, 400)
    return () => clearTimeout(timer)
  }, [localRecherche, setRecherche])

  const resetFiltres = () => {
    setCategorieActive(null)
    setLocalRecherche('')
    if (setRecherche) setRecherche('')
  }

  const filtresActifs = categorieActive || localRecherche

  return (
    <aside className="hidden lg:flex flex-col gap-0 w-60 shrink-0">

      {/* ─── Header ─── */}
      <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <span className="font-black text-[11px] uppercase tracking-[0.22em]" style={{ color: '#0D0D0D' }}>Filtres</span>
        {filtresActifs && (
          <button onClick={resetFiltres}
            className="text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-[#1B6B3A]"
            style={{ color: '#9CA3AF' }}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* ─── Recherche ─── */}
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#9CA3AF' }}>Recherche</p>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px]"
            style={{ color: '#9CA3AF' }}>search</span>
          <input
            type="text"
            value={localRecherche}
            onChange={e => setLocalRecherche(e.target.value)}
            placeholder="Nom, description..."
            className="w-full pl-9 pr-8 py-2.5 text-[13px] font-medium outline-none border bg-white transition-colors"
            style={{ borderColor: '#E5E7EB', color: '#0D0D0D' }}
            onFocus={e => e.target.style.borderColor = '#0D0D0D'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
          {localRecherche && (
            <button onClick={() => setLocalRecherche('')}
              className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="material-symbols-outlined text-[15px]" style={{ color: '#9CA3AF' }}>close</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Catégories ─── */}
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#9CA3AF' }}>
          Univers Produits
        </p>
        <div className="flex flex-col">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setCategorieActive(cat.slug)}
              className="flex items-center justify-between px-0 py-2.5 text-[13px] font-bold transition-colors text-left border-b"
              style={{
                borderColor: '#F3F4F6',
                color: categorieActive === cat.slug ? '#1B6B3A' : '#4B5563',
              }}>
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[16px]"
                  style={{ color: categorieActive === cat.slug ? '#1B6B3A' : '#D1D5DB' }}>
                  {cat.icon}
                </span>
                {cat.label}
              </span>
              {categorieActive === cat.slug && (
                <span className="material-symbols-outlined text-[14px]" style={{ color: '#1B6B3A' }}>check</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Bannière Vendeur ─── */}
      <div className="p-5 bg-[#0D0D0D]">
        <span className="material-symbols-outlined text-[24px] mb-3 block" style={{ color: '#D4920A' }}>storefront</span>
        <h4 className="font-black text-white text-[13px] leading-tight mb-1">
          Vendez sur CauriMarket
        </h4>
        <p className="text-[11px] font-medium mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Rejoignez des centaines d&apos;artisans béninois en 2 minutes.
        </p>
        <Link href="/inscription-vendeur"
          className="block text-center px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-white transition-opacity hover:opacity-80"
          style={{ background: '#1B6B3A' }}>
          Créer ma boutique
        </Link>
      </div>
    </aside>
  )
}