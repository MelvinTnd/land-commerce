'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'

export default function PanierPage() {
  const { articles, updateQuantite, retirerDuPanier, sousTotal, livraison, total } = useCart()
  const [codePromo, setCodePromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#F7F5F0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-12">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-6" style={{ color: '#9CA3AF' }}>
            <Link href="/" className="hover:text-[#1B6B3A] transition-colors">Accueil</Link>
            <span>/</span>
            <span style={{ color: '#0D0D0D' }}>Mon Panier</span>
          </div>
          <div className="flex items-end gap-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: '#0D0D0D' }}>
              Mon Panier
            </h1>
            <span className="mb-1 text-[13px] font-bold" style={{ color: '#9CA3AF' }}>
              {articles.length} article{articles.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Étapes */}
          {articles.length > 0 && (
            <div className="flex items-center gap-2 mt-6">
              {[
                { n: 1, label: 'Panier', active: true },
                { n: 2, label: 'Livraison', active: false },
                { n: 3, label: 'Paiement', active: false },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center text-[11px] font-black border"
                      style={{
                        background: s.active ? '#0D0D0D' : 'transparent',
                        borderColor: s.active ? '#0D0D0D' : '#D1D5DB',
                        color: s.active ? 'white' : '#9CA3AF',
                      }}>
                      {s.n}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:block"
                      style={{ color: s.active ? '#0D0D0D' : '#9CA3AF' }}>
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && <div className="w-8 sm:w-16 h-px" style={{ background: '#E5E7EB' }} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 pb-28">

        {/* Panier vide */}
        {articles.length === 0 ? (
          <div className="bg-white flex flex-col items-center justify-center py-28 text-center" style={{ border: '1px solid #E5E7EB' }}>
            <span className="material-symbols-outlined text-[56px] mb-6" style={{ color: '#D1D5DB' }}>shopping_bag</span>
            <h2 className="text-2xl font-black mb-2" style={{ color: '#0D0D0D' }}>Votre panier est vide</h2>
            <p className="text-[14px] font-medium mb-8 max-w-xs" style={{ color: '#9CA3AF' }}>
              Découvrez nos trésors artisanaux et remplissez votre panier !
            </p>
            <Link href="/produits"
              className="inline-flex items-center gap-2 px-8 py-3 font-black text-[11px] uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              style={{ background: '#1B6B3A' }}>
              <span className="material-symbols-outlined text-[16px]">explore</span>
              Explorer le Marché
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Articles ── */}
            <div className="lg:col-span-2 flex flex-col divide-y divide-gray-100 bg-white" style={{ border: '1px solid #E5E7EB' }}>
              {articles.map(a => (
                <div key={a.id} className="flex gap-5 items-start p-5">
                  {/* Image */}
                  <div className="relative w-24 h-24 overflow-hidden bg-gray-100 shrink-0">
                    <Image src={a.image} alt={a.nom} fill className="object-cover" sizes="96px" unoptimized />
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-[14px] leading-snug line-clamp-2" style={{ color: '#0D0D0D' }}>{a.nom}</h3>
                        {(a.artisan || a.lieu) && (
                          <p className="text-[11px] font-medium mt-1 flex items-center gap-1" style={{ color: '#9CA3AF' }}>
                            <span className="material-symbols-outlined text-[13px]">location_on</span>
                            {[a.artisan, a.lieu].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>
                      <button onClick={() => retirerDuPanier(a.id)}
                        className="w-7 h-7 flex items-center justify-center transition-colors hover:text-red-500 shrink-0"
                        style={{ color: '#D1D5DB' }}>
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantité */}
                      <div className="flex items-center border border-gray-200">
                        <button onClick={() => updateQuantite(a.id, a.quantite - 1)}
                          className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-gray-50">
                          <span className="material-symbols-outlined text-[18px]" style={{ color: '#6B7280' }}>remove</span>
                        </button>
                        <span className="w-9 text-center font-black text-[14px]" style={{ color: '#0D0D0D' }}>{a.quantite}</span>
                        <button onClick={() => updateQuantite(a.id, a.quantite + 1)}
                          className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-gray-50">
                          <span className="material-symbols-outlined text-[18px]" style={{ color: '#6B7280' }}>add</span>
                        </button>
                      </div>

                      {/* Prix */}
                      <div className="text-right">
                        <p className="font-black text-[17px] leading-none" style={{ color: '#0D0D0D' }}>
                          {(a.prix * a.quantite).toLocaleString('fr-FR')}
                          <span className="text-[11px] font-bold ml-1" style={{ color: '#9CA3AF' }}>CFA</span>
                        </p>
                        {a.quantite > 1 && (
                          <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{a.prix.toLocaleString('fr-FR')} / u</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continuer */}
              <div className="p-5">
                <Link href="/produits"
                  className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-colors hover:text-[#1B6B3A] w-fit"
                  style={{ color: '#9CA3AF' }}>
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Continuer vos achats
                </Link>
              </div>
            </div>

            {/* ── Résumé ── */}
            <div className="lg:col-span-1">
              <div className="bg-white p-7 sticky top-24" style={{ border: '1px solid #E5E7EB' }}>
                <h2 className="text-[14px] font-black uppercase tracking-widest mb-6 pb-4" style={{ color: '#0D0D0D', borderBottom: '1px solid #F3F4F6' }}>
                  Résumé
                </h2>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-medium" style={{ color: '#6B7280' }}>
                      Sous-total ({articles.length} article{articles.length > 1 ? 's' : ''})
                    </span>
                    <span className="text-[13px] font-black" style={{ color: '#0D0D0D' }}>{sousTotal.toLocaleString('fr-FR')} CFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-medium" style={{ color: '#6B7280' }}>Livraison</span>
                    <span className="text-[13px] font-black" style={{ color: livraison === 0 ? '#1B6B3A' : '#0D0D0D' }}>
                      {livraison === 0 ? 'Gratuite' : `${livraison.toLocaleString('fr-FR')} CFA`}
                    </span>
                  </div>
                </div>

                {/* Code promo */}
                <div className="mb-6">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Code promo</p>
                  <div className="flex">
                    <input type="text" placeholder="Ex: CAURI10"
                      value={codePromo}
                      onChange={e => setCodePromo(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-[13px] font-bold outline-none border border-gray-200 transition-colors"
                      style={{ color: '#0D0D0D' }}
                      onFocus={e => e.target.style.borderColor = '#0D0D0D'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                    <button onClick={() => setPromoApplied(true)}
                      className="px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-[#0D0D0D] border-y border-r border-gray-200 bg-white transition-opacity hover:opacity-90">
                      OK
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-[11px] font-bold mt-1.5 flex items-center gap-1" style={{ color: '#1B6B3A' }}>
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Code appliqué !
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4 mb-6" style={{ borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
                  <span className="font-black text-[14px] uppercase tracking-widest" style={{ color: '#0D0D0D' }}>Total</span>
                  <span className="font-black text-[24px]" style={{ color: '#1B6B3A' }}>
                    {total.toLocaleString('fr-FR')}
                    <span className="text-[13px] font-bold ml-1" style={{ color: '#9CA3AF' }}>CFA</span>
                  </span>
                </div>

                <Link href="/paiement"
                  className="w-full flex items-center justify-center gap-2 py-4 font-black text-[12px] uppercase tracking-widest text-white transition-opacity hover:opacity-90 mb-5"
                  style={{ background: '#1B6B3A' }}>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Commander — {total.toLocaleString('fr-FR')} CFA
                </Link>

                {/* Trust badges */}
                <div className="flex flex-col gap-2">
                  {[
                    { icon: 'lock', label: 'Paiement 100% sécurisé' },
                    { icon: 'verified_user', label: 'Protection acheteur' },
                    { icon: 'local_shipping', label: 'Livraison rapide au Bénin' },
                  ].map(b => (
                    <div key={b.label} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]" style={{ color: '#1B6B3A' }}>{b.icon}</span>
                      <span className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
