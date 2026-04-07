'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import DetailGalerie from '@/components/produits/detail/DetailGalerie'
import DetailInfos from '@/components/produits/detail/DetailInfos'
import DetailVendeur from '@/components/produits/detail/DetailVendeur'
import DetailSimilaires from '@/components/produits/detail/DetailSimilaires'
import { getProduct } from '@/lib/api'

export default function DetailProduitPage() {
  const params = useParams()
  const { id } = params
  const [produit, setProduit] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dans notre API actuelle, on récupère par slug, mais pour s'adapter à l'existant, on passe le slug de l'URL.
    getProduct(id)
      .then(data => {
        setProduit(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">Chargement...</div>
  }

  // Si l'API renvoie une erreur mais qu'on veut garder un fallback mock
  const fallbackProduit = {
    id: id,
    name: 'Statue Royale d\'Abomey',
    price: 45000,
    description: 'Bois d\'Ébène précieux, sculpté par le Maître Kodjo.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQWt3NsHUOOcKgwDibsPPLilYMKO3ygaYWDdvHdsDg4LCV8TJwv0kSw5EGxRz7o_NoxtE39htKAzNOxFGDp8W7asYbM-Txolc1fRRmELgtKN-uGOi83rb0agNO706CIkerjUB4zKOMWpk7o6y6n1j30_lGgaxXcWLNJU38_Gf36l2xgHxgk9E65T8yx1xkIlN5pBnGaqj_mQWuEuzF-xXWpPd6aBEsJh6a-N9i44F-1H2mNrddeHLM_TUvy7dHjVida3nsiXz3e9E',
    shop: { name: 'Atelier Kanvô', location: 'Abomey, Bénin', slug: 'atelier-kanvo' },
    category: { name: 'Artisanat' },
    avg_rating: 4.8,
    total_reviews: 142,
    stock: 2
  }

  const p = produit || fallbackProduit

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-10 py-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#9CA3AF' }}>
          <Link href="/" className="hover:text-green-800 transition-colors">Accueil</Link>
          <span>›</span>
          <Link href="/produits" className="hover:text-green-800 transition-colors">{p.category?.name || 'Artisanat'}</Link>
          <span>›</span>
          <span style={{ color: '#1A1A1A', fontWeight: '600' }}>{p.name}</span>
        </div>
      </div>

      {/* Hero — galerie + infos */}
      <div className="max-w-7xl mx-auto px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <DetailGalerie produit={p} />
          <DetailInfos produit={p} />
        </div>
      </div>

      {/* Vendeur + fiche + avis */}
      <div className="max-w-7xl mx-auto px-10 py-12">
        <DetailVendeur shop={p.shop} rating={p.avg_rating} reviews={p.total_reviews} />
      </div>

      {/* Similaires */}
      <DetailSimilaires categoryId={p.category?.id} />

    </div>
  )
}