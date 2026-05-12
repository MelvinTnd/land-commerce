'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { getShopBySlug } from '@/lib/api'
import { useCart } from '@/lib/CartContext'
import { getProductImage, getShopBannerImage } from '@/lib/images'

export default function BoutiqueDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
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
  const logoSrc = shop.logo
    ? shop.logo
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=1B6B3A&color=fff&size=200`
  const bannerSrc = shop.banner || getShopBannerImage(shop)
  const contactUrl = session?.user
    ? `/messages?shop=${shop.slug}&vendeur=${shop.user_id}`
    : '/connexion'

  return (
    <div style={{ background: '#F3F4F6', minHeight: '80vh' }}>

      {/* ── Bannière boutique ── */}
      <div className="relative" style={{ height: 280 }}>
        <Image src={bannerSrc} alt={`Bannière ${shop.name}`} fill className="object-cover" priority sizes="100vw" />
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)' }} />
        {/* Bouton retour */}
        <Link href="/boutiques"
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[12px] text-white transition-all hover:bg-black/20"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}>
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Retour aux boutiques
        </Link>
        {/* Infos bas de bannière */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-0">
          <div className="max-w-5xl mx-auto flex items-end gap-5 translate-y-12">
            <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0"
              style={{ border: '4px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <Image src={logoSrc} alt={shop.name} fill className="object-cover" unoptimized />
            </div>
            <div className="pb-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-white">{shop.name}</h1>
                {shop.status === 'active' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black"
                    style={{ background: '#1B6B3A', color: '#fff' }}>
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    VENDEUR VÉRIFIÉ
                  </span>
                )}
              </div>
              <p className="text-sm flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {shop.location || 'Bénin'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Contenu ─── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-20 pb-16">

        {/* Cards info boutique */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Stat produits */}
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white" style={{ border: '1px solid #EBEBEB' }}>
            <span className="material-symbols-outlined text-[20px]" style={{ color: '#1B6B3A' }}>inventory_2</span>
            <div>
              <p className="font-black text-[16px]" style={{ color: '#0D0D0D' }}>{products.length}</p>
              <p className="text-[10px] font-bold uppercase" style={{ color: '#9CA3AF' }}>Articles</p>
            </div>
          </div>
          {/* Stat note */}
          {shop.avg_rating > 0 && (
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white" style={{ border: '1px solid #EBEBEB' }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: '#D4920A', fontVariationSettings: "'FILL' 1" }}>star</span>
              <div>
                <p className="font-black text-[16px]" style={{ color: '#0D0D0D' }}>{parseFloat(shop.avg_rating).toFixed(1)}</p>
                <p className="text-[10px] font-bold uppercase" style={{ color: '#9CA3AF' }}>{shop.total_reviews || 0} avis</p>
              </div>
            </div>
          )}
          {/* Bouton contacter */}
          <Link href={contactUrl}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-[13px] text-white transition-all hover:-translate-y-0.5 hover:shadow-lg ml-auto"
            style={{ background: '#1B6B3A' }}>
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Contacter le vendeur
          </Link>
        </div>

        {/* Description */}
        {shop.description && (
          <div className="p-5 rounded-2xl bg-white mb-8" style={{ border: '1px solid #EBEBEB' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[16px]" style={{ color: '#1B6B3A' }}>info</span>
              <span className="font-black text-[12px] uppercase tracking-wider" style={{ color: '#9CA3AF' }}>À propos</span>
            </div>
            <p className="text-[14px] leading-relaxed" style={{ color: '#374151' }}>{shop.description}</p>
          </div>
        )}

        {/* Titre produits */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-[18px]" style={{ color: '#111827' }}>
            Produits <span style={{ color: '#9CA3AF', fontWeight: 600 }}>({products.length})</span>
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 flex flex-col items-center" style={{ border: '1px solid #EAEAEA' }}>
            <span className="material-symbols-outlined text-[48px] mb-3" style={{ color: '#E5E7EB' }}>inventory_2</span>
            <p className="font-bold" style={{ color: '#9CA3AF' }}>Aucun produit disponible pour le moment</p>
            <p className="text-[12px] mt-1" style={{ color: '#D1D5DB' }}>Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <Link key={p.id} href={`/produits/${p.slug || p.id}`}
                className="group bg-white rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                style={{ border: '1px solid #EBEBEB' }}>
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <Image
                    src={getProductImage({ image: p.image, slug: p.slug, categorie: p.category?.name })}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {p.is_featured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black text-white"
                      style={{ background: '#D4920A' }}>⭐ À la une</span>
                  )}
                  {p.promo_price && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black text-white"
                      style={{ background: '#EF4444' }}>-{Math.round((1 - p.promo_price / p.price) * 100)}%</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-bold text-[13px] truncate mb-1" style={{ color: '#111827' }}>{p.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-[14px]" style={{ color: '#1B6B3A' }}>
                      {parseFloat(p.promo_price || p.price).toLocaleString('fr-FR')} CFA
                    </p>
                    {p.promo_price && (
                      <p className="text-[11px] line-through" style={{ color: '#9CA3AF' }}>
                        {parseFloat(p.price).toLocaleString('fr-FR')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={e => {
                      e.preventDefault()
                      ajouterAuPanier({
                        id: p.id,
                        nom: p.name,
                        prix: parseFloat(p.promo_price || p.price),
                        image: getProductImage({ image: p.image, slug: p.slug })
                      })
                    }}
                    className="mt-2 w-full py-2 rounded-xl text-[11px] font-black text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: '#1B6B3A' }}>
                    + Ajouter au panier
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
