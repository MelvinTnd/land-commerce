'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { getShopBySlug, getShopReviews } from '@/lib/api'
import { useCart } from '@/lib/CartContext'
import { getProductImage, getShopBannerImage, getStorageUrl } from '@/lib/images'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StarRating({ rating = 0, max = 5, size = 14 }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i}
          className="material-symbols-outlined"
          style={{
            fontSize: size,
            color: i < Math.round(rating) ? '#F59E0B' : '#E5E7EB',
            fontVariationSettings: i < Math.round(rating) ? "'FILL' 1" : "'FILL' 0"
          }}>star</span>
      ))}
    </span>
  )
}

function ProductCard({ p, onAddToCart }) {
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)
  const discount = p.promo_price
    ? Math.round((1 - p.promo_price / p.price) * 100)
    : 0
  const finalPrice = parseFloat(p.promo_price || p.price)

  const handleAdd = (e) => {
    e.preventDefault()
    onAddToCart(p)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Link href={`/produits/${p.slug || p.id}`}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="bg-white rounded-[20px] overflow-hidden transition-all duration-300"
        style={{
          border: '1px solid #F0F0F0',
          boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}>

        {/* Image */}
        <div className="relative overflow-hidden" style={{ paddingBottom: '100%' }}>
          <Image
            src={getProductImage({ image: p.image, slug: p.slug, categorie: p.category?.name })}
            alt={p.name} fill
            className="object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {p.is_featured && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-white"
                style={{ background: 'linear-gradient(135deg,#D4920A,#F59E0B)' }}>⭐ À la une</span>
            )}
            {discount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black text-white"
                style={{ background: '#EF4444' }}>-{discount}%</span>
            )}
          </div>
          {/* Stock badge */}
          {p.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="px-3 py-1 rounded-full text-xs font-black text-white"
                style={{ background: 'rgba(0,0,0,0.7)' }}>Épuisé</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5">
          <p className="font-bold text-[12px] truncate mb-0.5" style={{ color: '#374151' }}>
            {p.category?.name || ''}
          </p>
          <p className="font-black text-[14px] truncate mb-2" style={{ color: '#0D0D0D' }}>
            {p.name}
          </p>
          {p.avg_rating > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <StarRating rating={p.avg_rating} size={11} />
              <span className="text-[10px] font-bold" style={{ color: '#9CA3AF' }}>
                ({p.avg_rating?.toFixed(1)})
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="font-black text-[15px]" style={{ color: '#1B6B3A' }}>
                {finalPrice.toLocaleString('fr-FR')} <span className="text-[10px] font-bold">CFA</span>
              </p>
              {p.promo_price && (
                <p className="text-[10px] line-through" style={{ color: '#C4C4C4' }}>
                  {parseFloat(p.price).toLocaleString('fr-FR')} CFA
                </p>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={p.stock === 0}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
              style={{
                background: added ? '#059669' : '#1B6B3A',
                opacity: p.stock === 0 ? 0.4 : 1,
              }}>
              <span className="material-symbols-outlined text-white text-[16px]">
                {added ? 'check' : 'add_shopping_cart'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BoutiqueDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { ajouterAuPanier } = useCart()
  const [shop, setShop] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState('produits')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCat, setFilterCat] = useState('tous')
  const headerRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    Promise.all([
      getShopBySlug(slug),
      getShopReviews(slug).catch(() => [])
    ]).then(([shopData, reviewsData]) => {
      setShop(shopData)
      setReviews(Array.isArray(reviewsData) ? reviewsData : [])
      setLoading(false)
    }).catch(() => { setError(true); setLoading(false) })
  }, [slug])

  if (loading) return (
    <div className="flex items-center justify-center" style={{ minHeight: '80vh', background: '#F7F5F0' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#1B6B3A', borderTopColor: 'transparent' }} />
        <p className="text-sm font-bold" style={{ color: '#9CA3AF' }}>Chargement de la boutique…</p>
      </div>
    </div>
  )

  if (error || !shop) return (
    <div className="flex flex-col items-center justify-center gap-5 px-4" style={{ minHeight: '80vh', background: '#F7F5F0' }}>
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: '#FEF2F2' }}>
        <span className="material-symbols-outlined text-[40px]" style={{ color: '#EF4444' }}>storefront</span>
      </div>
      <div className="text-center">
        <p className="font-black text-xl mb-2" style={{ color: '#111827' }}>Boutique introuvable</p>
        <p className="text-sm" style={{ color: '#9CA3AF' }}>Cette boutique n&apos;existe pas ou a été supprimée.</p>
      </div>
      <Link href="/boutiques"
        className="px-6 py-3 rounded-2xl font-black text-sm text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
        style={{ background: '#1B6B3A' }}>
        ← Voir toutes les boutiques
      </Link>
    </div>
  )

  const products = shop.products || []
  const logoSrc = shop.logo
    ? getStorageUrl(shop.logo)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=1B6B3A&color=fff&size=200`
  const bannerSrc = getStorageUrl(shop.banner) || getShopBannerImage(shop)
  const contactUrl = session?.user
    ? `/messages?shop=${shop.slug}&vendeur=${shop.user_id}`
    : '/connexion'

  // Catégories disponibles
  const categories = ['tous', ...new Set(products.map(p => p.category?.name).filter(Boolean))]

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = filterCat === 'tous' || p.category?.name === filterCat
    return matchSearch && matchCat
  })

  const avgRating = shop.avg_rating
    ? parseFloat(shop.avg_rating).toFixed(1)
    : (reviews.length > 0
      ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null)

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════════════════════ */}
      {/* HERO — Bannière + Profil du vendeur                   */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="relative" style={{ background: '#0D0D0D' }}>

        {/* Bannière */}
        <div className="relative w-full" style={{ height: 320 }}>
          <Image
            src={bannerSrc}
            alt={`Bannière ${shop.name}`}
            fill className="object-cover"
            priority sizes="100vw"
            unoptimized
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.92) 100%)' }} />

          {/* Bouton retour */}
          <Link href="/boutiques"
            className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[12px] text-white transition-all hover:bg-white/20"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Boutiques
          </Link>
        </div>

        {/* ─── Profil du vendeur (dans le hero, sans débordement) ─── */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">

              {/* Logo */}
              <div className="relative shrink-0"
                style={{
                  width: 96, height: 96,
                  borderRadius: 22,
                  border: '3px solid rgba(255,255,255,0.9)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  background: '#fff',
                  overflow: 'hidden',
                }}>
                <Image src={logoSrc} alt={shop.name} fill className="object-cover" unoptimized />
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-[24px] sm:text-[28px] font-black text-white leading-tight">
                    {shop.name}
                  </h1>
                  {shop.status === 'active' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black"
                      style={{ background: 'rgba(27,107,58,0.85)', color: '#A7F3D0', border: '1px solid rgba(167,243,208,0.3)' }}>
                      <span className="material-symbols-outlined text-[10px]">verified</span>
                      VÉRIFIÉ
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {shop.location && (
                    <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {shop.location}
                    </span>
                  )}
                  {avgRating && (
                    <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <span className="material-symbols-outlined text-[13px]" style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>star</span>
                      {avgRating} ({shop.total_reviews || reviews.length} avis)
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <span className="material-symbols-outlined text-[13px]">inventory_2</span>
                    {products.length} article{products.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* CTA contacter */}
              <div className="shrink-0">
                <Link href={contactUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[13px] text-white transition-all hover:shadow-xl hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#1B6B3A,#145530)', boxShadow: '0 4px 16px rgba(27,107,58,0.4)' }}>
                  <span className="material-symbols-outlined text-[17px]">chat_bubble</span>
                  Contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* BARRE DE NAVIGATION STICKY (onglets)                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="sticky top-[72px] z-20 bg-white" style={{ borderBottom: '1px solid #EBEBEB', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-1">
            {[
              { key: 'produits', label: 'Produits', icon: 'inventory_2', count: products.length },
              { key: 'avis', label: 'Avis', icon: 'star', count: reviews.length },
              { key: 'apropos', label: 'À propos', icon: 'info', count: null },
            ].map(tab => (
              <button key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-5 py-4 text-[13px] font-bold transition-all relative"
                style={{ color: activeTab === tab.key ? '#1B6B3A' : '#6B7280' }}>
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                    style={{ background: activeTab === tab.key ? '#E6F8EA' : '#F3F4F6', color: activeTab === tab.key ? '#1B6B3A' : '#9CA3AF' }}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: '#1B6B3A' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CONTENU PRINCIPAL                                      */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 py-7 pb-16">

        {/* ── ONGLET PRODUITS ── */}
        {activeTab === 'produits' && (
          <div className="flex flex-col gap-6">

            {/* Barre de recherche + filtres catégorie */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: '#C4C4C4' }}>search</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un produit…"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-[13px] font-medium outline-none bg-white"
                  style={{ border: '1.5px solid #EBEBEB' }}
                />
              </div>
            </div>

            {/* Filtres catégorie */}
            {categories.length > 2 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {categories.map(cat => (
                  <button key={cat}
                    onClick={() => setFilterCat(cat)}
                    className="shrink-0 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all capitalize"
                    style={filterCat === cat
                      ? { background: '#1B6B3A', color: 'white' }
                      : { background: 'white', color: '#6B7280', border: '1.5px solid #EBEBEB' }}>
                    {cat === 'tous' ? 'Tous les produits' : cat}
                  </button>
                ))}
              </div>
            )}

            {/* Grille produits */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 flex flex-col items-center text-center" style={{ border: '1px solid #F0F0F0' }}>
                <span className="material-symbols-outlined text-[56px] mb-4" style={{ color: '#E5E7EB' }}>inventory_2</span>
                <p className="font-black text-base mb-1" style={{ color: '#374151' }}>
                  {searchTerm || filterCat !== 'tous' ? 'Aucun produit trouvé' : 'Aucun produit disponible'}
                </p>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>
                  {searchTerm ? 'Essayez un autre terme de recherche' : 'Revenez bientôt !'}
                </p>
                {(searchTerm || filterCat !== 'tous') && (
                  <button onClick={() => { setSearchTerm(''); setFilterCat('tous') }}
                    className="mt-4 px-5 py-2 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                    style={{ color: '#1B6B3A', background: '#E6F8EA' }}>
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="text-[12px] font-bold" style={{ color: '#9CA3AF' }}>
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                  {filterCat !== 'tous' ? ` · ${filterCat}` : ''}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(p => (
                    <ProductCard
                      key={p.id} p={p}
                      onAddToCart={p => ajouterAuPanier({
                        id: p.id,
                        nom: p.name,
                        prix: parseFloat(p.promo_price || p.price),
                        image: getProductImage({ image: p.image, slug: p.slug }),
                      })}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── ONGLET AVIS ── */}
        {activeTab === 'avis' && (
          <div className="flex flex-col gap-5">
            {/* Résumé note */}
            {avgRating && (
              <div className="bg-white rounded-[24px] p-6 flex flex-col sm:flex-row items-center gap-6"
                style={{ border: '1px solid #EBEBEB' }}>
                <div className="text-center shrink-0">
                  <p className="text-[56px] font-black leading-none" style={{ color: '#111827' }}>{avgRating}</p>
                  <StarRating rating={parseFloat(avgRating)} size={20} />
                  <p className="text-[11px] font-bold mt-1" style={{ color: '#9CA3AF' }}>
                    {reviews.length} avis clients
                  </p>
                </div>
                <div className="flex-1 w-full">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = reviews.filter(r => Math.round(r.rating) === star).length
                    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-3 mb-2">
                        <span className="text-[12px] font-bold w-4 text-right" style={{ color: '#6B7280' }}>{star}</span>
                        <span className="material-symbols-outlined text-[12px]" style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>star</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: '#F59E0B' }} />
                        </div>
                        <span className="text-[11px] font-bold w-6" style={{ color: '#9CA3AF' }}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Liste avis */}
            {reviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 flex flex-col items-center" style={{ border: '1px solid #F0F0F0' }}>
                <span className="material-symbols-outlined text-[48px] mb-3" style={{ color: '#E5E7EB' }}>star</span>
                <p className="font-bold" style={{ color: '#9CA3AF' }}>Aucun avis pour l&apos;instant</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((r, i) => (
                  <div key={r.id || i} className="bg-white rounded-[20px] p-5"
                    style={{ border: '1px solid #EBEBEB' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0"
                          style={{ background: '#F3F4F6' }}>
                          <Image
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || 'Client')}&background=1B6B3A&color=fff&size=80`}
                            alt={r.user?.name || 'Client'} fill className="object-cover" unoptimized />
                        </div>
                        <div>
                          <p className="font-bold text-[13px]" style={{ color: '#111827' }}>
                            {r.user?.name || 'Client anonyme'}
                          </p>
                          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>
                            {r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={r.rating} size={13} />
                    </div>
                    {r.comment && (
                      <p className="text-[13px] leading-relaxed" style={{ color: '#374151' }}>{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CTA laisser un avis */}
            {session?.user && (
              <div className="bg-white rounded-[20px] p-5 flex items-center justify-between"
                style={{ border: '1.5px dashed rgba(27,107,58,0.3)' }}>
                <div>
                  <p className="font-black text-[14px]" style={{ color: '#111827' }}>Laisser un avis</p>
                  <p className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>Partagez votre expérience avec cette boutique</p>
                </div>
                <Link href={`/compte?tab=avis`}
                  className="px-5 py-2.5 rounded-2xl font-black text-[12px] text-white transition-all hover:opacity-90"
                  style={{ background: '#1B6B3A' }}>
                  Évaluer
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── ONGLET À PROPOS ── */}
        {activeTab === 'apropos' && (
          <div className="flex flex-col gap-5">

            {/* Description */}
            <div className="bg-white rounded-[24px] p-6" style={{ border: '1px solid #EBEBEB' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#E6F8EA' }}>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: '#1B6B3A' }}>storefront</span>
                </div>
                <h2 className="font-black text-[16px]" style={{ color: '#111827' }}>À propos de {shop.name}</h2>
              </div>
              {shop.description ? (
                <p className="text-[14px] leading-relaxed" style={{ color: '#374151' }}>{shop.description}</p>
              ) : (
                <p className="text-[14px] italic" style={{ color: '#C4C4C4' }}>Aucune description renseignée.</p>
              )}
            </div>

            {/* Infos détaillées */}
            <div className="bg-white rounded-[24px] p-6" style={{ border: '1px solid #EBEBEB' }}>
              <h3 className="font-black text-[14px] mb-4" style={{ color: '#111827' }}>Informations</h3>
              <div className="flex flex-col gap-3">
                {[
                  { icon: 'location_on', label: 'Localisation', value: shop.location || 'Non renseigné' },
                  { icon: 'inventory_2', label: 'Nombre de produits', value: `${products.length} article${products.length > 1 ? 's' : ''}` },
                  { icon: 'star', label: 'Note moyenne', value: avgRating ? `${avgRating} / 5 (${reviews.length} avis)` : 'Pas encore d\'avis' },
                  { icon: 'verified', label: 'Statut', value: shop.status === 'active' ? 'Boutique vérifiée ✓' : 'En attente de vérification' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 py-3"
                    style={{ borderBottom: '1px solid #F9F9F9' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: '#F7F5F0' }}>
                      <span className="material-symbols-outlined text-[17px]" style={{ color: '#1B6B3A' }}>{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#C4C4C4' }}>{item.label}</p>
                      <p className="text-[13px] font-bold" style={{ color: '#374151' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA contacter */}
            <div className="rounded-[24px] p-6 text-white"
              style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #0D4A28 100%)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-[16px] mb-1">Vous avez une question ?</p>
                  <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Le vendeur vous répondra rapidement</p>
                </div>
                <Link href={contactUrl}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[13px] transition-all hover:bg-white/20"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                  Message
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
