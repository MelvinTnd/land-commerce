'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

const filtres = ['Toutes les œuvres', 'Bois sacrés', 'Trônes & Sièges', 'Masques rituels']

const produits = [
  {
    id: 1,
    nom: 'Masque Guèlèdè Traditionnel',
    categorie: 'Masques rituels',
    prix: 45000,
    note: 4.8,
    badge: 'Héritage',
    image: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80',
    stock: 2
  },
  {
    id: 2,
    nom: 'Tabouret Royal Contemporain',
    categorie: 'Trônes & Sièges',
    prix: 85000,
    note: 5,
    badge: 'Chef-d\'œuvre',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80',
    stock: 1
  },
  {
    id: 3,
    nom: 'Maternité Africaine Sculptée',
    categorie: 'Bois sacrés',
    prix: 120000,
    note: 4.9,
    badge: 'Best-Seller',
    image: 'https://images.unsplash.com/photo-1510006851064-e6056cd0e3a8?auto=format&fit=crop&q=80',
    stock: 5
  },
  {
    id: 4,
    nom: 'Bestiaire d\'Abomey en miniature',
    categorie: 'Bois sacrés',
    prix: 15500,
    note: 4.6,
    badge: null,
    image: 'https://images.unsplash.com/photo-1563720224161-0b5c17983196?auto=format&fit=crop&q=80',
    stock: 8
  },
]

export default function ArtisanCollection() {
  const [filtreActif, setFiltreActif] = useState('Toutes les œuvres')
  const [visible, setVisible] = useState(4)
  const { ajouterAuPanier, estDansPanier } = useCart()

  const produitsFiltres = filtreActif === 'Toutes les œuvres'
    ? produits
    : produits.filter((p) => p.categorie === filtreActif)

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-[#F9FAFA]">
      <div className="max-w-[1200px] mx-auto">

        {/* Header de section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
          <div className="max-w-xl">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#1B6B3A] mb-3">
              Le Catalogue
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#111827] leading-none tracking-tight">
              Collection <span className="text-gray-400 font-light">Privée</span>
            </h2>
          </div>

          {/* Filtres Pilules (comme Espace Acheteur) */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {filtres.map((f) => (
              <button
                key={f}
                onClick={() => setFiltreActif(f)}
                className={`px-6 py-3 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all ${
                  filtreActif === f 
                    ? 'bg-[#1B6B3A] text-white shadow-md' 
                    : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grille Collection (Reprise des cartes ultra-premium) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {produitsFiltres.slice(0, visible).map((produit) => {
            const inCart = estDansPanier(produit.id)
            return (
              <div
                key={produit.id}
                className="group relative flex flex-col bg-white rounded-[24px] p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#D2F4DE]"
              >
                {/* Conteneur Image avec Hover Effect */}
                <div className="relative rounded-[16px] overflow-hidden bg-gray-100 aspect-[4/5] mb-5">
                  <Link href={`/produits/${produit.id}`}>
                    <img
                      src={produit.image}
                      alt={produit.nom}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Overlays Absolus sur l'image */}
                  {produit.badge && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#111827] text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      {produit.badge}
                    </span>
                  )}
                  {produit.stock <= 2 && (
                    <span className="absolute top-4 right-4 bg-[#EA580C] text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      Rare: {produit.stock} restants
                    </span>
                  )}
                </div>

                {/* Métadonnées (Catégorie & Note) */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B6B3A]">
                    {produit.categorie}
                  </p>
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[12px]">star</span>
                    {produit.note}
                  </div>
                </div>

                {/* Titre Produit */}
                <Link href={`/produits/${produit.id}`} className="block mb-4">
                  <h5 className="font-extrabold text-[15px] text-[#111827] leading-snug group-hover:text-[#1B6B3A] transition-colors line-clamp-2">
                    {produit.nom}
                  </h5>
                </Link>

                {/* Pied de carte: Prix et Bouton Panier */}
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Prix public</span>
                    <p className="font-extrabold text-lg text-[#111827] leading-none mt-1">
                      {produit.prix.toLocaleString('fr-FR')} <span className="text-[11px] text-gray-400">CFA</span>
                    </p>
                  </div>
                  
                  {/* Bouton Panier */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (!inCart) ajouterAuPanier(produit)
                    }}
                    className={`w-12 h-12 flex items-center justify-center rounded-[16px] transition-all duration-300 shadow-sm ${
                      inCart 
                        ? 'bg-[#1B6B3A] text-white' 
                        : 'bg-[#F0FDF4] text-[#1B6B3A] hover:bg-[#1B6B3A] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {inCart ? 'check' : 'add_shopping_cart'}
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Appel à l'action / Load More */}
        {visible < produitsFiltres.length && (
           <div className="flex justify-center">
             <button
               onClick={() => setVisible((v) => v + 4)}
               className="bg-white border-2 border-gray-200 hover:border-[#1B6B3A] text-gray-700 hover:text-[#1B6B3A] text-xs font-extrabold uppercase tracking-widest px-10 py-4 rounded-full transition-all shadow-sm"
             >
               Charger le reste du catalogue
             </button>
           </div>
        )}

      </div>
    </section>
  )
}