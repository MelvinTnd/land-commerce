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

      {/* Header sobre */}
      <div className="bg-white px-6 md:px-10 py-8" style={{ borderBottom: '1px solid #EBEBEB' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-[11px] font-bold mb-4" style={{ color: '#9CA3AF' }}>
            <Link href="/" className="hover:text-[#1B6B3A] transition-colors">Accueil</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
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
        </div>
      </div>

      {/* Progress steps */}
      {articles.length > 0 && (
        <div className="bg-white border-b px-6 md:px-10 py-4" style={{ borderColor: '#EBEBEB' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              {[
                { n: 1, label: 'Panier', active: true, done: false },
                { n: 2, label: 'Livraison', active: false, done: false },
                { n: 3, label: 'Paiement', active: false, done: false },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black"
                      style={{
                        background: s.active ? '#1B6B3A' : '#F3F4F6',
                        color: s.active ? 'white' : '#9CA3AF',
                      }}>
                      {s.done ? <span className="material-symbols-outlined text-[14px]">check</span> : s.n}
                    </div>
                    <span className="text-[12px] font-bold hidden sm:block" style={{ color: s.active ? '#0D0D0D' : '#9CA3AF' }}>
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && <div className="w-16 h-[1px] mx-1" style={{ background: '#EBEBEB' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 pb-28">

        {/* Panier vide */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-[32px] flex flex-col items-center justify-center py-28 text-center"
            style={{ border: '1px solid #EBEBEB' }}>
            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ background: '#E6F8EA' }}>
                <span className="material-symbols-outlined text-[64px]" style={{ color: '#1B6B3A' }}>shopping_bag</span>
              </div>
              <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-[14px]"
                style={{ background: '#D4920A' }}>0</div>
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: '#0D0D0D' }}>Votre panier est vide</h2>
            <p className="text-[14px] font-medium mb-8 max-w-xs" style={{ color: '#9CA3AF' }}>
              Découvrez nos trésors artisanaux et remplissez votre panier !
            </p>
            <Link href="/produits"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-black text-[12px] uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: '#1B6B3A' }}>
              <span className="material-symbols-outlined text-[18px]">explore</span>
              Explorer le Marché
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Liste articles (2/3) ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {articles.map(a => (
                <div key={a.id} className="bg-white rounded-[24px] p-5 flex gap-5 items-start transition-all hover:shadow-md"
                  style={{ border: '1px solid #EBEBEB' }}>
                  {/* Image */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-[18px] overflow-hidden bg-[#F7F5F0] shrink-0">
                    <Image src={a.image} alt={a.nom} fill className="object-cover" sizes="112px" />
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-[14px] md:text-[15px] leading-snug text-[#0D0D0D] line-clamp-2">{a.nom}</h3>
                        {(a.artisan || a.lieu) && (
                          <p className="text-[11px] font-medium mt-1 flex items-center gap-1" style={{ color: '#9CA3AF' }}>
                            <span className="material-symbols-outlined text-[13px]">location_on</span>
                            {[a.artisan, a.lieu].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>
                      <button onClick={() => retirerDuPanier(a.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:bg-red-50"
                        style={{ color: '#D1D5DB' }}>
                        <span className="material-symbols-outlined text-[16px] hover:text-red-500 transition-colors">close</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantité */}
                      <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1.5px solid #EBEBEB' }}>
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
              <Link href="/produits"
                className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest mt-2 transition-colors hover:text-[#1B6B3A] w-fit"
                style={{ color: '#9CA3AF' }}>
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Continuer vos achats
              </Link>
            </div>

            {/* ── Résumé (1/3) ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[28px] p-7 sticky top-24" style={{ border: '1px solid #EBEBEB', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <h2 className="text-[15px] font-black text-[#0D0D0D] mb-6">Résumé de commande</h2>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-medium" style={{ color: '#6B7280' }}>Sous-total ({articles.length} article{articles.length > 1 ? 's' : ''})</span>
                    <span className="text-[13px] font-black" style={{ color: '#0D0D0D' }}>{sousTotal.toLocaleString('fr-FR')} CFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-medium" style={{ color: '#6B7280' }}>Livraison</span>
                    <span className="text-[13px] font-black" style={{ color: livraison === 0 ? '#1B6B3A' : '#0D0D0D' }}>
                      {livraison === 0 ? '🎉 Gratuite' : `${livraison.toLocaleString('fr-FR')} CFA`}
                    </span>
                  </div>
                </div>

                {/* Code promo */}
                <div className="mb-6">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Code promo</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Ex: BÉNIN10"
                      value={codePromo}
                      onChange={e => setCodePromo(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl text-[13px] font-bold outline-none transition-all"
                      style={{ background: '#F7F5F0', border: '1.5px solid rgba(27,107,58,0.15)', color: '#0D0D0D' }} />
                    <button onClick={() => setPromoApplied(true)}
                      className="px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all hover:opacity-90 text-white"
                      style={{ background: '#0D0D0D' }}>OK</button>
                  </div>
                  {promoApplied && (
                    <p className="text-[11px] font-bold mt-1.5 flex items-center gap-1" style={{ color: '#1B6B3A' }}>
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Code appliqué !
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-5 mb-6"
                  style={{ borderTop: '2px solid #F3F4F6', borderBottom: '2px solid #F3F4F6' }}>
                  <span className="font-black text-[15px]" style={{ color: '#0D0D0D' }}>Total</span>
                  <span className="font-black text-[26px]" style={{ color: '#1B6B3A' }}>
                    {total.toLocaleString('fr-FR')}
                    <span className="text-[14px] font-bold ml-1" style={{ color: '#9CA3AF' }}>CFA</span>
                  </span>
                </div>

                <Link href="/paiement"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-lg mb-4"
                  style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)' }}>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Commander — {total.toLocaleString('fr-FR')} CFA
                </Link>

                {/* Trust */}
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
