'use client'
import { useState } from 'react'
import { useCart } from '@/lib/CartContext'

export default function DetailInfos({ produit }) {
  const [quantite, setQuantite] = useState(1)
  const [ajout, setAjout] = useState(false)
  const { ajouterAuPanier, estDansPanier } = useCart()

  if (!produit) return null

  const handleAjout = () => {
    for (let i = 0; i < quantite; i++) {
      ajouterAuPanier({
        id: produit.id,
        nom: produit.name,
        prix: parseFloat(produit.price),
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
        <div className="w-1 h-4 rounded-full" style={{ background: '#1B6B3A' }}/>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1B6B3A' }}>
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
          <span className="text-xs font-bold ml-1" style={{ color: '#374151' }}>{produit.total_reviews || 0} avis vérifiés</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: '#1B6B3A' }}
          >
            <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <span className="text-xs font-bold" style={{ color: '#1B6B3A' }}>Vendeur Certifié</span>
        </div>
      </div>

      {/* Prix */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#F7F5F0', border: '1px solid #E5E7EB' }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
          Prix Direct Atelier
        </p>
        <div className="flex items-end gap-2 mb-1">
          <span className="text-4xl font-extrabold" style={{ color: '#1A1A1A' }}>
            {parseFloat(produit.price).toLocaleString('fr-FR')}
          </span>
          <span className="text-lg font-bold mb-1" style={{ color: '#9CA3AF' }}>FCFA</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#1B6B3A' }}/>
          <span className="text-xs font-semibold" style={{ color: '#1B6B3A' }}>En Stock</span>
          <span className="text-xs" style={{ color: '#9CA3AF' }}>— {produit.stock} articles dispos</span>
        </div>
      </div>

      {/* Quantité + bouton */}
      <div className="flex items-center gap-4">

        {/* Quantité */}
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-full"
          style={{ border: '1px solid #E5E7EB', background: 'white' }}
        >
          <button
            onClick={() => setQuantite((q) => Math.max(1, q - 1))}
            className="w-6 h-6 flex items-center justify-center font-bold transition-all hover:opacity-60"
            style={{ color: '#1A1A1A' }}
          >
            −
          </button>
          <span className="text-base font-bold w-4 text-center" style={{ color: '#1A1A1A' }}>
            {quantite}
          </span>
          <button
            onClick={() => setQuantite((q) => Math.min(produit.stock, q + 1))}
            className="w-6 h-6 flex items-center justify-center font-bold transition-all hover:opacity-60"
            style={{ color: '#1A1A1A' }}
          >
            +
          </button>
        </div>

        {/* Bouton panier */}
        <button
          onClick={handleAjout}
          className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:opacity-90"
          style={{ background: ajout ? '#2E8B57' : '#1B6B3A' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {ajout ? 'Ajouté ✓' : 'Ajouter au Panier'}
        </button>
      </div>

      {/* Paiement mobile */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {['MTN', 'Moov', 'Cel'].map((p) => (
            <div
              key={p}
              className="px-3 py-1.5 rounded-lg text-[10px] font-black"
              style={{ background: '#FEF3C7', color: '#D4920A' }}
            >
              {p}
            </div>
          ))}
        </div>
        <span className="text-xs" style={{ color: '#9CA3AF' }}>Paiement Mobile Sécurisé</span>
       </div>

      {/* Garanties */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1B6B3A' }}>
            local_shipping
          </span>
          <div>
            <p className="text-xs font-bold" style={{ color: '#1A1A1A' }}>Livraison Rapide</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#9CA3AF' }}>
              24h à Cotonou & Calavi, 72h partout au Bénin
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1B6B3A' }}>
            verified
          </span>
          <div>
            <p className="text-xs font-bold" style={{ color: '#1A1A1A' }}>Certifié Origine</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#9CA3AF' }}>
              Accompagné de son certificat d'authenticité
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}