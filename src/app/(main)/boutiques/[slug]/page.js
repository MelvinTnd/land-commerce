'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { getShopBySlug, getShopReviews } from '@/lib/api'
import { useCart } from '@/lib/CartContext'
import { getProductImage, getShopBannerImage, getStorageUrl } from '@/lib/images'
import SafeImage from '@/components/ui/SafeImage'

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
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="relative aspect-[4/5] bg-[#F7F7F7] overflow-hidden mb-3">
        <Image
          src={getProductImage({ image: p.image, slug: p.slug, categorie: p.category?.name })}
          alt={p.name} fill
          className="object-cover transition-transform duration-[800ms]"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2 py-1 bg-[#008060] text-white text-[10px] font-bold uppercase tracking-wider">Sale</span>
          )}
        </div>
        {/* Quick add */}
        <div className={`absolute bottom-0 left-0 right-0 p-2 transform transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 lg:hidden'}`}>
          <button
              onClick={handleAdd}
              disabled={p.stock === 0}
              className="w-full bg-white text-black py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors border border-gray-200"
          >
            {p.stock === 0 ? 'Sold Out' : added ? 'Ajouté' : 'Ajouter rapide'}
          </button>
        </div>
      </div>
      
      {/* Content under image */}
      <div>
        <p className="font-bold text-[10px] uppercase tracking-widest text-[#6B7280] mb-0.5">{p.category?.name || 'Artisanat'}</p>
        <p className="font-medium text-[14px] text-gray-900 leading-snug mb-1 truncate">{p.name}</p>
        <div className="flex items-center gap-2">
          {p.promo_price ? (
            <>
              <span className="font-semibold text-gray-900">{finalPrice.toLocaleString('fr-FR')} CFA</span>
              <span className="text-gray-400 line-through text-xs">{parseFloat(p.price).toLocaleString('fr-FR')} CFA</span>
            </>
          ) : (
            <span className="font-semibold text-gray-900">{finalPrice.toLocaleString('fr-FR')} CFA</span>
          )}
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
      getShopReviews(slug).catch(() => null)
    ]).then(([shopData, reviewsData]) => {
      setShop(shopData)
      // L'API retourne { reviews: [], avg_rating, total_reviews } ou null
      if (reviewsData && reviewsData.reviews) {
        setReviews(reviewsData.reviews)
      } else if (Array.isArray(reviewsData)) {
        setReviews(reviewsData)
      } else {
        setReviews([])
      }
      setLoading(false)
    }).catch(() => { setError(true); setLoading(false) })
  }, [slug])

  if (loading) return (
    <div className="flex items-center justify-center" style={{ minHeight: '80vh', background: '#F7F5F0' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#008060', borderTopColor: 'transparent' }} />
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
        style={{ background: '#008060' }}>
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
      <div className="relative w-full h-[40vh] min-h-[300px] flex flex-col justify-center items-center text-center p-4 overflow-hidden" style={{ background: '#0D0D0D' }}>
        <Image
          src={bannerSrc}
          alt={`Bannière ${shop.name}`}
          fill className="object-cover opacity-60 mix-blend-overlay"
          priority sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40" />

        <Link href="/boutiques"
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[12px] text-white transition-all hover:bg-white/20"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Boutiques
        </Link>
        
        <div className="relative z-10 flex flex-col items-center mt-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mb-5 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
            <SafeImage src={logoSrc} name={shop.name} alt={shop.name} fill className="object-cover" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            {shop.name}
          </h1>
          <div className="flex items-center gap-4 text-xs font-bold text-white/90 uppercase tracking-widest mb-6">
            {shop.location && <span>{shop.location}</span>}
            {avgRating && <span>• {avgRating} ({shop.total_reviews || reviews.length} avis)</span>}
          </div>
          <Link href={contactUrl} className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">
            Contacter le vendeur
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* BARRE DE NAVIGATION STICKY (onglets)                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="sticky top-[72px] z-20 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-center items-center gap-8">
            {[
              { key: 'produits', label: 'Produits', count: products.length },
              { key: 'avis', label: 'Avis', count: reviews.length },
              { key: 'apropos', label: 'À propos', count: null },
            ].map(tab => (
              <button key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-5 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.key ? 'text-[#0D0D0D]' : 'text-gray-400 hover:text-gray-900'}`}>
                {tab.label}
                {tab.count !== null && tab.count > 0 && <span className="ml-1.5 text-[10px]">({tab.count})</span>}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
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
                      ? { background: '#008060', color: 'white' }
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
                    style={{ color: '#008060', background: '#E6F8EA' }}>
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
                  style={{ background: '#008060' }}>
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
                  <span className="material-symbols-outlined text-[16px]" style={{ color: '#008060' }}>storefront</span>
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
                      <span className="material-symbols-outlined text-[17px]" style={{ color: '#008060' }}>{item.icon}</span>
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
              style={{ background: 'linear-gradient(135deg, #008060 0%, #0D4A28 100%)' }}>
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
