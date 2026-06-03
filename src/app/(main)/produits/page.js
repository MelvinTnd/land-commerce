'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProduitsHeroArtisan from '@/components/produits/ProduitsHeroArtisan'
import ProduitsFiltres from '@/components/produits/ProduitsFiltres'
import ProduitsGrille from '@/components/produits/ProduitsGrille'
import ProduitsPagination from '@/components/produits/ProduitsPagination'
import ProduitsBoutiques from '@/components/produits/ProduitsBoutiques'

const PER_PAGE = 12

function ProduitsContent() {
  const searchParams = useSearchParams()
  const [categorieActive, setCategorieActive] = useState(null)
  const [triActif, setTriActif] = useState('Pertinence')
  const [recherche, setRecherche] = useState('')
  const [totalProduits, setTotalProduits] = useState(0)
  const [showFiltresMobile, setShowFiltresMobile] = useState(false)

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategorieActive(cat)
    const q = searchParams.get('q')
    if (q) setRecherche(q)
  }, [searchParams])

  const totalPages = Math.max(1, Math.ceil(totalProduits / PER_PAGE))
  const filtresActifs = categorieActive || recherche

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <ProduitsHeroArtisan total={totalProduits} />

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 flex gap-10">
        {/* Sidebar filtres — visible desktop uniquement */}
        <ProduitsFiltres
          categorieActive={categorieActive}
          setCategorieActive={setCategorieActive}
          recherche={recherche}
          setRecherche={setRecherche}
        />
        <div className="flex-1 min-w-0">
          <ProduitsGrille
            categorieActive={categorieActive}
            triActif={triActif}
            setTriActif={setTriActif}
            recherche={recherche}
            onCountChange={setTotalProduits}
          />
          {totalProduits > PER_PAGE && (
            <ProduitsPagination total={totalPages} />
          )}
        </div>
      </div>

      <ProduitsBoutiques />

      {/* ── Bouton FAB Filtres mobile ── */}
      <button
        onClick={() => setShowFiltresMobile(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-6 py-3.5 rounded-full shadow-xl text-white text-[13px] font-black transition-all hover:scale-105"
        style={{ background: '#1B6B3A', boxShadow: '0 8px 32px rgba(27,107,58,0.4)' }}
      >
        <span className="material-symbols-outlined text-[18px]">tune</span>
        Filtres
        {filtresActifs && (
          <span className="w-5 h-5 rounded-full bg-white text-[#1B6B3A] text-[10px] font-black flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* ── Drawer filtres mobile ── */}
      {showFiltresMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFiltresMobile(false)}
          />
          {/* Panel */}
          <div className="w-[320px] bg-[#F7F5F0] h-full overflow-y-auto flex flex-col shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between px-5 py-4 bg-white sticky top-0 z-10" style={{ borderBottom: '1px solid #E5E7EB' }}>
              <span className="font-black text-[15px]" style={{ color: '#0D0D0D' }}>Filtres</span>
              <button
                onClick={() => setShowFiltresMobile(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ color: '#6B7280' }}>close</span>
              </button>
            </div>
            <div className="p-4 flex-1">
              <ProduitsFiltres
                categorieActive={categorieActive}
                setCategorieActive={(v) => { setCategorieActive(v); setShowFiltresMobile(false) }}
                recherche={recherche}
                setRecherche={setRecherche}
                mobile
              />
            </div>
          </div>
        </div>
      )}
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