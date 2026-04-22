'use client'
import { useState, useEffect } from 'react'
import { getCategories } from '@/lib/api'
import Link from 'next/link'

const defaultCategories = [
  { label: 'Tous', icon: 'grid_view', slug: null },
]

export default function ProduitsFiltres({ categorieActive, setCategorieActive, prixMax, setPrixMax, recherche, setRecherche }) {
  const [categories, setCategories] = useState(defaultCategories)
  const [localPrix, setLocalPrix] = useState(prixMax)
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

  // Debounce : déclenche la recherche 400ms après la frappe
  useEffect(() => {
    const timer = setTimeout(() => {
      if (setRecherche) setRecherche(localRecherche)
    }, 400)
    return () => clearTimeout(timer)
  }, [localRecherche, setRecherche])

  // Slider prix : affichage instantané, envoi seulement au mouseup
  const handlePrixChange = (e) => setLocalPrix(Number(e.target.value))
  const handlePrixCommit = () => setPrixMax(localPrix)

  const resetFiltres = () => {
    setCategorieActive(null)
    setLocalPrix(1500000)
    setPrixMax(1500000)
    setLocalRecherche('')
    if (setRecherche) setRecherche('')
  }

  const filtresActifs = categorieActive || localPrix < 1500000 || localRecherche

  return (
    <aside className="hidden lg:flex flex-col gap-5 w-64 shrink-0">

      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]" style={{ color: '#1B6B3A' }}>tune</span>
          <span className="font-extrabold text-[15px]" style={{ color: '#111827' }}>Affiner la recherche</span>
        </div>
        {filtresActifs && (
          <button onClick={resetFiltres}
            className="text-[10px] font-bold px-2.5 py-1 rounded-full hover:bg-red-50 transition-colors"
            style={{ color: '#DC2626' }}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* ─── Barre de Recherche ─────────────────────────────────── */}
      <div className="bg-white rounded-[20px] p-4" style={{ border: '1px solid #E5E7EB' }}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#6B7280' }}>Recherche</p>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px]"
            style={{ color: '#9CA3AF' }}>search</span>
          <input
            type="text"
            value={localRecherche}
            onChange={e => setLocalRecherche(e.target.value)}
            placeholder="Nom, description..."
            className="w-full pl-10 pr-8 py-2.5 rounded-xl text-[13px] font-medium outline-none"
            style={{ background: '#F9F9F9', border: '2px solid #E5E7EB', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#1B6B3A'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
          {localRecherche && (
            <button onClick={() => setLocalRecherche('')}
              className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="material-symbols-outlined text-[16px]" style={{ color: '#9CA3AF' }}>close</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Catégories ─────────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] p-4" style={{ border: '1px solid #E5E7EB' }}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#6B7280' }}>
          Univers Produits
        </p>
        <div className="flex flex-col gap-0.5">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setCategorieActive(cat.slug)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all text-left"
              style={categorieActive === cat.slug
                ? { background: '#1B6B3A', color: 'white' }
                : { background: 'transparent', color: '#4B5563' }}>
              <span className="material-symbols-outlined text-[17px]"
                style={{ color: categorieActive === cat.slug ? 'white' : '#9CA3AF' }}>
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Filtre Prix ────────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] p-4" style={{ border: '1px solid #E5E7EB' }}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: '#6B7280' }}>
          Budget (FCFA)
        </p>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max="1500000"
            step="5000"
            value={localPrix}
            onChange={handlePrixChange}
            onMouseUp={handlePrixCommit}
            onTouchEnd={handlePrixCommit}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: '#1B6B3A' }}
          />
          <div className="flex justify-between mt-2 text-[10px] font-bold" style={{ color: '#9CA3AF' }}>
            <span>0 CFA</span>
            <span>1 500 000</span>
          </div>
          <div className="mt-3 rounded-xl py-2.5 px-3 text-center"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <p className="text-[13px] font-black" style={{ color: '#1B6B3A' }}>
              Jusqu&apos;à {localPrix.toLocaleString('fr-FR')} CFA
            </p>
          </div>
          {localPrix < 1500000 && (
            <button
              onClick={() => { setLocalPrix(1500000); setPrixMax(1500000) }}
              className="mt-2 w-full text-[10px] font-bold py-1.5 rounded-lg"
              style={{ color: '#DC2626', background: '#FEF2F2' }}>
              Retirer le filtre prix
            </button>
          )}
        </div>
      </div>

      {/* ─── Bannière Vendeur ───────────────────────────────────── */}
      <div className="rounded-[20px] p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B6B3A, #0D4A28)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l10 20H10L20 0z' fill='white'/%3E%3C/svg%3E\")" }} />
        <div className="relative z-10">
          <span className="material-symbols-outlined text-[28px] mb-2 block" style={{ color: '#D4920A' }}>storefront</span>
          <h4 className="font-extrabold text-white text-[14px] leading-tight mb-1">
            Vendez sur BéninMarket
          </h4>
          <p className="text-[11px] font-medium mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Rejoignez des centaines d&apos;artisans béninois en 2 minutes.
          </p>
          <Link href="/inscription-vendeur"
            className="block text-center px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
            style={{ background: '#D4920A', color: 'white' }}>
            Créer ma boutique
          </Link>
        </div>
      </div>
    </aside>
  )
}