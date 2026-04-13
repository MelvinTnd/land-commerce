'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import { getProducts } from '@/lib/api'

const tris = ['Pertinence', 'Prix croissant', 'Prix décroissant', 'Meilleures ventes']

export default function ProduitsGrille({ categorieActive, prixMax, triActif, setTriActif, recherche, onCountChange }) {
  const [favoris, setFavoris] = useState([])
  const { ajouterAuPanier, estDansPanier } = useCart()
  const [vue, setVue] = useState('grille')
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const triMap = {
      'Prix croissant': 'prix_asc',
      'Prix décroissant': 'prix_desc',
      'Meilleures ventes': 'note',
    }
    getProducts({
      search:   recherche || undefined,
      category: categorieActive || undefined,
      prix_max: prixMax < 1500000 ? prixMax : undefined,
      tri:      triMap[triActif] || 'recent',
    })
      .then(data => {
        const prods = data.data || []
        const apiProducts = prods.map(p => ({
          id:       p.id,
          slug:     p.slug,
          nom:      p.name,
          lieu:     p.shop?.location || 'Bénin',
          prix:     parseFloat(p.price),
          promoP:   p.promo_price ? parseFloat(p.promo_price) : null,
          note:     parseFloat(p.avg_rating) || 5.0,
          reviews:  p.total_reviews || 0,
          badge:    p.is_featured ? 'À la Une' : null,
          categorie:p.category?.name || 'Artisanat',
          image:    p.image || 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80',
          stock:    p.stock,
        }))
        setProduits(apiProducts)
        if (onCountChange) onCountChange(apiProducts.length)
        setLoading(false)
      })
      .catch(() => { setProduits([]); if (onCountChange) onCountChange(0); setLoading(false) })
  }, [recherche, categorieActive, prixMax, triActif])

  const toggleFavori = (e, id) => {
    e.preventDefault()
    setFavoris((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const handleAjouterPanier = (e, produit) => {
    e.preventDefault()
    if (!estDansPanier(produit.id)) {
      ajouterAuPanier(produit)
    }
  }

  // Le tri et les filtres sont gérés côté API - pas de filtrage local
  const produitsFiltres = produits

  return (
    <div className="flex-1 flex flex-col">

      {/* Toolbox (Header Grid) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-[#E6F8EA] flex items-center justify-center text-[#1B6B3A]">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
           </div>
           <div>
             <h2 className="text-[16px] font-extrabold text-[#111827] leading-tight">
               {categorieActive === 'Tous' ? 'Tout le catalogue' : categorieActive}
             </h2>
             <p className="text-[12px] font-medium text-gray-500">
               {produitsFiltres.length} article(s) trouvé(s)
             </p>
           </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle View */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
            <button
              onClick={() => setVue('grille')}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${vue === 'grille' ? 'bg-white shadow-sm text-[#1B6B3A]' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setVue('liste')}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${vue === 'liste' ? 'bg-white shadow-sm text-[#1B6B3A]' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <span className="material-symbols-outlined text-[18px]">view_list</span>
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

          {/* Sort Select */}
          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-600">
            <span className="material-symbols-outlined text-[16px] text-gray-400 hidden sm:block">sort</span>
            <select
              value={triActif}
              onChange={(e) => setTriActif(e.target.value)}
              className="bg-transparent text-[#111827] outline-none cursor-pointer pr-4"
            >
              {tris.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[24px] border border-gray-100">
          <div className="w-12 h-12 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-medium text-gray-500">Chargement des produits...</p>
        </div>
      ) : produitsFiltres.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[24px] border border-gray-100 border-dashed">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
             <span className="material-symbols-outlined text-[32px] text-gray-300">search_off</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#111827] mb-2">Aucun produit trouvé</h3>
          <p className="text-sm font-medium text-gray-500 max-w-sm">
            Vos critères de recherche ou de filtre ne correspondent à aucun article. Essayez d'élargir votre sélection.
          </p>
        </div>
      ) : (
        <div className={vue === 'grille' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
          {produitsFiltres.map((produit) => {
            const inCart = estDansPanier(produit.id)
            const isFav = favoris.includes(produit.id)

            if (vue === 'grille') {
              return (
                <Link
                  href={`/produits/${produit.slug || produit.id}`}
                  key={produit.id}
                  className="group flex flex-col bg-white rounded-[24px] p-4 border border-transparent hover:border-[#D2F4DE] shadow-sm hover:shadow-xl transition-all duration-300 relative"
                >
                  <div className="relative rounded-[16px] overflow-hidden bg-gray-100 mb-5 aspect-[4/5] cursor-pointer">
                    <img
                      src={produit.image}
                      alt={produit.nom}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {produit.badge && (
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-[#111827] shadow-sm">
                        {produit.badge}
                      </span>
                    )}

                    <button 
                      onClick={(e) => toggleFavori(e, produit.id)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white transition-colors border border-gray-100 hover:border-red-200 z-10"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${isFav ? 'text-red-500' : 'text-gray-400'}`} style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {produit.lieu}
                      </div>
                      <div className="flex items-center gap-1">
                         <span className="material-symbols-outlined text-[12px] text-[#EAB308]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                         <span className="text-[11px] font-bold text-gray-600">{produit.note}</span>
                      </div>
                  </div>

                  <h5 className="font-extrabold text-[15px] leading-snug text-[#111827] group-hover:text-[#1B6B3A] transition-colors line-clamp-2 mb-4">
                      {produit.nom}
                  </h5>

                  <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Prix public</span>
                        <p className="font-extrabold text-[18px] text-[#111827] leading-none mt-1">
                          {produit.prix.toLocaleString('fr-FR')} <span className="text-[11px] text-gray-400">CFA</span>
                        </p>
                      </div>
                      <button
                          onClick={(e) => handleAjouterPanier(e, produit)}
                          className={`w-12 h-12 flex items-center justify-center rounded-[16px] transition-all duration-300 shadow-sm z-10 border ${
                            inCart 
                              ? 'bg-[#1B6B3A] border-[#1B6B3A] text-white' 
                              : 'bg-white border-gray-200 text-[#1B6B3A] hover:bg-[#1B6B3A] hover:border-[#1B6B3A] hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {inCart ? 'check' : 'add_shopping_cart'}
                          </span>
                      </button>
                  </div>
                </Link>
              )
            } else {
              // Vue Liste
              return (
                 <Link
                  href={`/produits/${produit.slug || produit.id}`}
                  key={produit.id}
                  className="group flex flex-col sm:flex-row bg-white rounded-[24px] p-4 border border-transparent hover:border-[#D2F4DE] shadow-sm hover:shadow-xl transition-all duration-300 relative gap-6"
                >
                  <div className="relative shrink-0 w-full sm:w-[220px] aspect-[4/3] rounded-[16px] overflow-hidden bg-gray-100">
                     <img
                        src={produit.image}
                        alt={produit.nom}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {produit.badge && (
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-[#111827] shadow-sm">
                          {produit.badge}
                        </span>
                      )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center py-2">
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                          {produit.categorie}
                        </div>
                        <div className="flex items-center gap-1 bg-[#FFF9E6] px-3 py-1 rounded-full">
                           <span className="material-symbols-outlined text-[12px] text-[#EAB308]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                           <span className="text-[11px] font-bold text-[#422006]">{produit.note}</span>
                        </div>
                     </div>

                     <h5 className="font-extrabold text-[20px] leading-snug text-[#111827] group-hover:text-[#1B6B3A] transition-colors line-clamp-2 mb-2">
                        {produit.nom}
                     </h5>

                     <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 mb-6">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {produit.lieu}
                     </div>

                     <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-end gap-2">
                          <p className="font-extrabold text-[24px] text-[#111827] leading-none">
                            {produit.prix.toLocaleString('fr-FR')} 
                          </p>
                          <span className="text-[12px] font-bold text-gray-400 mb-1">CFA</span>
                        </div>

                        <div className="flex items-center gap-3">
                           <button 
                              onClick={(e) => toggleFavori(e, produit.id)}
                              className="w-12 h-12 rounded-[16px] bg-white border border-gray-200 flex items-center justify-center hover:border-red-200 transition-colors z-10 shadow-sm"
                            >
                              <span className={`material-symbols-outlined text-[20px] ${isFav ? 'text-red-500' : 'text-gray-400'}`} style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>
                                favorite
                              </span>
                            </button>
                            <button
                                onClick={(e) => handleAjouterPanier(e, produit)}
                                className={`h-12 px-6 flex items-center justify-center gap-2 rounded-[16px] font-extrabold text-[12px] uppercase tracking-widest transition-all duration-300 shadow-sm z-10 border ${
                                  inCart 
                                    ? 'bg-[#1B6B3A] border-[#1B6B3A] text-white' 
                                    : 'bg-white border-gray-200 text-[#1B6B3A] hover:bg-[#1B6B3A] hover:border-[#1B6B3A] hover:text-white'
                                }`}
                              >
                                {inCart ? 'Dans le Panier' : 'Ajouter'}
                            </button>
                        </div>
                     </div>
                  </div>
                 </Link>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}