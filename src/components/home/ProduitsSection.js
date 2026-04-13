'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'
import { getProducts } from '@/lib/api'
import { defaultProducts } from '@/lib/defaultData'


const filtres = [
  { label: 'Nouvelles Créations', value: 'recent' },
  { label: 'Très Demandé', value: 'tendance' },
  { label: 'Terroir & Bio', value: 'bio' },
]


export default function ProduitsSection() {
  const [filtre, setFiltre] = useState('recent')
  const { ajouterAuPanier, estDansPanier } = useCart()
  const [produits, setProduits] = useState(defaultProducts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ featured: true })
      .then(data => {
        const apiProducts = (data.data || []).map(p => ({
          id: p.id,
          slug: p.slug,
          nom: p.name,
          lieu: p.shop?.location || 'Bénin',
          prix: parseFloat(p.price),
          badge: p.is_featured ? 'Mis en avant' : '',
          categorie: 'recent',
          image: p.image || 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=600',
          stock: p.stock,
        }))
        if (apiProducts.length > 0) setProduits(apiProducts)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Tous les produits sont 'recent' côté API
  const produitsFiltres = produits

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-[1200px] mx-auto">

        {/* Header & Filtres */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#EAB308] text-[20px]">stars</span>
              <p className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-[#1B6B3A]">
                Catalogue Exclusif
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight">
              Pépites <span className="text-[#1B6B3A]">Locales</span>
            </h2>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            {filtres.map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltre(f.value)}
                className={`px-6 py-3 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all ${filtre === f.value
                    ? 'bg-[#1B6B3A] text-white shadow-md'
                    : 'bg-[#F9FAFA] text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille Produits */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-[24px] p-4 animate-pulse">
                <div className="bg-gray-100 rounded-[16px] mb-5 aspect-[4/5]"></div>
                <div className="h-3 bg-gray-100 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded mb-4"></div>
                <div className="h-8 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : produitsFiltres.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-[24px]">
            <span className="material-symbols-outlined text-gray-300 text-[48px] mb-2">inventory_2</span>
            <p className="text-sm text-gray-500 font-medium">Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produitsFiltres.map((produit) => {
            const inCart = estDansPanier(produit.id)
            return (
              <div key={produit.id} className="group flex flex-col bg-white rounded-[24px] p-4 border border-transparent hover:border-[#D2F4DE] shadow-sm hover:shadow-xl transition-all duration-300">

                {/* Image */}
                <div className="relative rounded-[16px] overflow-hidden bg-gray-100 mb-5 aspect-[4/5]">
                  <Link href={`/produits/${produit.slug || produit.id}`}>
                    <Image
                      src={produit.image}
                      alt={produit.nom}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </Link>

                  {produit.badge && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-[#111827] shadow-sm">
                      {produit.badge}
                    </span>
                  )}
                  {produit.stock <= 5 && (
                    <span className="absolute top-4 right-4 bg-[#EA580C] px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white shadow-sm">
                      Rare: {produit.stock}
                    </span>
                  )}
                </div>

                {/* Lieu */}
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {produit.lieu}
                </div>

                <Link href={`/produits/${produit.slug || produit.id}`} className="mb-4">
                  <h5 className="font-extrabold text-[15px] leading-snug text-[#111827] group-hover:text-[#1B6B3A] transition-colors line-clamp-2">
                    {produit.nom}
                  </h5>
                </Link>

                {/* Prix et Panier */}
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Prix public</span>
                    <p className="font-extrabold text-[18px] text-[#111827] leading-none mt-1">
                      {produit.prix.toLocaleString('fr-FR')}
                      <span className="text-[11px] text-gray-400 ml-1">CFA</span>
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (!inCart) ajouterAuPanier(produit)
                    }}
                    className={`w-12 h-12 flex items-center justify-center rounded-[16px] transition-all duration-300 shadow-sm ${inCart
                        ? 'bg-[#1B6B3A] text-white'
                        : 'bg-[#F0FDF4] text-[#1B6B3A] hover:bg-[#1B6B3A] hover:text-white'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {inCart ? 'check' : 'add_shopping_cart'}
                    </span>
                  </button>
                </div>

              </div>
            )
          })}
        </div>

        )}

        {/* Voir tout */}
        <div className="flex justify-center mt-12">
          <Link
            href="/produits"
            className="bg-white border-2 border-gray-200 hover:border-[#1B6B3A] text-gray-700 hover:text-[#1B6B3A] text-[12px] font-extrabold uppercase tracking-widest px-10 py-4 rounded-full transition-all shadow-sm"
          >
            Voir tout le catalogue complet
          </Link>
        </div>

      </div>
    </section>
  )
}