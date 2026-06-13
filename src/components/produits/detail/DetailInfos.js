'use client'
import { useState } from 'react'
import { useCart } from '@/lib/CartContext'

export default function DetailInfos({ produit }) {
  const [quantite, setQuantite] = useState(1)
  const [ajout, setAjout] = useState(false)
  const { ajouterAuPanier, estDansPanier } = useCart()

  if (!produit) return null

  const prixFinal = parseFloat(produit.promo_price || produit.price)
  const prixOriginal = parseFloat(produit.price)

  const handleAjout = () => {
    for (let i = 0; i < quantite; i++) {
      ajouterAuPanier({
        id: produit.id,
        nom: produit.name,
        prix: prixFinal,
        image: produit.image || 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80',
        shop: produit.shop,
      })
    }
    setAjout(true)
    setTimeout(() => setAjout(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Label */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full" style={{ background: '#008060' }}/>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#008060' }}>
          {produit.category?.name || "Artisanat d'Exception"}
        </span>
      </div>

      {/* Titre */}
      <div>
        <h1 className="text-4xl font-extrabold leading-tight" style={{ color: '#1A1A1A' }}>
          {produit.name}
        </h1>
        <p className="text-base mt-2" style={{ color: '#6B7280' }}>
          {produit.description}
        </p>
      </div>

      {/* Note + vendeur certifié */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((i) => (
            <svg key={i} width="14" height="14" fill={i <= Math.round(produit.avg_rating || 5) ? '#F5B731' : 'none'} stroke="#F5B731" strokeWidth="1.5" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
          <span className="text-xs font-bold ml-1" style={{ color: '#374151' }}>{produit.total_reviews || 0} avis</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: '#008060' }}
          >
            <svg width="8" height="8" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <span className="text-xs font-bold" style={{ color: '#008060' }}>Vendeur Certifié</span>
        </div>
      </div>

      {/* Prix */}
      <div className="py-2 border-y border-gray-100">
        <div className="flex items-end gap-2 mb-1">
          {produit.promo_price ? (
            <>
              <span className="text-3xl font-extrabold" style={{ color: '#EF4444' }}>
                {parseFloat(produit.promo_price).toLocaleString('fr-FR')}
              </span>
              <span className="text-sm font-bold mb-1" style={{ color: '#9CA3AF' }}>FCFA</span>
              <span className="text-sm line-through ml-1 mb-1" style={{ color: '#9CA3AF' }}>
                {parseFloat(produit.price).toLocaleString('fr-FR')}
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl font-extrabold" style={{ color: '#1A1A1A' }}>
                {parseFloat(produit.price).toLocaleString('fr-FR')}
              </span>
              <span className="text-sm font-bold mb-1" style={{ color: '#9CA3AF' }}>FCFA</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#008060' }}/>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">En Stock ({produit.stock})</span>
        </div>
      </div>

      {/* Quantité + bouton */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">

        {/* Quantité */}
        <div
          className="flex items-center justify-between w-full sm:w-32 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200"
        >
          <button
            onClick={() => setQuantite((q) => Math.max(1, q - 1))}
            className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-black transition-colors"
          >
            −
          </button>
          <span className="text-sm font-bold text-black w-4 text-center">
            {quantite}
          </span>
          <button
            onClick={() => setQuantite((q) => Math.min(produit.stock, q + 1))}
            className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-black transition-colors"
          >
            +
          </button>
        </div>

        {/* Bouton panier */}
        <button
          onClick={handleAjout}
          className="flex-1 w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 shadow-lg shadow-green-900/10"
          style={{ background: ajout ? '#005C45' : '#008060' }}
        >
          {ajout ? 'Ajouté au panier ✓' : 'Ajouter au Panier'}
        </button>
      </div>

      {/* Paiement mobile */}
      <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Paiement 100% Sécurisé</span>
        <div className="flex gap-2">
          {['MTN', 'Moov', 'Cel'].map((p) => (
            <div
              key={p}
              className="px-2 py-1 flex items-center justify-center rounded text-[9px] font-black"
              style={{ background: '#F3F4F6', color: '#9CA3AF' }}
            >
              {p}
            </div>
          ))}
        </div>
       </div>

      {/* Garanties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-4 border-t border-gray-100">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#008060' }}>
            local_shipping
          </span>
          <div>
            <p className="text-xs font-bold text-gray-900">Livraison Rapide</p>
            <p className="text-[11px] leading-relaxed text-gray-500">
              24h à Cotonou, 72h au Bénin.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#008060' }}>
            verified_user
          </span>
          <div>
            <p className="text-xs font-bold text-gray-900">Qualité Garantie</p>
            <p className="text-[11px] leading-relaxed text-gray-500">
              Certifié conforme par le vendeur.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}