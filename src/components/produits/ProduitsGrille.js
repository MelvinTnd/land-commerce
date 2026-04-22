'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'
import { getProducts } from '@/lib/api'
import { getProductImage } from '@/lib/images'

const tris = ['Pertinence', 'Prix croissant', 'Prix décroissant', 'Meilleures ventes']

export default function ProduitsGrille({ categorieActive, prixMax, triActif, setTriActif, recherche, onCountChange }) {
  const [favoris, setFavoris] = useState([])
  const { ajouterAuPanier, estDansPanier } = useCart()
  const [vue, setVue] = useState('grille')
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const triMap = { 'Prix croissant': 'prix_asc', 'Prix décroissant': 'prix_desc', 'Meilleures ventes': 'note' }
    getProducts({
      search: recherche || undefined,
      category: categorieActive || undefined,
      prix_max: prixMax < 1500000 ? prixMax : undefined,
      tri: triMap[triActif] || 'recent',
    })
      .then(data => {
        const prods = (data.data || []).map(p => ({
          id: p.id, slug: p.slug, nom: p.name,
          lieu: p.shop?.location || 'Bénin',
          prix: parseFloat(p.price),
          promoP: p.promo_price ? parseFloat(p.promo_price) : null,
          note: parseFloat(p.avg_rating) || 5.0,
          badge: p.is_featured ? 'À la Une' : null,
          categorie: p.category?.name || 'Artisanat',
          image: getProductImage({ image: p.image, slug: p.slug, categorie: p.category?.name }),
          stock: p.stock,
        }))
        setProduits(prods)
        if (onCountChange) onCountChange(prods.length)
        setLoading(false)
      })
      .catch(() => { setProduits([]); if (onCountChange) onCountChange(0); setLoading(false) })
  }, [recherche, categorieActive, prixMax, triActif])

  const toggleFav = (e, id) => {
    e.preventDefault()
    setFavoris(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id])
  }

  return (
    <div className="flex-1 flex flex-col">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 rounded-[20px] bg-white"
        style={{ border: '1px solid #EBEBEB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#E6F8EA' }}>
            <span className="material-symbols-outlined text-[18px]" style={{ color: '#1B6B3A' }}>inventory_2</span>
          </div>
          <div>
            <p className="text-[13px] font-black text-[#0D0D0D] leading-tight">
              {categorieActive && categorieActive !== 'Tous' ? categorieActive : 'Tout le catalogue'}
            </p>
            <p className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>
              {loading ? 'Chargement...' : `${produits.length} article(s)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle vue */}
          <div className="flex items-center rounded-full p-1 gap-1" style={{ background: '#F3F4F6' }}>
            {[{ v: 'grille', icon: 'grid_view' }, { v: 'liste', icon: 'view_list' }].map(({ v, icon }) => (
              <button key={v} onClick={() => setVue(v)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: vue === v ? '#1B6B3A' : 'transparent', color: vue === v ? 'white' : '#9CA3AF' }}>
                <span className="material-symbols-outlined text-[17px]">{icon}</span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: '#F3F4F6' }}>
            <span className="material-symbols-outlined text-[15px]" style={{ color: '#9CA3AF' }}>sort</span>
            <select value={triActif} onChange={e => setTriActif(e.target.value)}
              className="text-[12px] font-black text-[#0D0D0D] bg-transparent outline-none cursor-pointer">
              {tris.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-[24px] p-4 animate-pulse">
              <div className="bg-gray-100 rounded-[18px] mb-4" style={{ aspectRatio: '4/5' }} />
              <div className="h-3 bg-gray-100 rounded mb-2 w-1/2" />
              <div className="h-4 bg-gray-100 rounded mb-4" />
              <div className="h-10 bg-gray-100 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : produits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[28px]"
          style={{ border: '1px dashed #E5E7EB' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: '#F3F4F6' }}>
            <span className="material-symbols-outlined text-[32px]" style={{ color: '#D1D5DB' }}>search_off</span>
          </div>
          <h3 className="text-[18px] font-black text-[#0D0D0D] mb-2">Aucun produit trouvé</h3>
          <p className="text-sm font-medium max-w-sm" style={{ color: '#9CA3AF' }}>
            Essayez d'élargir vos critères de filtre.
          </p>
        </div>
      ) : vue === 'grille' ? (
        /* ── GRILLE 3 colonnes max, cartes généreuses ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produits.map(p => {
            const inCart = estDansPanier(p.id)
            const isFav = favoris.includes(p.id)
            const remise = p.promoP ? Math.round((1 - p.promoP / p.prix) * 100) : null

            return (
              <div key={p.id}
                className="group bg-white rounded-[24px] overflow-hidden flex flex-col transition-all duration-400 hover:-translate-y-2 hover:shadow-xl"
                style={{ border: '1px solid #EBEBEB', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

                {/* Image — ratio carré pour plus de lisibilité */}
                <div className="relative overflow-hidden bg-[#F7F5F0]" style={{ aspectRatio: '1/1' }}>
                  <Link href={`/produits/${p.slug || p.id}`}>
                    <Image src={p.image} alt={p.nom} fill
                      className="object-cover transition-transform duration-600 group-hover:scale-105"
                      sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    {p.badge && (
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                        style={{ background: '#1B6B3A' }}>{p.badge}</span>
                    )}
                    {remise && (
                      <span className="px-3 py-1 rounded-full text-[9px] font-black text-white"
                        style={{ background: '#EF4444' }}>-{remise}%</span>
                    )}
                    {p.stock > 0 && p.stock <= 5 && (
                      <span className="px-3 py-1 rounded-full text-[9px] font-black text-white"
                        style={{ background: '#EA580C' }}>⚡ {p.stock} restants</span>
                    )}
                  </div>

                  {/* Favori */}
                  <button onClick={e => toggleFav(e, p.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all z-10"
                    style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <span className="material-symbols-outlined text-[17px]"
                      style={{ color: isFav ? '#EF4444' : '#D1D5DB', fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                      favorite
                    </span>
                  </button>

                  {/* Quick add — visible on hover */}
                  <div className="absolute bottom-3 left-3 right-3 transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      onClick={e => { e.preventDefault(); if (!inCart) ajouterAuPanier(p) }}
                      className="w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
                      style={{
                        background: inCart ? '#1B6B3A' : 'rgba(255,255,255,0.95)',
                        color: inCart ? 'white' : '#1B6B3A',
                        border: inCart ? 'none' : '1.5px solid rgba(27,107,58,0.3)',
                        backdropFilter: 'blur(4px)',
                      }}>
                      {inCart ? '✓ Dans le panier' : '+ Ajouter au panier'}
                    </button>
                  </div>
                </div>

                {/* Infos */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {p.lieu}
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]" style={{ color: '#EAB308', fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[11px] font-black" style={{ color: '#0D0D0D' }}>{p.note}</span>
                    </div>
                  </div>

                  <Link href={`/produits/${p.slug || p.id}`}>
                    <h5 className="font-black text-[15px] leading-snug text-[#0D0D0D] group-hover:text-[#1B6B3A] transition-colors line-clamp-2 mb-4">
                      {p.nom}
                    </h5>
                  </Link>

                  <div className="mt-auto flex items-center justify-between pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <div>
                      {p.promoP ? (
                        <>
                          <p className="font-black text-[18px] leading-none" style={{ color: '#EF4444' }}>
                            {p.promoP.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-400">CFA</span>
                          </p>
                          <p className="text-[11px] line-through mt-0.5" style={{ color: '#9CA3AF' }}>{p.prix.toLocaleString('fr-FR')} CFA</p>
                        </>
                      ) : (
                        <p className="font-black text-[18px] leading-none" style={{ color: '#0D0D0D' }}>
                          {p.prix.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-400">CFA</span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={e => { e.preventDefault(); if (!inCart) ajouterAuPanier(p) }}
                      className="w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 hover:scale-105"
                      style={{ background: inCart ? '#1B6B3A' : '#E6F8EA', color: inCart ? 'white' : '#1B6B3A' }}>
                      <span className="material-symbols-outlined text-[20px]">{inCart ? 'check' : 'add_shopping_cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── Vue LISTE ── */
        <div className="flex flex-col gap-4">
          {produits.map(p => {
            const inCart = estDansPanier(p.id)
            const isFav = favoris.includes(p.id)
            return (
              <Link key={p.id} href={`/produits/${p.slug || p.id}`}
                className="group flex gap-5 bg-white rounded-[24px] p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ border: '1px solid #EBEBEB' }}>
                <div className="relative shrink-0 w-36 aspect-square rounded-[18px] overflow-hidden bg-[#F7F5F0]">
                  <Image src={p.image} alt={p.nom} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="144px" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: '#F3F4F6', color: '#6B7280' }}>{p.categorie}</span>
                      <div className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[11px]" style={{ color: '#EAB308', fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-[11px] font-black" style={{ color: '#0D0D0D' }}>{p.note}</span>
                      </div>
                    </div>
                    <h5 className="font-black text-[16px] text-[#0D0D0D] group-hover:text-[#1B6B3A] transition-colors line-clamp-2 mb-1">{p.nom}</h5>
                    <p className="text-[11px] font-bold flex items-center gap-1" style={{ color: '#9CA3AF' }}>
                      <span className="material-symbols-outlined text-[13px]">location_on</span>{p.lieu}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <p className="font-black text-[20px] text-[#0D0D0D]">
                      {p.prix.toLocaleString('fr-FR')} <span className="text-[12px] font-bold text-gray-400">CFA</span>
                    </p>
                    <div className="flex gap-2">
                      <button onClick={e => toggleFav(e, p.id)}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all z-10"
                        style={{ background: '#F3F4F6', color: isFav ? '#EF4444' : '#9CA3AF' }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                      </button>
                      <button onClick={e => { e.preventDefault(); if (!inCart) ajouterAuPanier(p) }}
                        className="h-11 px-5 flex items-center gap-2 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all z-10"
                        style={{ background: inCart ? '#1B6B3A' : '#E6F8EA', color: inCart ? 'white' : '#1B6B3A' }}>
                        <span className="material-symbols-outlined text-[18px]">{inCart ? 'check' : 'add_shopping_cart'}</span>
                        {inCart ? 'Ajouté' : 'Ajouter'}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}