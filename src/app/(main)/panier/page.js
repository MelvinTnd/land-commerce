'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

export default function PanierPage() {
  const { articles, updateQuantite, retirerDuPanier, sousTotal, livraison, total } = useCart()
  const [codePromo, setCodePromo] = useState('')

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-6">
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: '#9CA3AF' }}>
          <Link href="/" className="hover:text-green-800 transition-colors">Accueil</Link>
          <span>›</span>
          <span style={{ color: '#1A1A1A', fontWeight: '600' }}>Mon Panier</span>
        </div>
        <h1 className="text-4xl font-extrabold" style={{ color: '#1A1A1A' }}>
          Mon Panier
          <span className="text-lg font-medium ml-3" style={{ color: '#9CA3AF' }}>
            ({articles.length} article{articles.length > 1 ? 's' : ''})
          </span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        {articles.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined mb-4" style={{ fontSize: '64px', color: '#D4920A' }}>shopping_bag</span>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#1A1A1A' }}>Votre panier est vide</h2>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Découvrez nos trésors artisanaux et remplissez votre panier !
            </p>
            <Link href="/produits" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-sm transition-all hover:opacity-90" style={{ background: '#1B6B3A' }}>
              Explorer le Marché
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Liste articles */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-2xl p-5 flex gap-5 items-start transition-all hover:shadow-md" style={{ border: '1px solid #E5E7EB' }}>
                  <img src={article.image} alt={article.nom} className="w-28 h-28 rounded-xl object-cover shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-base" style={{ color: '#1A1A1A' }}>{article.nom}</h3>
                        <p className="text-xs" style={{ color: '#9CA3AF' }}>{article.artisan || ''} {article.lieu ? `· ${article.lieu}` : ''}</p>
                      </div>
                      <button onClick={() => retirerDuPanier(article.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center rounded-full" style={{ border: '1px solid #E5E7EB' }}>
                        <button onClick={() => updateQuantite(article.id, article.quantite - 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-green-800 transition-colors rounded-l-full">−</button>
                        <span className="w-10 text-center text-sm font-bold" style={{ color: '#1A1A1A' }}>{article.quantite}</span>
                        <button onClick={() => updateQuantite(article.id, article.quantite + 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-green-800 transition-colors rounded-r-full">+</button>
                      </div>
                      <p className="font-extrabold text-lg" style={{ color: '#1A1A1A' }}>
                        {(article.prix * article.quantite).toLocaleString('fr-FR')}
                        <span className="text-xs font-normal ml-1" style={{ color: '#9CA3AF' }}>FCFA</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-6" style={{ border: '1px solid #E5E7EB' }}>
                <h3 className="text-lg font-extrabold mb-6" style={{ color: '#1A1A1A' }}>Résumé de commande</h3>
                <div className="flex mb-6">
                  <input type="text" value={codePromo} onChange={(e) => setCodePromo(e.target.value)} placeholder="Code promo"
                    className="flex-1 px-4 py-3 rounded-l-xl text-sm outline-none" style={{ background: '#F7F5F0', border: '1px solid #E5E7EB', borderRight: 'none' }} />
                  <button className="px-5 py-3 rounded-r-xl text-sm font-bold text-white" style={{ background: '#1B6B3A' }}>Appliquer</button>
                </div>
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#6B7280' }}>Sous-total</span>
                    <span className="font-semibold">{sousTotal.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#6B7280' }}>Livraison</span>
                    <span className="font-semibold" style={{ color: livraison === 0 ? '#1B6B3A' : '#1A1A1A' }}>
                      {livraison === 0 ? 'Gratuite' : `${livraison.toLocaleString('fr-FR')} FCFA`}
                    </span>
                  </div>
                  <div className="h-px my-2" style={{ background: '#E5E7EB' }} />
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-extrabold" style={{ color: '#1B6B3A' }}>{total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>

                {livraison === 0 && sousTotal > 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-xs font-semibold" style={{ background: '#F0FDF4', color: '#1B6B3A' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>local_shipping</span>
                    Livraison gratuite au-dessus de 50 000 FCFA !
                  </div>
                )}

                <Link href="/paiement"
                  className="w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: '#1B6B3A', boxShadow: '0 8px 24px rgba(27,107,58,0.3)' }}>
                  Passer la commande
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </Link>

                <div className="flex items-center justify-center gap-4 mt-5">
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#374151' }}>payments</span>
                    <span className="text-[10px] font-bold uppercase" style={{ color: '#374151' }}>MTN MoMo</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#374151' }}>account_balance_wallet</span>
                    <span className="text-[10px] font-bold uppercase" style={{ color: '#374151' }}>Moov Money</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
