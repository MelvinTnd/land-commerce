'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'
import { getProducts } from '@/lib/api'
import { defaultProducts } from '@/lib/defaultData'
import { getProductImage } from '@/lib/images'

const filtres = [
  { label: 'Nouvelles créations', value: 'recent', emoji: '✨' },
  { label: 'Très demandé', value: 'tendance', emoji: '🔥' },
  { label: 'Terroir & Bio', value: 'bio', emoji: '🌿' },
]

export default function ProduitsSection() {
  const [filtre, setFiltre] = useState('recent')
  const { ajouterAuPanier, estDansPanier } = useCart()
  const [produits, setProduits] = useState(defaultProducts)
  const [loading, setLoading] = useState(true)
  const [favoris, setFavoris] = useState([])

  useEffect(() => {
    getProducts({ featured: true })
      .then(data => {
        const apiProducts = (data.data || []).map(p => ({
          id: p.id, slug: p.slug, nom: p.name,
          lieu: p.shop?.location || 'Bénin',
          prix: parseFloat(p.price),
          promoP: p.promo_price ? parseFloat(p.promo_price) : null,
          badge: p.is_featured ? 'À la Une' : '',
          note: parseFloat(p.avg_rating) || 4.9,
          image: getProductImage({ image: p.image, slug: p.slug, categorie: p.category?.name }),
          stock: p.stock,
        }))
        if (apiProducts.length > 0) setProduits(apiProducts)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-28 px-6 md:px-12 lg:px-20" style={{ background: 'white' }}>
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-5 border"
              style={{ background: 'rgba(27,107,58,0.06)', color: '#1B6B3A', borderColor: 'rgba(27,107,58,0.18)' }}>
              <span className="material-symbols-outlined text-[14px]">stars</span>
              Catalogue Exclusif
            </span>
            <h2 className="text-4xl md:text-[56px] font-black text-[#0D0D0D] tracking-tight leading-[1.05]">
              Pépites <span style={{ color: '#1B6B3A' }}>Locales</span>
            </h2>
          </div>

          {/* Filtres pill */}
          <div className="flex flex-wrap gap-2">
            {filtres.map(f => (
              <button key={f.value} onClick={() => setFiltre(f.value)}
                className="px-5 py-2.5 rounded-full text-[12px] font-black transition-all duration-300 flex items-center gap-2"
                style={{
                  background: filtre === f.value ? '#0D0D0D' : '#F3F4F6',
                  color: filtre === f.value ? 'white' : '#6B7280',
                  boxShadow: filtre === f.value ? '0 4px 14px rgba(0,0,0,0.2)' : 'none',
                }}>
                {f.emoji} {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid — 4 col, cartes compactes */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#F7F5F0] rounded-[24px] p-4 animate-pulse">
                <div className="bg-gray-200 rounded-[18px] mb-4" style={{ aspectRatio: '1/1' }} />
                <div className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
                <div className="h-4 bg-gray-200 rounded mb-4" />
                <div className="h-10 bg-gray-200 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : produits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[#F7F5F0] rounded-[28px]">
            <span className="material-symbols-outlined text-[48px] mb-3" style={{ color: '#D1D5DB' }}>inventory_2</span>
            <p className="text-sm text-gray-400 font-medium">Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {produits.map(p => {
              const inCart = estDansPanier(p.id)
              const isFav = favoris.includes(p.id)
              const remise = p.promoP ? Math.round((1 - p.promoP / p.prix) * 100) : null
              return (
                <div key={p.id}
                  className="group bg-white rounded-[24px] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                  style={{ border: '1px solid #EBEBEB' }}>

                  {/* Image carré */}
                  <div className="relative overflow-hidden bg-[#F7F5F0]" style={{ aspectRatio: '1/1' }}>
                    <Link href={`/produits/${p.slug || p.id}`}>
                      <Image src={p.image} alt={p.nom} fill
                        className="object-cover transition-transform duration-600 group-hover:scale-105"
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-col">
                      {p.badge && <span className="px-2.5 py-1 rounded-full text-[9px] font-black text-white" style={{ background: '#1B6B3A' }}>{p.badge}</span>}
                      {remise && <span className="px-2.5 py-1 rounded-full text-[9px] font-black text-white" style={{ background: '#EF4444' }}>-{remise}%</span>}
                    </div>

                    {/* Fav */}
                    <button onClick={e => { e.preventDefault(); setFavoris(prev => prev.includes(p.id) ? prev.filter(f => f !== p.id) : [...prev, p.id]) }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all z-10"
                      style={{ background: 'rgba(255,255,255,0.9)' }}>
                      <span className="material-symbols-outlined text-[16px]"
                        style={{ color: isFav ? '#EF4444' : '#D1D5DB', fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    </button>
                  </div>

                  {/* Infos */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: '#9CA3AF' }}>
                        <span className="material-symbols-outlined text-[12px]">location_on</span>{p.lieu}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]" style={{ color: '#EAB308', fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-[11px] font-black text-[#0D0D0D]">{p.note}</span>
                      </div>
                    </div>

                    <Link href={`/produits/${p.slug || p.id}`}>
                      <h5 className="font-black text-[14px] leading-snug text-[#0D0D0D] group-hover:text-[#1B6B3A] transition-colors line-clamp-2 mb-3">{p.nom}</h5>
                    </Link>

                    <div className="mt-auto flex items-center justify-between pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                      <div>
                        {p.promoP ? (
                          <>
                            <p className="font-black text-[17px] leading-none" style={{ color: '#EF4444' }}>{p.promoP.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-400">CFA</span></p>
                            <p className="text-[10px] line-through mt-0.5" style={{ color: '#9CA3AF' }}>{p.prix.toLocaleString('fr-FR')} CFA</p>
                          </>
                        ) : (
                          <p className="font-black text-[17px] leading-none text-[#0D0D0D]">{p.prix.toLocaleString('fr-FR')} <span className="text-[10px] text-gray-400">CFA</span></p>
                        )}
                      </div>
                      <button onClick={e => { e.preventDefault(); if (!inCart) ajouterAuPanier(p) }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-105"
                        style={{ background: inCart ? '#1B6B3A' : '#E6F8EA', color: inCart ? 'white' : '#1B6B3A' }}>
                        <span className="material-symbols-outlined text-[18px]">{inCart ? 'check' : 'add_shopping_cart'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Voir tout */}
        <div className="flex justify-center mt-14">
          <Link href="/produits"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-black text-[12px] uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-lg text-white"
            style={{ background: '#0D0D0D' }}>
            Voir tout le catalogue
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}