'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getShopBySlug } from '@/lib/api'
import { useCart } from '@/lib/CartContext'
import { getProductImage } from '@/lib/images'

export default function BoutiqueDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { ajouterAuPanier } = useCart()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getShopBySlug(slug)
      .then(data => { setShop(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="w-10 h-10 border-4 border-t-[#1B6B3A] border-[#E6F8EA] rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight: '60vh' }}>
        <span className="material-symbols-outlined text-[64px]" style={{ color: '#E5E7EB' }}>storefront</span>
        <p className="font-black text-lg" style={{ color: '#374151' }}>Boutique introuvable</p>
        <Link href="/boutiques"
          className="px-5 py-2.5 rounded-xl font-black text-sm text-white"
          style={{ background: '#1B6B3A' }}>
          ← Voir toutes les boutiques
        </Link>
      </div>
    )
  }

  const products = shop.products || []
  const logoSrc = shop.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=1B6B3A&color=fff&size=200`

  return (
    <div style={{ background: '#F3F4F6', minHeight: '80vh' }}>

      {/* ─── Bannière boutique ─── */}
      <div className="relative" style={{ height: 220, background: 'linear-gradient(135deg, #1B6B3A 0%, #0D4A28 100%)' }}>
        {shop.banner && (
          <Image src={shop.banner} alt="Bannière" fill className="object-cover opacity-30" unoptimized />
        )}
        <div className="absolute inset-0 flex items-end pb-0">
          <div className="max-w-5xl mx-auto px-6 w-full">
            <div className="flex items-end gap-5 translate-y-12">
              <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0"
                style={{ border: '4px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                <Image src={logoSrc} alt={shop.name} fill className="object-cover" unoptimized />
              </div>
              <div className="pb-2">
                <h1 className="text-2xl font-black text-white">{shop.name}</h1>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  📍 {shop.location || 'Bénin'}
                  {shop.status === 'active' && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black"
                      style={{ background: '#D4920A', color: '#fff' }}>VÉRIFIÉ</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Contenu ─── */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">

        {/* Description + retour */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start mb-8">
          <p className="text-sm max-w-lg" style={{ color: '#6B7280' }}>
            {shop.description || 'Une boutique artisanale du Bénin.'}
          </p>
          <Link href="/boutiques"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[12px] shrink-0"
            style={{ background: '#fff', color: '#1B6B3A', border: '1px solid #E5E7EB' }}>
            ← Toutes les boutiques
          </Link>
        </div>

        {/* Produits */}
        <h2 className="font-black text-lg mb-5" style={{ color: '#111827' }}>
          Produits ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 flex flex-col items-center"
            style={{ border: '1px solid #EAEAEA' }}>
            <span className="material-symbols-outlined text-[48px] mb-3" style={{ color: '#E5E7EB' }}>inventory_2</span>
            <p className="font-bold" style={{ color: '#9CA3AF' }}>Aucun produit disponible pour l'instant</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <Link key={p.id} href={`/produits/${p.slug || p.id}`}
                className="group bg-white rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
                style={{ border: '1px solid #EAEAEA' }}>
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={getProductImage({ image: p.image, slug: p.slug, categorie: p.category?.name })}
                    alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw" unoptimized
                  />
                  {p.is_featured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black text-white"
                      style={{ background: '#D4920A' }}>À la une</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-bold text-[13px] truncate mb-1" style={{ color: '#111827' }}>{p.name}</p>
                  <p className="font-black text-[14px]" style={{ color: '#1B6B3A' }}>
                    {parseFloat(p.price).toLocaleString('fr-FR')} CFA
                  </p>
                  <button
                    onClick={e => { e.preventDefault(); ajouterAuPanier({ id: p.id, nom: p.name, prix: parseFloat(p.price), image: getProductImage({ image: p.image, slug: p.slug }) }) }}
                    className="mt-2 w-full py-1.5 rounded-lg text-[11px] font-black text-white transition-all hover:opacity-85"
                    style={{ background: '#1B6B3A' }}>
                    Ajouter au panier
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
