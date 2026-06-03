'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getShopReviews, getVendorDashboard } from '@/lib/api'

function StarRating({ rating = 0, size = 14 }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
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

export default function ReviewsTab({ token }) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [shopSlug, setShopSlug] = useState(null)

  const tok = token || session?.user?.apiToken

  useEffect(() => {
    if (!tok) return
    // D'abord récupérer le slug de la boutique du vendeur
    getVendorDashboard(tok)
      .then(data => {
        const slug = data?.shop?.slug
        setShopSlug(slug)
        if (slug) {
          return getShopReviews(slug)
        }
        return null
      })
      .then(data => {
        // L'API retourne { reviews: [], avg_rating, total_reviews } ou null
        if (data && data.reviews) {
          setReviews(data.reviews)
        } else if (Array.isArray(data)) {
          setReviews(data)
        } else {
          setReviews([])
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [tok]) // eslint-disable-line react-hooks/exhaustive-deps

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (parseFloat(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : null

  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(parseFloat(r.rating)) === star).length,
    pct: reviews.length > 0
      ? Math.round((reviews.filter(r => Math.round(parseFloat(r.rating)) === star).length / reviews.length) * 100)
      : 0
  }))

  if (loading) return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-[24px] p-5 animate-pulse" style={{ border: '1px solid #EBEBEB' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
            <div className="flex-1">
              <div className="h-3 bg-gray-100 rounded mb-2 w-1/3" />
              <div className="h-2 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded w-full mb-2" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-5">

      {/* Récap note globale */}
      {avgRating ? (
        <div className="bg-white rounded-[24px] p-6 flex flex-col sm:flex-row items-center gap-6"
          style={{ border: '1px solid #EBEBEB' }}>
          <div className="text-center shrink-0">
            <p className="text-[52px] font-black leading-none" style={{ color: '#111827' }}>{avgRating}</p>
            <StarRating rating={parseFloat(avgRating)} size={18} />
            <p className="text-[11px] font-bold mt-1.5" style={{ color: '#9CA3AF' }}>
              {reviews.length} avis client{reviews.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex-1 w-full">
            {ratingDist.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3 mb-2.5">
                <span className="text-[11px] font-bold w-3 text-right" style={{ color: '#6B7280' }}>{star}</span>
                <span className="material-symbols-outlined text-[11px]"
                  style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>star</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: '#F59E0B' }} />
                </div>
                <span className="text-[10px] font-bold w-5" style={{ color: '#9CA3AF' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Liste des avis */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-[28px] p-16 flex flex-col items-center text-center"
          style={{ border: '1px dashed #E5E7EB' }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: '#FEF3C7' }}>
            <span className="material-symbols-outlined text-[40px]" style={{ color: '#D4920A' }}>star</span>
          </div>
          <h3 className="font-black text-[18px] mb-2" style={{ color: '#0D0D0D' }}>
            Pas encore d&apos;avis
          </h3>
          <p className="text-[13px] max-w-xs leading-relaxed" style={{ color: '#9CA3AF' }}>
            Les avis de vos clients apparaîtront ici dès qu&apos;ils auront évalué vos produits ou votre boutique.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r, i) => {
            const initials = (r.user?.name || 'C').slice(0, 2).toUpperCase()
            const rating = parseFloat(r.rating) || 0
            return (
              <div key={r.id || i} className="bg-white rounded-[20px] p-5 transition-all hover:shadow-md"
                style={{ border: '1px solid #EBEBEB' }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-[13px] text-white"
                      style={{ background: '#1B6B3A' }}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-black text-[13px]" style={{ color: '#111827' }}>
                        {r.user?.name || 'Client anonyme'}
                      </p>
                      <p className="text-[10px] font-medium" style={{ color: '#9CA3AF' }}>
                        {r.created_at
                          ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                          : ''}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={rating} size={13} />
                </div>
                {r.comment && (
                  <p className="text-[13px] leading-relaxed px-1" style={{ color: '#374151' }}>
                    &ldquo;{r.comment}&rdquo;
                  </p>
                )}
                {r.product && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[13px]" style={{ color: '#9CA3AF' }}>inventory_2</span>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                      Produit : <span style={{ color: '#1B6B3A' }}>{r.product?.name || r.product}</span>
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
