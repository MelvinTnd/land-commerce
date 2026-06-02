'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import DetailGalerie from '@/components/produits/detail/DetailGalerie'
import DetailInfos from '@/components/produits/detail/DetailInfos'
import DetailVendeur from '@/components/produits/detail/DetailVendeur'
import DetailSimilaires from '@/components/produits/detail/DetailSimilaires'
import DetailCommentaires from '@/components/produits/detail/DetailCommentaires'
import { getProduct } from '@/lib/api'

export default function DetailProduitPage() {
  const params = useParams()
  const { id } = params
  const { data: session } = useSession()
  const [produit, setProduit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareCopied, setShareCopied] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [contactMsg, setContactMsg] = useState('')
  const [contactSent, setContactSent] = useState(false)

  useEffect(() => {
    getProduct(id)
      .then(data => {
        setProduit(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id])

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      navigator.share({ title: produit?.name || 'Produit Blackmaket', url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2500)
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const fallbackProduit = {
    id: id,
    name: 'Statue Royale d\'Abomey',
    price: 45000,
    description: 'Sculpture en bois d\'Ébène précieux, forgée par le Maître Kodjo selon les techniques ancestrales du Dahomey.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
    shop: { name: 'Atelier Kanvô', location: 'Abomey, Bénin', slug: 'atelier-kanvo' },
    category: { name: 'Artisanat' },
    avg_rating: 4.8,
    total_reviews: 142,
    stock: 2
  }

  const p = produit || fallbackProduit

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Breadcrumb + actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs" style={{ color: '#9CA3AF' }}>
            <Link href="/" className="hover:text-green-800 transition-colors">Accueil</Link>
            <span>›</span>
            <Link href="/produits" className="hover:text-green-800 transition-colors">{p.category?.name || 'Artisanat'}</Link>
            <span>›</span>
            <span style={{ color: '#1A1A1A', fontWeight: '600' }} className="line-clamp-1 max-w-[200px]">{p.name}</span>
          </div>

          {/* Boutons action */}
          <div className="flex items-center gap-2">
            {/* Bouton Contacter le vendeur */}
            {p.shop?.slug && (
              <button
                onClick={() => setShowContact(v => !v)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all hover:shadow-md"
                style={{
                  background: showContact ? '#1B6B3A' : 'white',
                  color: showContact ? 'white' : '#1B6B3A',
                  border: '1.5px solid #1B6B3A',
                }}
              >
                <span className="material-symbols-outlined text-[15px]">chat</span>
                Contacter le vendeur
              </button>
            )}

            {/* Bouton Partager */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all hover:shadow-md"
              style={{ background: 'white', color: '#6B7280', border: '1.5px solid #E5E7EB' }}
            >
              <span className="material-symbols-outlined text-[15px]">{shareCopied ? 'check' : 'share'}</span>
              {shareCopied ? 'Lien copié !' : 'Partager'}
            </button>
          </div>
        </div>

        {/* Panneau contact */}
        {showContact && (
          <div className="mt-4 bg-white rounded-[24px] p-6" style={{ border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#E6F8EA' }}>
                <span className="material-symbols-outlined text-[20px]" style={{ color: '#1B6B3A' }}>forum</span>
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Contacter {p.shop?.name}</h3>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Le vendeur vous répondra dans les meilleurs délais</p>
              </div>
              <button onClick={() => setShowContact(false)} className="ml-auto w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-[16px]" style={{ color: '#9CA3AF' }}>close</span>
              </button>
            </div>

            {!session?.user ? (
              <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Connectez-vous pour envoyer un message</p>
                <Link href="/connexion" className="inline-flex items-center gap-2 bg-[#1B6B3A] text-white font-bold text-xs px-6 py-2.5 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">login</span> Se connecter
                </Link>
              </div>
            ) : contactSent ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <span className="material-symbols-outlined text-[28px]" style={{ color: '#1B6B3A' }}>check_circle</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Message envoyé avec succès !</p>
                  <Link href="/messages" className="text-xs font-bold" style={{ color: '#1B6B3A' }}>Voir mes messages →</Link>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={contactMsg}
                  onChange={e => setContactMsg(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && contactMsg.trim()) {
                      import('@/lib/api').then(({ sendMessage }) => {
                        sendMessage(p.shop.id, contactMsg.trim(), session?.user?.apiToken);
                        setContactSent(true);
                        setContactMsg('');
                      }).catch(err => alert(err.message));
                    }
                  }}
                  placeholder={`Bonjour ${p.shop?.name || ''}, je m'intéresse à votre produit "${p.name}"...`}
                  className="flex-1 px-5 py-3.5 rounded-2xl text-sm font-medium outline-none transition-colors"
                  style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }}
                  onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <button
                  disabled={!contactMsg.trim()}
                  onClick={() => {
                    import('@/lib/api').then(({ sendMessage }) => {
                      sendMessage(p.shop.id, contactMsg.trim(), session?.user?.apiToken);
                      setContactSent(true);
                      setContactMsg('');
                    }).catch(err => alert(err.message));
                  }}
                  className="bg-[#1B6B3A] hover:bg-[#134e29] text-white font-bold text-sm px-6 py-3.5 rounded-2xl whitespace-nowrap disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[17px]">send</span>
                  Envoyer
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hero — galerie + infos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <DetailGalerie produit={p} />
          <DetailInfos produit={p} />
        </div>
      </div>

      {/* Vendeur + fiche technique */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
        <DetailVendeur shop={p.shop} rating={p.avg_rating} reviews={p.total_reviews} />
      </div>

      {/* Section Commentaires */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pb-12">
        <DetailCommentaires
          produitId={p.id}
          avgRating={parseFloat(p.avg_rating) || 4.8}
          totalReviews={parseInt(p.total_reviews) || 0}
        />
      </div>

      {/* Similaires */}
      <DetailSimilaires categoryId={p.category?.id} />

    </div>
  )
}