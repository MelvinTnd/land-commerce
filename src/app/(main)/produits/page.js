'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProduitsHeroArtisan from '@/components/produits/ProduitsHeroArtisan'
import ProduitsFiltres from '@/components/produits/ProduitsFiltres'
import ProduitsGrille from '@/components/produits/ProduitsGrille'
import ProduitsPagination from '@/components/produits/ProduitsPagination'
import ProduitsBoutiques from '@/components/produits/ProduitsBoutiques'

function ProduitsContent() {
  const searchParams = useSearchParams()
  const [categorieActive, setCategorieActive] = useState(null) // null = toutes catégories
  const [prixMax, setPrixMax] = useState(1500000)
  const [triActif, setTriActif] = useState('Pertinence')
  const [recherche, setRecherche] = useState('')

  // Pré-sélection depuis l'URL (?category=artisanat ou ?q=terme)
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategorieActive(cat)
    const q = searchParams.get('q')
    if (q) setRecherche(q)
  }, [searchParams])

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <ProduitsHeroArtisan />

      <div className="max-w-7xl mx-auto px-10 py-12 flex gap-10">
        <ProduitsFiltres
          categorieActive={categorieActive}
          setCategorieActive={setCategorieActive}
          prixMax={prixMax}
          setPrixMax={setPrixMax}
        />
        <div className="flex-1">
          <ProduitsGrille
            categorieActive={categorieActive}
            prixMax={prixMax}
            triActif={triActif}
            setTriActif={setTriActif}
            recherche={recherche}
          />
          <ProduitsPagination total={12} />
        </div>
      </div>

      <ProduitsBoutiques />
    </div>
  )
}

export default function ProduitsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProduitsContent />
    </Suspense>
  )
}