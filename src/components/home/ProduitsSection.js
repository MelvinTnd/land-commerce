'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'
import { getProducts } from '@/lib/api'
import { defaultProducts } from '@/lib/defaultData'
import { getProductImage } from '@/lib/images'

const filtres = [
  { label: 'Nouvelles créations', value: 'recent' },
  { label: 'Très demandé', value: 'tendance' },
  { label: 'Terroir & Bio', value: 'bio' },
]

export default function ProduitsSection() {
  const [filtre, setFiltre] = useState('recent')
  const { ajouterAuPanier, estDansPanier } = useCart()
  const [produits, setProduits] = useState(defaultProducts)
  const [loading, setLoading] = useState(true)
  const [favoris, setFavoris] = useState([])

  useEffect(() => {
    getProducts()
      .then(data => {
        const apiProducts = (data.data || []).slice(0, 8).map(p => ({
          id: p.id, slug: p.slug, nom: p.name,
          lieu: p.shop?.location || 'Bénin',
          prix: parseFloat(p.price),
          promoP: p.promo_price ? parseFloat(p.promo_price) : null,
          badge: p.is_featured ? 'En vedette' : '',
          note: parseFloat(p.avg_rating) || 4.9,
          image: getProductImage({ image: p.image, slug: p.slug, categorie: p.category?.name }),
          stock: p.stock,
          categorie: p.category?.slug || 'recent',
          createdAt: p.created_at,
        }))
        if (apiProducts.length > 0) setProduits(apiProducts)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-[1280px] mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              Pièces d&apos;exception.
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {filtres.map(f => (
              <button key={f.value} onClick={() => setFiltre(f.value)}
                className={`px-5 py-2 text-[11px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                  filtre === f.value 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-black'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── PRODUCTS ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-square mb-4" />
                <div className="h-3 bg-gray-100 mb-2 w-1/2" />
                <div className="h-4 bg-gray-100 mb-4" />
                <div className="h-6 bg-gray-100 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          (() => {
            const filtered = produits.filter(p => {
              if (filtre === 'recent') return true
              if (filtre === 'tendance') return p.note >= 4.7 || p.badge === 'En vedette'
              if (filtre === 'bio') return p.categorie === 'bio' || p.categorie?.toLowerCase().includes('aliment')
              return true
            }).slice(0, 4)

            if (filtered.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-24 text-center border border-gray-200 bg-[#F1F2F4]">
                  <span className="material-symbols-outlined text-[48px] text-gray-300 mb-4">inventory_2</span>
                  <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">Aucune pièce trouvée.</p>
                </div>
              )
            }

            return (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filtered.map(p => {
                  const inCart = estDansPanier(p.id)
                  const isFav = favoris.includes(p.id)
                  const remise = p.promoP ? Math.round((1 - p.promoP / p.prix) * 100) : null
                  return (
                    <div key={p.id} className="group flex flex-col transition-all duration-500 hover:-translate-y-1">

                      {/* Image */}
                      <div className="relative overflow-hidden bg-[#F1F2F4] aspect-square mb-4 border border-gray-100">
                        <Link href={`/produits/${p.slug || p.id}`}>
                          <Image src={p.image} alt={p.nom} fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" unoptimized />
                        </Link>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {p.badge && <span className="bg-black text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest">{p.badge}</span>}
                          {remise && <span className="bg-red-600 text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest">-{remise}%</span>}
                        </div>

                        {/* Fav */}
                        <button onClick={e => { e.preventDefault(); setFavoris(prev => prev.includes(p.id) ? prev.filter(f => f !== p.id) : [...prev, p.id]) }}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors border border-gray-100 shadow-sm">
                          <span className="material-symbols-outlined text-[15px]" 
                            style={{ color: isFav ? '#000' : '#9CA3AF', fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                        </button>
                      </div>

                      {/* Infos */}
                      <div className="flex flex-col flex-1 px-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {p.lieu}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px] text-gray-900" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-[11px] font-bold text-gray-900">{p.note}</span>
                          </div>
                        </div>

                        <Link href={`/produits/${p.slug || p.id}`}>
                          <h5 className="font-semibold text-[14px] text-gray-900 mb-3 hover:underline line-clamp-2">{p.nom}</h5>
                        </Link>

                        <div className="mt-auto flex items-end justify-between">
                          <div className="flex flex-col">
                            {p.promoP ? (
                              <>
                                <span className="text-[10px] line-through text-gray-400 mb-0.5">{p.prix.toLocaleString('fr-FR')} CFA</span>
                                <span className="font-bold text-[16px] text-red-600 leading-none">{p.promoP.toLocaleString('fr-FR')} CFA</span>
                              </>
                            ) : (
                              <span className="font-bold text-[16px] text-gray-900 leading-none">{p.prix.toLocaleString('fr-FR')} CFA</span>
                            )}
                          </div>
                          
                          <button onClick={e => { e.preventDefault(); if (!inCart) ajouterAuPanier(p) }}
                            className="w-9 h-9 border border-gray-200 flex items-center justify-center rounded-full hover:bg-black hover:text-white hover:border-black transition-colors"
                            style={{ background: inCart ? '#000' : 'transparent', color: inCart ? '#fff' : '#1A1A1A' }}>
                            <span className="material-symbols-outlined text-[16px]">{inCart ? 'check' : 'add'}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  )
                })}
              </div>
            )
          })()
        )}

        {/* View All */}
        <div className="flex justify-center mt-12">
          <Link href="/produits"
            className="border-b-2 border-transparent hover:border-black text-black font-bold uppercase tracking-widest text-[12px] pb-1 transition-colors flex items-center gap-2 group">
            Voir le catalogue complet
            <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">trending_flat</span>
          </Link>
        </div>

      </div>
    </section>
  )
}