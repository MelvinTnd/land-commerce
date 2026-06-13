'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'
import { getProducts } from '@/lib/api'
import { getProductImage } from '@/lib/images'
import ProductImage from '@/components/ui/ProductImage'

const tris = ['Pertinence', 'Prix croissant', 'Prix décroissant', 'Meilleures ventes']

const FALLBACK_PRODUITS_RAW = [
  { id: 1, slug: 'tissu-kita-multicolor',      nom: 'Tissu Kita Multicolore',           lieu: 'Cotonou',        prix: 8500,  promoP: null,  note: 4.8, badge: 'À la Une', categorie: 'Tissus',       categorieSlug: 'tissus', stock: 12 },
  { id: 2, slug: 'sculpture-bronze-roi',       nom: 'Sculpture Bronze Roi d\'Abomey',    lieu: 'Abomey',         prix: 45000, promoP: 38000, note: 5.0, badge: 'À la Une', categorie: 'Sculpture',    categorieSlug: 'sculpture', stock: 3 },
  { id: 3, slug: 'perles-yoruba',              nom: 'Collier Perles Yoruba',             lieu: 'Porto-Novo',     prix: 12000, promoP: null,  note: 4.7, badge: null,       categorie: 'Bijoux',       categorieSlug: 'bijoux', stock: 8 },
  { id: 4, slug: 'panier-tresse-natitingou',   nom: 'Panier Tressé Natitingou',          lieu: 'Natitingou',     prix: 6500,  promoP: null,  note: 4.6, badge: null,       categorie: 'Vannerie',     categorieSlug: 'vannerie', stock: 20 },
  { id: 5, slug: 'masque-gelede',              nom: 'Masque Gèlèdè Traditionnel',        lieu: 'Kétou',          prix: 28000, promoP: null,  note: 4.9, badge: 'À la Une', categorie: 'Arts Rituels', categorieSlug: 'arts-rituels', stock: 2 },
  { id: 6, slug: 'batik-wax-premium',          nom: 'Batik Wax Premium 6 yards',         lieu: 'Cotonou',        prix: 15000, promoP: 12500, note: 4.7, badge: null,       categorie: 'Tissus',       categorieSlug: 'tissus', stock: 15 },
  { id: 7, slug: 'pot-terre-cuite-glazoue',    nom: 'Pot en Terre Cuite de Glazoué',     lieu: 'Glazoué',        prix: 7500,  promoP: null,  note: 4.5, badge: null,       categorie: 'Poterie',      categorieSlug: 'poterie', stock: 10 },
  { id: 8, slug: 'sac-cuir-ouidah',            nom: 'Sac Cuir Artisanal Ouidah',         lieu: 'Ouidah',         prix: 22000, promoP: null,  note: 4.8, badge: null,       categorie: 'Maroquinerie', categorieSlug: 'maroquinerie', stock: 5 },
  { id: 9, slug: 'boubou-brodee-parakou',      nom: 'Boubou Brodée de Parakou',          lieu: 'Parakou',        prix: 35000, promoP: 29000, note: 4.9, badge: 'À la Une', categorie: 'Vêtements',    categorieSlug: 'vetements', stock: 7 },
  { id: 10, slug: 'bijou-bronze-danxome',      nom: 'Bijou Bronze Danxomè',              lieu: 'Abomey',         prix: 18500, promoP: null,  note: 4.6, badge: null,       categorie: 'Bijoux',       categorieSlug: 'bijoux', stock: 4 },
  { id: 11, slug: 'huile-palme-rouge',         nom: 'Huile de Palme Rouge Bio',          lieu: 'Lokossa',        prix: 3500,  promoP: null,  note: 4.7, badge: null,       categorie: 'Alimentaire',  categorieSlug: 'alimentation', stock: 50 },
  { id: 12, slug: 'figurine-bois-fon',         nom: 'Figurine en Bois Fon sculptée',     lieu: 'Abomey-Calavi',  prix: 9500,  promoP: null,  note: 4.5, badge: null,       categorie: 'Sculpture',    categorieSlug: 'sculpture', stock: 11 },
]
const FALLBACK_PRODUITS = FALLBACK_PRODUITS_RAW.map(p => ({
  ...p,
  image: getProductImage({ slug: p.slug, categorie: p.categorie }),
}))

export default function ProduitsGrille({ categorieActive, triActif, setTriActif, recherche, onCountChange }) {
  const [favoris, setFavoris] = useState([])
  const { ajouterAuPanier, estDansPanier } = useCart()
  const [vue, setVue] = useState('grille')
  const [loading, setLoading] = useState(true)
  const [allProduits, setAllProduits] = useState([])

  useEffect(() => {
    setLoading(true)
    const triMap = { 'Prix croissant': 'prix_asc', 'Prix décroissant': 'prix_desc', 'Meilleures ventes': 'note' }
    getProducts({
      search: recherche || undefined,
      category: categorieActive || undefined,
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
          categorieSlug: p.category?.slug || '',
          image: getProductImage({ image: p.image, slug: p.slug, categorie: p.category?.name }),
          stock: p.stock,
          shop: p.shop,
        }))
        if (prods.length > 0) {
          setAllProduits(prods)
        } else {
          if (recherche || (categorieActive && categorieActive !== 'Tous')) {
            setAllProduits([])
          } else {
            setAllProduits(FALLBACK_PRODUITS)
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setAllProduits(FALLBACK_PRODUITS)
        setLoading(false)
      })
  }, [recherche, categorieActive, triActif])

  const produits = allProduits.filter(p => {
    if (categorieActive && categorieActive !== null) {
      const matchSlug = p.categorieSlug?.toLowerCase() === categorieActive?.toLowerCase()
      const matchNom  = p.categorie?.toLowerCase().includes(categorieActive?.toLowerCase())
      if (!matchSlug && !matchNom) return false
    }
    if (recherche && recherche.trim()) {
      const q = recherche.toLowerCase()
      if (!p.nom.toLowerCase().includes(q) && !p.categorie.toLowerCase().includes(q) && !p.lieu.toLowerCase().includes(q)) return false
    }
    return true
  })

  useEffect(() => {
    if (onCountChange) onCountChange(produits.length)
  }, [produits.length, onCountChange])

  const toggleFav = (e, id) => {
    e.preventDefault()
    setFavoris(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id])
  }

  return (
    <div className="flex-1 flex flex-col">

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4"
        style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div>
          <p className="text-[13px] font-black" style={{ color: '#0D0D0D' }}>
            {categorieActive && categorieActive !== 'Tous' ? categorieActive : 'Tout le catalogue'}
          </p>
          <p className="text-[11px] font-medium mt-0.5" style={{ color: '#9CA3AF' }}>
            {loading ? 'Chargement...' : `${produits.length} article(s)`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle vue */}
          <div className="flex items-center border border-gray-200">
            {[{ v: 'grille', icon: 'grid_view' }, { v: 'liste', icon: 'view_list' }].map(({ v, icon }) => (
              <button key={v} onClick={() => setVue(v)}
                className="w-9 h-9 flex items-center justify-center transition-colors"
                style={{
                  background: vue === v ? '#0D0D0D' : 'white',
                  color: vue === v ? 'white' : '#6B7280'
                }}>
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </button>
            ))}
          </div>

          {/* Tri */}
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 bg-white">
            <span className="material-symbols-outlined text-[15px] text-gray-400">sort</span>
            <select value={triActif} onChange={e => setTriActif(e.target.value)}
              className="text-[12px] font-bold uppercase tracking-widest text-gray-900 bg-transparent outline-none cursor-pointer">
              {tris.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Skeletons ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-4 animate-pulse" style={{ border: '1px solid #E5E7EB' }}>
              <div className="bg-gray-100 mb-4" style={{ aspectRatio: '1/1' }} />
              <div className="h-2.5 bg-gray-100 mb-2 w-1/3" />
              <div className="h-4 bg-gray-100 mb-3" />
              <div className="h-3 bg-gray-100 w-1/2" />
            </div>
          ))}
        </div>

      ) : produits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-gray-200">
          <span className="material-symbols-outlined text-[40px] mb-4" style={{ color: '#D1D5DB' }}>search_off</span>
          <h3 className="text-[17px] font-black mb-2" style={{ color: '#0D0D0D' }}>Aucun produit trouvé</h3>
          <p className="text-[13px] font-medium max-w-sm" style={{ color: '#9CA3AF' }}>
            Essayez d&apos;élargir vos critères de filtre.
          </p>
        </div>

      ) : vue === 'grille' ? (

        /* ── GRILLE ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produits.map(p => {
            const inCart = estDansPanier(p.id)
            const isFav = favoris.includes(p.id)
            const remise = p.promoP ? Math.round((1 - p.promoP / p.prix) * 100) : null

            return (
              <div key={p.id} className="group bg-white flex flex-col overflow-hidden transition-all hover:shadow-lg"
                style={{ border: '1px solid #E5E7EB' }}>

                {/* Image */}
                <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
                  <Link href={`/produits/${p.slug || p.id}`}
                    style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                    <ProductImage
                      nom={p.nom}
                      categorie={p.categorie}
                      apiImage={p.image}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {p.badge && (
                      <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white"
                        style={{ background: '#1B6B3A' }}>{p.badge}</span>
                    )}
                    {remise && (
                      <span className="px-2.5 py-1 text-[9px] font-black text-white"
                        style={{ background: '#EF4444' }}>-{remise}%</span>
                    )}
                    {p.stock > 0 && p.stock <= 5 && (
                      <span className="px-2.5 py-1 text-[9px] font-black text-white"
                        style={{ background: '#EA580C' }}>⚡ {p.stock} restants</span>
                    )}
                  </div>

                  {/* Favori */}
                  <button onClick={e => toggleFav(e, p.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center border border-gray-200 hover:border-gray-900 transition-colors z-10">
                    <span className="material-symbols-outlined text-[16px]"
                      style={{ color: isFav ? '#EF4444' : '#9CA3AF', fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                      favorite
                    </span>
                  </button>

                  {/* Quick add on hover */}
                  <div className="absolute bottom-0 left-0 right-0 transition-all duration-300 translate-y-full group-hover:translate-y-0">
                    <button
                      onClick={e => { e.preventDefault(); if (!inCart) ajouterAuPanier({ ...p, prix: p.promoP || p.prix }) }}
                      className="w-full py-3 text-[11px] font-black uppercase tracking-widest transition-colors border-t"
                      style={{
                        background: inCart ? '#1B6B3A' : 'white',
                        color: inCart ? 'white' : '#0D0D0D',
                        borderColor: '#E5E7EB',
                      }}>
                      {inCart ? '✓ Dans le panier' : '+ Ajouter au panier'}
                    </button>
                  </div>
                </div>

                {/* Infos produit */}
                <div className="p-4 flex flex-col flex-1" style={{ borderTop: '1px solid #F3F4F6' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                      {p.lieu}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px] text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[11px] font-bold" style={{ color: '#0D0D0D' }}>{p.note}</span>
                    </div>
                  </div>

                  <Link href={`/produits/${p.slug || p.id}`}>
                    <h5 className="font-bold text-[14px] leading-snug line-clamp-2 mb-3 transition-colors hover:text-[#1B6B3A]"
                      style={{ color: '#0D0D0D' }}>
                      {p.nom}
                    </h5>
                  </Link>

                  <div className="mt-auto flex items-center justify-between pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <div>
                      {p.promoP ? (
                        <>
                          <p className="font-black text-[17px] leading-none" style={{ color: '#EF4444' }}>
                            {p.promoP.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-400">CFA</span>
                          </p>
                          <p className="text-[11px] line-through mt-0.5" style={{ color: '#9CA3AF' }}>{p.prix.toLocaleString('fr-FR')} CFA</p>
                        </>
                      ) : (
                        <p className="font-bold text-[17px] leading-none" style={{ color: '#0D0D0D' }}>
                          {p.prix.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-400">CFA</span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={e => { e.preventDefault(); if (!inCart) ajouterAuPanier({ ...p, prix: p.promoP || p.prix }) }}
                      className="w-9 h-9 flex items-center justify-center border transition-colors"
                      style={{
                        background: inCart ? '#1B6B3A' : 'white',
                        borderColor: inCart ? '#1B6B3A' : '#E5E7EB',
                        color: inCart ? 'white' : '#0D0D0D'
                      }}>
                      <span className="material-symbols-outlined text-[18px]">{inCart ? 'check' : 'add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      ) : (

        /* ── LISTE ── */
        <div className="flex flex-col gap-4">
          {produits.map(p => {
            const inCart = estDansPanier(p.id)
            const isFav = favoris.includes(p.id)
            const remise = p.promoP ? Math.round((1 - p.promoP / p.prix) * 100) : null
            return (
              <div key={p.id} className="group flex gap-5 bg-white py-5 px-5 transition-colors hover:shadow-md"
                style={{ border: '1px solid #E5E7EB' }}>
                <div className="relative shrink-0 w-28 aspect-square overflow-hidden bg-gray-100">
                  <Link href={`/produits/${p.slug || p.id}`} style={{ position: 'absolute', inset: 0 }}>
                    <img src={p.image} alt={p.nom} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                  </Link>
                  {remise && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-black text-white"
                      style={{ background: '#EF4444' }}>-{remise}%</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>{p.lieu}</span>
                      <span className="text-[10px]" style={{ color: '#D1D5DB' }}>·</span>
                      <span className="text-[10px] font-bold" style={{ color: '#9CA3AF' }}>{p.categorie}</span>
                    </div>
                    <Link href={`/produits/${p.slug || p.id}`}>
                      <h5 className="font-bold text-[15px] line-clamp-2 leading-snug transition-colors hover:text-[#1B6B3A]"
                        style={{ color: '#0D0D0D' }}>{p.nom}</h5>
                    </Link>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="material-symbols-outlined text-[11px] text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[11px] font-bold" style={{ color: '#0D0D0D' }}>{p.note}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <div>
                      {p.promoP ? (
                        <>
                          <p className="font-black text-[18px] leading-none" style={{ color: '#EF4444' }}>
                            {p.promoP.toLocaleString('fr-FR')} <span className="text-[11px] font-bold text-gray-400">CFA</span>
                          </p>
                          <p className="text-[11px] line-through" style={{ color: '#9CA3AF' }}>{p.prix.toLocaleString('fr-FR')} CFA</p>
                        </>
                      ) : (
                        <p className="font-black text-[18px]" style={{ color: '#0D0D0D' }}>
                          {p.prix.toLocaleString('fr-FR')} <span className="text-[11px] font-bold text-gray-400">CFA</span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={e => toggleFav(e, p.id)}
                        className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:border-gray-900 transition-colors"
                        style={{ color: isFav ? '#EF4444' : '#9CA3AF' }}>
                        <span className="material-symbols-outlined text-[17px]" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                      </button>
                      <button onClick={e => { e.preventDefault(); if (!inCart) ajouterAuPanier({ ...p, prix: p.promoP || p.prix }) }}
                        className="flex items-center gap-2 px-4 h-9 font-black text-[11px] uppercase tracking-widest border transition-colors"
                        style={{
                          background: inCart ? '#1B6B3A' : 'white',
                          borderColor: inCart ? '#1B6B3A' : '#E5E7EB',
                          color: inCart ? 'white' : '#0D0D0D'
                        }}>
                        <span className="material-symbols-outlined text-[16px]">{inCart ? 'check' : 'add_shopping_cart'}</span>
                        {inCart ? 'Ajouté' : 'Ajouter'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
