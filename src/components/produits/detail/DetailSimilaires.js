'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProducts } from '@/lib/api'

const similairesLocaux = [
  {
    id: 1,
    nom: 'Masque Guèlèdè Traditionnel',
    categorie: 'Sculpture',
    prix: 28500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQWt3NsHUOOcKgwDibsPPLilYMKO3ygaYWDdvHdsDg4LCV8TJwv0kSw5EGxRz7o_NoxtE39htKAzNOxFGDp8W7asYbM-Txolc1fRRmELgtKN-uGOi83rb0agNO706CIkerjUB4zKOMWpk7o6y6n1j30_lGgaxXcWLNJU38_Gf36l2xgHxgk9E65T8yx1xkIlN5pBnGaqj_mQWuEuzF-xXWpPd6aBEsJh6a-N9i44F-1H2mNrddeHLM_TUvy7dHjVida3nsiXz3e9E',
  },
  {
    id: 2,
    nom: 'Vase de Sè en Argile Rouge',
    categorie: 'Poterie',
    prix: 15000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_2bY5o3AHu_cS1hdcd5KINoq65Ynzll3pEXN41-XwP0JRM9RPD-WK3r2XbX3VBBLf5uEKk3dCspZl2EUAoB5YCw7Sj_Pjrv4ajFBmJgUD4Yv9uC89QCkwBDcW5s9odIAJeUCIt9QG6ij__Pygo9roUOO0LvX1iHreCCXb58sKpqcPg13720Rx0B_mcaMIDog-XgydWmFD2ZCg0i37QMor7DPYCNp3RlNVTgKl_rapbIa2-pwRyeW_hvDqiKY5xI-MabLepPct4Jc',
  },
  {
    id: 3,
    nom: 'Tabouret Royal Fon',
    categorie: 'Mobilier',
    prix: 35000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArFSaPLLYoQ2B9geElveMg62mhBDu-oY0qqMtyZb84vbbJiT8TjxvMRUlBWDe-5S229uLCTRp0lpRp4RKrgR474X653n_ZAC6ogOb96KdjomYMR92phme4pYG9n9tTt1ppg1YHBgl61KhKCMLW48AxsMCB5rZxcG-dADp6wXy2m3TEwOyhCR9JKzMq1bGV9G52m0JkXeRUs3HaqxzXUWIhEHyG4D7HhQBAJnJncOKKbIgcf1xPMwXfXhjjwooj4saRxcuebT3eeLw',
  },
  {
    id: 4,
    nom: 'Statuette de Chasseur en Bronze',
    categorie: 'Bronze',
    prix: 55000,
    note: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpCuM1raMH_d0yZ4seMOYQeSAXkpCLTGp8PSjBJEqnwjEtefivizDw7wYqIvFGMkRu6XapStFUssIpLwIuedznmegaIr4w4KEIqtoNOrQLpn4bGQLIxwOamAloySaxm2v_62WszW4vc0yj0Pl6AWHxoYIoNM-VgUZzsHhHQ5ASSqF05kBhhq1jZ-Y65gzhmZOuDkPpzO93rYFQAWghChe6Y_UTJrfKlJcZWYf9fwC59HtPheOUIUoZSWVvjKAPot5Fm4RfR71iOZE',
  },
]

export default function DetailSimilaires({ categoryId }) {
  const [similaires, setSimilaires] = useState(similairesLocaux)

  useEffect(() => {
    // Si on n'a pas d'ID de catégorie fourni, on prend les featured
    getProducts(categoryId ? { category: categoryId } : { featured: true })
      .then(data => {
        const prods = data.data || []
        if (prods.length > 0) {
          setSimilaires(prods.slice(0, 4).map(p => ({
            id: p.id,
            nom: p.name,
            categorie: p.category?.name || 'Artisanat',
            prix: parseFloat(p.price),
            image: p.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQWt3NsHUOOcKgwDibsPPLilYMKO3ygaYWDdvHdsDg4LCV8TJwv0kSw5EGxRz7o_NoxtE39htKAzNOxFGDp8W7asYbM-Txolc1fRRmELgtKN-uGOi83rb0agNO706CIkerjUB4zKOMWpk7o6y6n1j30_lGgaxXcWLNJU38_Gf36l2xgHxgk9E65T8yx1xkIlN5pBnGaqj_mQWuEuzF-xXWpPd6aBEsJh6a-N9i44F-1H2mNrddeHLM_TUvy7dHjVida3nsiXz3e9E',
          })))
        }
      })
      .catch(() => {})
  }, [categoryId])
  return (
    <section className="py-16" style={{ background: '#F7F5F0' }}>
      <div className="max-w-7xl mx-auto px-10">

        {/* En-tête */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
              Curiosités
            </p>
            <h2 className="text-3xl font-extrabold" style={{ color: '#1A1A1A' }}>
              Vous aimerez aussi
            </h2>
          </div>
          <Link
            href="/produits?categorie=artisanat"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-80"
            style={{ border: '1px solid #1B6B3A', color: '#1B6B3A' }}
          >
            Explorer tout l'artisanat
            <span>→</span>
          </Link>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similaires.map((produit) => (
            <Link
              key={produit.id}
              href={`/produits/${produit.id}`}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div
                className="relative rounded-2xl overflow-hidden mb-4"
                style={{ height: '240px' }}
              >
                <img
                  src={produit.image}
                  alt={produit.nom}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Catégorie */}
                <div className="absolute top-3 left-3">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(255,255,255,0.9)', color: '#374151' }}
                  >
                    {produit.categorie}
                  </span>
                </div>

                {/* Bouton panier */}
                <button
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  style={{ background: '#1B6B3A', color: 'white' }}
                  onClick={(e) => e.preventDefault()}
                >
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </button>
              </div>

              {/* Infos */}
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>
                {produit.categorie}
              </p>
              <h5
                className="font-bold text-sm leading-tight mb-2 group-hover:text-green-800 transition-colors"
                style={{ color: '#1A1A1A' }}
              >
                {produit.nom}
              </h5>
              <p className="font-extrabold text-base" style={{ color: '#1A1A1A' }}>
                {produit.prix.toLocaleString('fr-FR')}
                <span className="text-xs font-normal ml-1" style={{ color: '#9CA3AF' }}>FCFA</span>
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}