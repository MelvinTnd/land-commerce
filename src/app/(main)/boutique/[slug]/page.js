'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'
import { useParams } from 'next/navigation'
import { getShop } from '@/lib/api'

const boutiquesData = {
  'atelier-kanvo': {
    nom: 'Atelier Kanvô',
    slug: 'atelier-kanvo',
    proprietaire: 'Koffi Zinsou',
    localisation: 'Abomey, Bénin',
    categorie: 'Artisanat & Sculpture',
    description: 'Expert en sculpture depuis 3 générations, l\'Atelier Kanvô propose des pièces sculptées à la main dans des bois précieux selon les techniques ancestrales du Dahomey.',
    banner: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80',
    logo: 'https://ui-avatars.com/api/?name=Atelier+Kanvo&background=1B6B3A&color=fff&size=200',
    note: 4.8,
    totalAvis: 234,
    totalProduits: 18,
    totalVentes: 1520,
    membreDepuis: 'Janvier 2025',
    certifie: true,
    tags: ['Sculpture', 'Bois', 'Premium'],
  },
  'kaba-et-fils': {
    nom: 'Kaba & Fils',
    slug: 'kaba-et-fils',
    proprietaire: 'Ibrahim Kaba',
    localisation: 'Dassa-Zoumé, Bénin',
    categorie: 'Alimentation & Terroir',
    description: 'Producteur de miel bio et de produits du terroir depuis 2018. L\'excellence du terroir béninois mise en bouteille.',
    banner: 'https://images.unsplash.com/photo-1587049352847-8d4e8941554a?auto=format&fit=crop&q=80',
    logo: 'https://ui-avatars.com/api/?name=Kaba+Fils&background=D4920A&color=fff&size=200',
    note: 4.6,
    totalAvis: 189,
    totalProduits: 12,
    totalVentes: 980,
    membreDepuis: 'Mars 2025',
    certifie: true,
    tags: ['Miel Bio', 'Épices', 'Terroir'],
  },
}

const produitsParBoutique = {
  'atelier-kanvo': [
    { id: 101, nom: "Statue Royale d'Abomey", prix: 45000, image: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=600', stock: 3, note: 4.8, sold: 142 },
    { id: 102, nom: 'Masque Gèlèdè', prix: 35000, image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=600', stock: 5, note: 4.9, sold: 88 },
    { id: 103, nom: 'Tabouret Nago Sculpté', prix: 28000, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600', stock: 2, note: 4.7, sold: 45 },
    { id: 104, nom: 'Porte Sacrée Miniature', prix: 55000, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600', stock: 1, note: 5.0, sold: 12 },
  ],
  'kaba-et-fils': [
    { id: 201, nom: 'Miel Pur des Collines', prix: 4500, image: 'https://images.unsplash.com/photo-1587049352847-8d4e8941554a?auto=format&fit=crop&q=80', stock: 50, note: 4.6, sold: 108 },
    { id: 202, nom: 'Coffret Épices', prix: 22000, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80', stock: 30, note: 4.5, sold: 95 },
  ],
}

const avisExemple = [
  { nom: 'Rachida A.', note: 5, date: 'Mars 2026', commentaire: 'Qualité exceptionnelle ! Emballage soigné, livraison rapide.' },
  { nom: 'Pierre D.', note: 4, date: 'Fév. 2026', commentaire: 'Très beau produit. Vendeur sérieux et agréable.' },
  { nom: 'Amina K.', note: 5, date: 'Jan. 2026', commentaire: 'Vendeur réactif et professionnel. Le produit correspond.' },
]

export default function BoutiquePage() {
  const params = useParams()
  const slug = params.slug
  const [boutique, setBoutique] = useState(boutiquesData[slug] || null)
  const [produits, setProduits] = useState(produitsParBoutique[slug] || [])
  const { ajouterAuPanier, estDansPanier } = useCart()
  const [onglet, setOnglet] = useState('produits')
  const [showContact, setShowContact] = useState(false)

  // Tenter de charger depuis l'API, sinon fallback sur données locales
  useEffect(() => {
    getShop(slug)
      .then(data => {
        setBoutique({
          nom: data.name,
          slug: data.slug,
          proprietaire: data.user?.name || '',
          localisation: data.location || 'Bénin',
          categorie: 'Artisanat',
          description: data.description || '',
          banner: data.banner || boutiquesData[slug]?.banner || 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80',
          logo: data.logo || boutiquesData[slug]?.logo || '',
          note: 4.8,
          totalAvis: 0,
          totalProduits: data.products?.length || 0,
          totalVentes: 0,
          membreDepuis: new Date(data.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric'}),
          certifie: data.status === 'active',
          tags: [],
        })
        if (data.products && data.products.length > 0) {
          setProduits(data.products.map(p => ({
            id: p.id,
            nom: p.name,
            prix: parseFloat(p.price),
            image: p.image || 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80',
            stock: p.stock,
            note: parseFloat(p.avg_rating) || 4.5,
            sold: 0,
          })))
        }
      })
      .catch(() => {}) // Garder les données locales
  }, [slug])

  if (!boutique) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-[#F9FAFA]">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-gray-400">store_off</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Boutique introuvable</h1>
        <p className="text-sm text-gray-500 mb-8">Ce vendeur n'existe pas ou sa boutique a été désactivée.</p>
        <Link href="/artisans" className="bg-[#1B6B3A] hover:bg-[#134e29] text-white font-bold px-8 py-3.5 rounded-full transition-colors">
          Voir tous les vendeurs
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFA] font-sans pb-20">

      {/* Hero Banner Section */}
      <div className="relative h-[300px] lg:h-[350px] w-full bg-[#111827]">
        <div className="absolute inset-0">
          <Image
            src={boutique.banner}
            alt="Banner"
            fill
            className="object-cover mix-blend-overlay opacity-60"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Banner Navigation overlay */}
        <div className="absolute top-24 left-6 lg:left-12 z-10">
           <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
             <span className="material-symbols-outlined text-[16px]">arrow_back</span>
             Retour aux boutiques
           </Link>
        </div>
      </div>

      {/* Store Profile Card overlapping banner */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-[24px] p-6 lg:p-10 shadow-lg flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Logo */}
          <div className="w-32 h-32 lg:w-40 lg:h-40 shrink-0 rounded-[20px] bg-white p-2 shadow-sm border border-gray-100 -mt-16 lg:-mt-20 relative overflow-hidden">
             <Image
               src={boutique.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(boutique.nom)}&background=1B6B3A&color=fff&size=200`}
               alt="Logo"
               fill
               className="object-cover rounded-[14px]"
               sizes="160px"
             />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col pt-2 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">{boutique.nom}</h1>
                  {boutique.certifie && (
                    <span className="flex items-center gap-1 bg-[#D2F4DE] text-[#1B6B3A] text-[10px] uppercase font-bold px-2.5 py-1 rounded-md tracking-wider">
                      <span className="material-symbols-outlined text-[12px]">verified</span> Vendeur Vérifié
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-500 mb-4">{boutique.categorie} • {boutique.localisation}</p>
                
                {/* Stats row */}
                <div className="flex items-center gap-6 text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5" title="Note moyenne">
                    <span className="material-symbols-outlined text-[#F5B731] text-[16px]">star</span>
                    {boutique.note} ({boutique.totalAvis} avis)
                  </div>
                  <div className="flex items-center gap-1.5" title="Produits en vente">
                     <span className="material-symbols-outlined text-gray-400 text-[16px]">inventory_2</span>
                     {boutique.totalProduits} Articles
                  </div>
                  <div className="flex items-center gap-1.5" title="Ventes réalisées">
                     <span className="material-symbols-outlined text-green-600 text-[16px]">shopping_cart</span>
                     {boutique.totalVentes} Ventes
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 md:mt-0">
                <button className="flex-1 md:flex-none border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">share</span> Partager
                </button>
                <button 
                  onClick={() => setShowContact(!showContact)}
                  className="flex-1 md:flex-none bg-[#1B6B3A] hover:bg-[#134e29] text-white font-bold text-xs px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span> Contacter le vendeur
                </button>
              </div>
            </div>

            {/* Tags & Description summary */}
            <div className="border-t border-gray-100 pt-5 flex flex-col md:flex-row gap-6">
               <p className="text-sm text-gray-600 leading-relaxed max-w-2xl font-medium">
                 "{boutique.description}"
               </p>
               <div className="flex flex-wrap gap-2 md:ml-auto items-start">
                  {boutique.tags.map(tag => (
                    <span key={tag} className="bg-gray-50 text-gray-600 border border-gray-100 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                      {tag}
                    </span>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {showContact && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col md:flex-row gap-4 items-center">
             <div className="w-12 h-12 rounded-full bg-green-50 text-green-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">forum</span>
             </div>
             <div className="w-full flex-1">
               <p className="text-xs font-bold text-gray-900 mb-2">Envoyer un message à la boutique</p>
               <input type="text" placeholder="Bonjour, je souhaiterais savoir si..." className="w-full bg-gray-50 border border-transparent focus:border-green-700 outline-none rounded-xl px-4 py-3 text-sm font-medium transition-colors" />
             </div>
             <button onClick={() => setShowContact(false)} className="bg-[#1B6B3A] text-white font-bold text-xs px-8 py-3.5 rounded-xl whitespace-nowrap lg:mt-6">Envoyer</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex gap-8 border-b border-gray-200">
           {['produits', 'avis'].map((tab) => (
             <button 
               key={tab} 
               onClick={() => setOnglet(tab)}
               className={`pb-4 text-[13px] font-extrabold uppercase tracking-widest relative transition-colors ${onglet === tab ? 'text-[#1B6B3A]' : 'text-gray-400 hover:text-gray-700'}`}
             >
               {tab === 'produits' ? 'Articles en vente' : 'Avis des clients'}
               {onglet === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1B6B3A] rounded-t-full"></div>}
             </button>
           ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* PRODUCTS GRID */}
        {onglet === 'produits' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produits.map((p) => {
               const inCart = estDansPanier(p.id)
               return (
                 <div key={p.id} className="bg-white rounded-[24px] p-4 shadow-sm flex flex-col group border border-transparent hover:border-green-100 hover:shadow-md transition-all">
                  <div className="relative rounded-[16px] overflow-hidden bg-gray-100 mb-4 aspect-[4/3]">
                    <Link href={`/produits/${p.id}`}>
                      <Image
                        src={p.image}
                        alt={p.nom}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </Link>
                    {p.sold > 100 && (
                      <span className="absolute top-3 left-3 bg-[#1B6B3A] text-white text-[8px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">Bestseller</span>
                    )}
                    {p.stock <= 3 && p.stock > 0 && (
                      <span className="absolute top-3 right-3 bg-[#EA580C] text-white text-[8px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">Stock: {p.stock}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/produits/${p.id}`}>
                      <h4 className="font-bold text-[13px] text-gray-900 leading-tight pr-2 hover:text-[#1B6B3A] transition-colors line-clamp-2">{p.nom}</h4>
                    </Link>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                     <span className="text-[14px] font-extrabold text-[#1B6B3A] tracking-tight">{p.prix.toLocaleString('fr-FR')} CFA</span>
                     <button
                        onClick={(e) => { e.preventDefault(); ajouterAuPanier({ id: p.id, nom: p.nom, prix: p.prix, image: p.image, artisan: boutique.nom }) }}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm ${inCart ? 'bg-[#1B6B3A] text-white' : 'bg-green-50 text-green-700 hover:bg-[#1B6B3A] hover:text-white'}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{inCart ? 'check' : 'shopping_cart'}</span>
                      </button>
                  </div>
                 </div>
               )
            })}
          </div>
        )}

        {/* REVIEWS */}
        {onglet === 'avis' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Reviews Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[24px] p-8 shadow-sm text-center">
                 <p className="text-[56px] font-extrabold text-gray-900 leading-none mb-2">{boutique.note}</p>
                 <div className="flex justify-center text-[#F5B731] mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[20px]">{i < Math.floor(boutique.note) ? 'star' : 'star_outline'}</span>
                    ))}
                 </div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Basé sur {boutique.totalAvis} avis</p>
                 
                 <div className="flex flex-col gap-3">
                   {[5,4,3,2,1].map(n => {
                      const pct = n === 5 ? 75 : n === 4 ? 20 : n === 3 ? 5 : 0;
                      return (
                       <div key={n} className="flex items-center gap-3">
                         <span className="text-xs font-bold text-gray-600 w-2 shrink-0">{n}</span>
                         <span className="material-symbols-outlined text-[#F5B731] text-[12px]">star</span>
                         <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-green-600 rounded-full" style={{ width: `${pct}%` }}></div>
                         </div>
                         <span className="text-[10px] font-bold text-gray-400 w-6 text-right">{pct}%</span>
                       </div>
                      )
                   })}
                 </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {avisExemple.map((avis, i) => (
                <div key={i} className="bg-white rounded-[20px] p-6 shadow-sm flex gap-5">
                   <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-lg text-gray-400 shrink-0">
                     {avis.nom[0]}
                   </div>
                   <div>
                     <div className="flex items-center gap-3 mb-1">
                       <h4 className="font-bold text-sm text-gray-900">{avis.nom}</h4>
                       <span className="text-[10px] text-gray-400 font-medium">{avis.date}</span>
                     </div>
                     <div className="flex text-[#F5B731] mb-3">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className="material-symbols-outlined text-[14px]">{j < avis.note ? 'star' : 'star_outline'}</span>
                        ))}
                     </div>
                     <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
                       "{avis.commentaire}"
                     </p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
