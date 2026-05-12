'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getEligibleShops, submitReview } from '@/lib/api'

export default function ReviewsSection() {
  const { data: session } = useSession()
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeShop, setActiveShop] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState({}) // { shopId: true }

  useEffect(() => {
    if (!session?.user?.apiToken) return
    setLoading(true)
    getEligibleShops(session.user.apiToken)
      .then(data => setShops(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session])

  const handleSubmit = async (shopId, orderId) => {
    if (rating === 0 || submitting) return
    setSubmitting(true)
    try {
      await submitReview(
        { shop_id: shopId, rating, comment, order_id: orderId },
        session.user.apiToken
      )
      setSubmitted(prev => ({ ...prev, [shopId]: true }))
      setActiveShop(null)
      setRating(0)
      setComment('')
      // Mettre à jour la liste localement
      setShops(prev => prev.map(s =>
        s.shop_id === shopId ? { ...s, already_reviewed: true } : s
      ))
    } catch (err) {
      alert(err.message || 'Erreur lors de l\'envoi')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pendingShops = shops.filter(s => !s.already_reviewed)
  const reviewedShops = shops.filter(s => s.already_reviewed)

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-extrabold" style={{ color: '#1A1A1A' }}>Mes Avis</h2>

      {shops.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center" style={{ border: '1px solid #E5E7EB' }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#F7F5F0' }}>
            <span className="material-symbols-outlined text-3xl" style={{ color: '#9CA3AF' }}>star</span>
          </div>
          <p className="text-sm font-bold mb-1" style={{ color: '#374151' }}>Aucun avis à laisser</p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            Vous pourrez laisser un avis après réception d'une commande
          </p>
        </div>
      ) : (
        <>
          {/* Boutiques en attente d'avis */}
          {pendingShops.length > 0 && (
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                À évaluer ({pendingShops.length})
              </p>
              <div className="flex flex-col gap-4">
                {pendingShops.map(shop => (
                  <div key={shop.shop_id} className="bg-white rounded-2xl overflow-hidden" style={{ border: '2px solid #1B6B3A' }}>
                    {/* En-tête boutique */}
                    <div className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#E6F8EA] flex items-center justify-center font-black text-[#1B6B3A] text-lg">
                          {shop.shop_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>{shop.shop_name}</p>
                          <p className="text-xs" style={{ color: '#9CA3AF' }}>Commande #{shop.order_reference}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveShop(activeShop === shop.shop_id ? null : shop.shop_id)}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                        style={{ background: '#1B6B3A' }}
                      >
                        {activeShop === shop.shop_id ? 'Annuler' : 'Laisser un avis'}
                      </button>
                    </div>

                    {/* Formulaire avis */}
                    {activeShop === shop.shop_id && (
                      <div className="px-6 pb-6 pt-2" style={{ borderTop: '1px solid #F0FDF4' }}>
                        {/* Étoiles */}
                        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                          Note globale
                        </p>
                        <div className="flex items-center gap-2 mb-5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="transition-transform hover:scale-110"
                            >
                              <span
                                className="material-symbols-outlined text-[32px]"
                                style={{ color: star <= (hoverRating || rating) ? '#F59E0B' : '#E5E7EB' }}
                              >
                                {star <= (hoverRating || rating) ? 'star' : 'star_outline'}
                              </span>
                            </button>
                          ))}
                          {rating > 0 && (
                            <span className="text-sm font-bold ml-2" style={{ color: '#374151' }}>
                              {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent !'][rating]}
                            </span>
                          )}
                        </div>

                        {/* Commentaire */}
                        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
                          Commentaire (facultatif)
                        </p>
                        <textarea
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          rows={3}
                          placeholder="Partagez votre expérience avec cette boutique..."
                          className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none mb-4"
                          style={{ background: '#F7F5F0', border: '2px solid #E5E7EB', color: '#1A1A1A' }}
                        />

                        <button
                          disabled={rating === 0 || submitting}
                          onClick={() => handleSubmit(shop.shop_id, shop.order_id)}
                          className="px-8 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all"
                          style={{ background: '#1B6B3A' }}
                        >
                          {submitting ? 'Envoi en cours...' : 'Publier mon avis'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutiques déjà évaluées */}
          {reviewedShops.length > 0 && (
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                Déjà évalué ({reviewedShops.length})
              </p>
              <div className="flex flex-col gap-3">
                {reviewedShops.map(shop => (
                  <div key={shop.shop_id} className="bg-white rounded-2xl flex items-center gap-4 px-6 py-4" style={{ border: '1px solid #E5E7EB' }}>
                    <div className="w-10 h-10 rounded-xl bg-[#F9FAF8] flex items-center justify-center font-bold text-gray-400">
                      {shop.shop_name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{shop.shop_name}</p>
                    </div>
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: '#F0FDF4', color: '#1B6B3A' }}>
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Évalué
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
