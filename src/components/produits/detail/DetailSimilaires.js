'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/api'
import { getProductImage } from '@/lib/images'

const similairesLocaux = [
  {
    id: 1,
    nom: 'Masque Guèlèdè Traditionnel',
    categorie: 'Sculpture',
    prix: 28500,
    slug: 'masque-gelede',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 2,
    nom: 'Vase de Sè en Argile Rouge',
    categorie: 'Poterie',
    prix: 15000,
    slug: 'vase-ceramique-se',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 3,
    nom: 'Tabouret Royal Fon',
    categorie: 'Mobilier',
    prix: 35000,
    slug: 'tabouret-nago-sculpte',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 4,
    nom: 'Statuette de Chasseur en Bronze',
    categorie: 'Bronze',
    prix: 55000,
    note: 4.8,
    slug: 'sculpture-bronze-ghezo',
    image: 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&q=80&w=600',
  },
]

export default function DetailSimilaires({ categoryId }) {
  const [similaires, setSimilaires] = useState(similairesLocaux)

  useEffect(() => {
    getProducts(categoryId ? { category: categoryId } : { featured: true })
      .then(data => {
        if (data.data) {
          const prods = data.data
          if (prods.length > 0) {
            setSimilaires(prods.slice(0, 4).map(p => ({
              id: p.id,
              nom: p.name,
              categorie: p.category?.name || 'Artisanat',
              prix: parseFloat(p.price),
              promoP: p.promo_price ? parseFloat(p.promo_price) : null,
              slug: p.slug || p.id,
              image: getProductImage({ image: p.image, slug: p.slug, categorie: p.category?.name }),
            })))
          } else {
            // Aucun produit similaire trouvé -> on vide pour éviter les faux-semblants
            setSimilaires([])
          }
        }
      })
      .catch(() => {})
  }, [categoryId])

  if (similaires.length === 0) return null

  return (
    <section className="py-12 md:py-16" style={{ background: '#F7F5F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
              Curiosités
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: '#1A1A1A' }}>
              Vous aimerez aussi
            </h2>
          </div>
          <Link
            href="/produits?categorie=artisanat"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-80 self-start sm:self-auto"
            style={{ border: '1px solid #1B6B3A', color: '#1B6B3A' }}
          >
            Explorer tout l&apos;artisanat
            <span>→</span>
          </Link>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {similaires.map((produit) => (
            <Link
              key={produit.id}
              href={`/produits/${produit.slug || produit.id}`}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div
                className="relative rounded-2xl overflow-hidden mb-3 md:mb-4"
                style={{ height: '180px' }}
              >
                <Image
                  src={produit.image}
                  alt={produit.nom}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:640px) 50vw,(max-width:1024px) 50vw,25vw"
                  unoptimized
                />

                {/* Catégorie */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3">
                  <span
                    className="px-2 py-1 md:px-3 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(255,255,255,0.9)', color: '#374151' }}
                  >
                    {produit.categorie}
                  </span>
                </div>

                {/* Bouton panier */}
                <button
                  className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  style={{ background: '#1B6B3A', color: 'white' }}
                  onClick={(e) => e.preventDefault()}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </button>
              </div>

              {/* Infos */}
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>
                {produit.categorie}
              </p>
              <h5
                className="font-bold text-[13px] md:text-sm leading-tight mb-1 md:mb-2 group-hover:text-green-800 transition-colors line-clamp-2"
                style={{ color: '#1A1A1A' }}
              >
                {produit.nom}
              </h5>
              {produit.promoP ? (
                <div>
                  <p className="font-extrabold text-sm md:text-base leading-none" style={{ color: '#EF4444' }}>
                    {produit.promoP.toLocaleString('fr-FR')}
                    <span className="text-xs font-normal ml-1" style={{ color: '#9CA3AF' }}>FCFA</span>
                  </p>
                  <p className="text-[10px] line-through" style={{ color: '#9CA3AF' }}>{produit.prix.toLocaleString('fr-FR')} CFA</p>
                </div>
              ) : (
                <p className="font-extrabold text-sm md:text-base" style={{ color: '#1A1A1A' }}>
                  {produit.prix.toLocaleString('fr-FR')}
                  <span className="text-xs font-normal ml-1" style={{ color: '#9CA3AF' }}>FCFA</span>
                </p>
              )}
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}