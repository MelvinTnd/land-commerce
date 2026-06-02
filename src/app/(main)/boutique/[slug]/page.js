'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getShop, sendMessage, getShopReviews } from '@/lib/api'
import { getShopBannerImage } from '@/lib/images'

/* ─── Fallback data ──────────────────────────────────────────────────────── */
const FALLBACK_SHOPS = {
  'dahomey-crafts': {
    nom: 'Dahomey Crafts', slug: 'dahomey-crafts', proprietaire: 'Marc Dossou',
    localisation: 'Abomey, Bénin', categorie: 'Artisanat & Sculpture',
    description: 'Objets d\'art et sculptures authentiques du plateau d\'Abomey.',
    banner: 'https://images.unsplash.com/photo-1578330740121-657805126f5f?auto=format&fit=crop&q=80',
    logo: 'https://ui-avatars.com/api/?name=Dahomey+Crafts&background=1B6B3A&color=fff&size=200',
    note: 5.0, totalAvis: 12, totalProduits: 1, totalVentes: 45,
    membreDepuis: 'Juin 2026', certifie: true,
    tags: ['Art', 'Abomey', 'Bois'], whatsapp: '', instagram: '',
  },
  'indigo-mode': {
    nom: 'Indigo Mode', slug: 'indigo-mode', proprietaire: 'Sophie Alapini',
    localisation: 'Cotonou, Bénin', categorie: 'Mode & Textile',
    description: 'Prêt-à-porter en pagne Indigo et tissus traditionnels revisités.',
    banner: 'https://images.unsplash.com/photo-1544441892-0b263bc33061?auto=format&fit=crop&q=80',
    logo: 'https://ui-avatars.com/api/?name=Indigo+Mode&background=D4920A&color=fff&size=200',
    note: 4.8, totalAvis: 24, totalProduits: 1, totalVentes: 89,
    membreDepuis: 'Juin 2026', certifie: true,
    tags: ['Mode', 'Indigo', 'Cotonou'], whatsapp: '', instagram: '',
  },
  'saveurs-du-plateau': {
    nom: 'Saveurs du Plateau', slug: 'saveurs-du-plateau', proprietaire: 'Thomas Okou',
    localisation: 'Pobè, Bénin', categorie: 'Alimentation & Épices',
    description: 'Épices, huiles et produits naturels transformés localement.',
    banner: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80',
    logo: 'https://ui-avatars.com/api/?name=Saveurs+Plateau&background=7C3AED&color=fff&size=200',
    note: 4.9, totalAvis: 31, totalProduits: 1, totalVentes: 124,
    membreDepuis: 'Juin 2026', certifie: true,
    tags: ['Bio', 'Plateau', 'Épices'], whatsapp: '', instagram: '',
  },
  'atelier-kanvo': {
    nom: 'Atelier Kanvô', slug: 'atelier-kanvo', proprietaire: 'Koffi Zinsou',
    localisation: 'Abomey, Bénin', categorie: 'Artisanat & Sculpture',
    description: 'Expert en sculpture depuis 3 générations, l\'Atelier Kanvô propose des pièces sculptées à la main dans des bois précieux selon les techniques ancestrales du Dahomey.',
    banner: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80',
    logo: 'https://ui-avatars.com/api/?name=Atelier+Kanvo&background=1B6B3A&color=fff&size=200',
    note: 4.8, totalAvis: 234, totalProduits: 18, totalVentes: 1520,
    membreDepuis: 'Janvier 2025', certifie: true,
    tags: ['Sculpture', 'Bois', 'Premium'], whatsapp: '', instagram: '',
  },
}
const FALLBACK_PRODUCTS = {
  'dahomey-crafts': [
    { id: 201, nom: "Masque de Danse Traditionnel", prix: 25000, image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600', stock: 10, note: 5.0, sold: 15 },
  ],
  'indigo-mode': [
    { id: 202, nom: "Boubou Indigo Royal", prix: 15000, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=600', stock: 5, note: 4.8, sold: 22 },
  ],
  'saveurs-du-plateau': [
    { id: 203, nom: "Huile de Palme Bio", prix: 2500, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600', stock: 50, note: 4.9, sold: 34 },
  ],
  'atelier-kanvo': [
    { id: 101, nom: "Statue Royale d'Abomey", prix: 45000, image: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=600', stock: 3, note: 4.8, sold: 142 },
    { id: 102, nom: 'Masque Gèlèdè', prix: 35000, image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=600', stock: 5, note: 4.9, sold: 88 },
    { id: 103, nom: 'Tabouret Nago Sculpté', prix: 28000, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600', stock: 2, note: 4.7, sold: 45 },
    { id: 104, nom: 'Porte Sacrée Miniature', prix: 55000, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600', stock: 1, note: 5.0, sold: 12 },
  ],
}

/* ─── ProductCard ─────────────────────────────────────────────────────────── */
function ProductCard({ p, boutiqueNom, ajouterAuPanier, estDansPanier }) {
  const inCart = estDansPanier(p.id)
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100">
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <Link href={`/produits/${p.id}`}>
          <Image
            src={p.image}
            alt={p.nom}
            fill
            className="object-cover group-hover:scale-108 transition-transform duration-500"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
          />
        </Link>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {p.sold > 100 && (
            <span className="bg-[#1B6B3A] text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow">⭐ Bestseller</span>
          )}
          {p.stock <= 3 && p.stock > 0 && (
            <span className="bg-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">Derniers {p.stock}</span>
          )}
          {p.stock === 0 && (
            <span className="bg-gray-700 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">Épuisé</span>
          )}
        </div>
        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => ajouterAuPanier({ id: p.id, nom: p.nom, prix: p.prix, image: p.image, artisan: boutiqueNom })}
            disabled={p.stock === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all
              ${inCart ? 'bg-[#1B6B3A] text-white' : 'bg-white text-gray-900 hover:bg-[#1B6B3A] hover:text-white'}
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="material-symbols-outlined text-[16px]">{inCart ? 'check' : 'add_shopping_cart'}</span>
            {inCart ? 'Dans le panier' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
      <div className="p-4">
        {/* Note */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`material-symbols-outlined text-[13px] ${i < Math.round(p.note) ? 'text-amber-400' : 'text-gray-200'}`}>star</span>
          ))}
          <span className="text-[10px] text-gray-400 font-bold ml-1">{p.note}</span>
        </div>
        <Link href={`/produits/${p.id}`}>
          <h3 className="font-bold text-[13px] text-gray-900 leading-snug hover:text-[#1B6B3A] transition-colors line-clamp-2 mb-3">{p.nom}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-extrabold text-[#1B6B3A]">{p.prix.toLocaleString('fr-FR')} <span className="text-[11px] font-bold text-gray-400">FCFA</span></span>
          <button
            onClick={() => ajouterAuPanier({ id: p.id, nom: p.nom, prix: p.prix, image: p.image, artisan: boutiqueNom })}
            disabled={p.stock === 0}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm
              ${inCart ? 'bg-[#1B6B3A] text-white' : 'bg-green-50 text-green-700 hover:bg-[#1B6B3A] hover:text-white'}
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <span className="material-symbols-outlined text-[17px]">{inCart ? 'check' : 'shopping_cart'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
export default function BoutiquePage() {
  const params  = useParams()
  const slug    = params.slug
  const router  = useRouter()
  const { data: session } = useSession()
  const { ajouterAuPanier, estDansPanier } = useCart()

  // Calcul fallback immédiat basé sur le slug
  const staticFallback = FALLBACK_SHOPS[slug] || {
    nom: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    slug,
    proprietaire: 'Artisan',
    localisation: 'Bénin',
    categorie: 'Artisanat',
    description: "Découvrez cette boutique et son artisanat d'exception.",
    banner: getShopBannerImage({ name: slug }),
    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(slug)}&background=1B6B3A&color=fff&size=200`,
    note: 0, totalAvis: 0, totalProduits: 0, totalVentes: 0,
    membreDepuis: '', certifie: false, tags: [], whatsapp: '', instagram: '',
  }

  const [boutique, setBoutique]       = useState(staticFallback)  // visible immédiatement
  const [produits, setProduits]       = useState(FALLBACK_PRODUCTS[slug] || [])
  const [onglet, setOnglet]           = useState('produits')
  const [search, setSearch]           = useState('')
  const [showContact, setShowContact] = useState(false)
  const [contactMsg, setContactMsg]   = useState('')
  const [contactSending, setContactSending] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [apiShopId, setApiShopId]     = useState(null)
  const [reviews, setReviews]         = useState([])
  const [reviewsData, setReviewsData] = useState({ avg_rating: 0, total_reviews: 0, distribution: {} })
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  /* ── Charger boutique depuis l'API (en arrière-plan) ── */
  useEffect(() => {
    getShop(slug)
      .then(data => {
        setBoutique({
          nom:            data.name,
          slug:           data.slug,
          proprietaire:   data.user?.name || '',
          localisation:   data.location   || 'Bénin',
          categorie:      data.category   || 'Artisanat',
          description:    data.description || '',
          banner:         (data.banner && data.banner.startsWith('/storage/')) ? ((process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api').replace('/api', '') + data.banner) : (data.banner || FALLBACK_SHOPS[slug]?.banner || getShopBannerImage({ name: data.name })),
          logo:           (data.logo && data.logo.startsWith('/storage/')) ? ((process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api').replace('/api', '') + data.logo) : (data.logo || FALLBACK_SHOPS[slug]?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1B6B3A&color=fff&size=200`),
          note:           parseFloat(data.avg_rating)  || 5.0,
          totalAvis:      parseInt(data.reviews_count) || 0,
          totalProduits:  data.products?.length        || 0,
          totalVentes:    parseInt(data.total_sales)   || 0,
          membreDepuis:   data.created_at
            ? new Date(data.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
            : '',
          certifie:       data.status === 'active',
          tags:           data.tags || [],
          whatsapp:       data.whatsapp  || '',
          instagram:      data.instagram || '',
        })
        if (data.products) {
          setProduits(data.products.map(p => ({
            id:    p.id,
            nom:   p.name,
            prix:  parseFloat(p.price),
            image: getProductImage({ image: p.image, slug: p.slug, categorie: p.category?.name }),
            stock: p.stock,
            note:  parseFloat(p.avg_rating) || 5.0,
            sold:  p.sales_count || 0,
          })))
        }
        setApiShopId(data.id)
      })
      .catch(() => {})  // fallback déjà en état initial
      .finally(() => setLoading(false))
  }, [slug])

  /* ── Avis ── */
  useEffect(() => {
    if (onglet !== 'avis' || reviews.length > 0) return
    setReviewsLoading(true)
    getShopReviews(slug)
      .then(data => {
        setReviews(data.reviews || [])
        setReviewsData({ avg_rating: data.avg_rating || 0, total_reviews: data.total_reviews || 0, distribution: data.distribution || {} })
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false))
  }, [onglet, slug])

  /* ── Partager ── */
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    })
  }

  /* ── Envoyer message ── */
  const handleSendMessage = async () => {
    if (!apiShopId || !contactMsg.trim()) return
    setContactSending(true)
    try {
      await sendMessage(apiShopId, contactMsg.trim(), session?.user?.apiToken)
      setContactSent(true)
      setContactMsg('')
    } catch (err) {
      alert(err.message || 'Erreur lors de l\'envoi')
    } finally {
      setContactSending(false)
    }
  }

  /* ── Filtrer produits ── */
  const produitsFiltres = produits.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  )

  /* ── Loading skeleton ── */
  if (loading && !boutique) {
    return (
      <div className="min-h-screen bg-[#F7F9F8]">
        <div className="h-[340px] bg-gray-200 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 -mt-20">
          <div className="bg-white rounded-3xl p-8 shadow-lg animate-pulse h-48" />
        </div>
      </div>
    )
  }

  /* ── Boutique introuvable ── */
  if (!boutique) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-[#F7F9F8] px-4">
        <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-gray-300">store_off</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Boutique introuvable</h1>
        <p className="text-sm text-gray-500 mb-8 text-center max-w-sm">Ce vendeur n&apos;existe pas ou sa boutique a été désactivée.</p>
        <Link href="/boutiques" className="bg-[#1B6B3A] hover:bg-[#134e29] text-white font-bold px-8 py-3.5 rounded-full transition-colors">
          Voir toutes les boutiques
        </Link>
      </div>
    )
  }

  const logoSrc = boutique.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(boutique.nom)}&background=1B6B3A&color=fff&size=200`

  return (
    <div className="min-h-screen bg-[#F7F9F8] font-sans pb-24">

      {/* ══════════════════════════════════════════════
          HERO BANNIÈRE
      ══════════════════════════════════════════════ */}
      <div className="relative h-[320px] lg:h-[400px] w-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D2B1A 0%, #1B6B3A 60%, #0D4A28 100%)' }}>
        <Image
          src={boutique.banner || getShopBannerImage({ name: boutique.nom, description: boutique.description })}
          alt={boutique.nom}
          fill
          className="object-cover opacity-60"
          sizes="100vw"
          priority
          onError={e => { e.target.style.opacity = '0' }}
          unoptimized
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Retour */}
        <div className="absolute top-28 left-4 sm:left-8 lg:left-12 z-10">
          <Link href="/boutiques"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors bg-black/20 backdrop-blur-sm px-3.5 py-2 rounded-full">
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            Boutiques
          </Link>
        </div>

        {/* Texte décoratif fond */}
        <div className="absolute bottom-6 right-6 text-white/5 font-black text-[96px] leading-none select-none pointer-events-none hidden lg:block">
          {boutique.certifie ? 'VÉRIFIÉ' : 'MARKET'}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CARTE PROFIL (chevauchant le banner)
      ══════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        <div className="bg-white rounded-[28px] shadow-2xl shadow-black/10 overflow-hidden">

          {/* Bande couleur top */}
          <div className="h-1.5 bg-gradient-to-r from-[#1B6B3A] via-[#D4920A] to-[#1B6B3A]" />

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-7 items-start">

              {/* Logo */}
              <div className="shrink-0 -mt-20 lg:-mt-24 relative">
                <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-[22px] overflow-hidden bg-white shadow-xl ring-4 ring-white">
                  <Image src={logoSrc} alt={boutique.nom} fill className="object-cover" sizes="144px" unoptimized />
                </div>
                {boutique.certifie && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#1B6B3A] rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                    <span className="material-symbols-outlined text-white text-[16px]">verified</span>
                  </div>
                )}
              </div>

              {/* Infos principales */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h1 className="text-2xl lg:text-[28px] font-extrabold text-gray-900 tracking-tight">{boutique.nom}</h1>
                      {boutique.certifie && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                          <span className="material-symbols-outlined text-[12px]">verified</span> Vendeur Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mb-4">
                      <span className="material-symbols-outlined text-[14px]">storefront</span>
                      {boutique.categorie}
                      <span className="text-gray-300">·</span>
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {boutique.localisation}
                    </p>

                    {/* Stats rapides */}
                    <div className="flex flex-wrap gap-4">
                      {[
                        { icon: 'star', val: boutique.note || '—', sub: `${boutique.totalAvis} avis`, color: 'text-amber-500' },
                        { icon: 'inventory_2', val: boutique.totalProduits, sub: 'articles', color: 'text-violet-500' },
                        { icon: 'shopping_bag', val: boutique.totalVentes || '—', sub: 'ventes', color: 'text-[#1B6B3A]' },
                        { icon: 'calendar_month', val: boutique.membreDepuis || '—', sub: 'membre depuis', color: 'text-blue-500' },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3.5 py-2.5 rounded-2xl">
                          <span className={`material-symbols-outlined text-[18px] ${s.color}`}>{s.icon}</span>
                          <div>
                            <p className="text-[13px] font-extrabold text-gray-900 leading-none">{s.val}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{s.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-2.5 shrink-0 flex-wrap">
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-400 text-gray-600 hover:text-gray-900 font-bold text-xs px-4 py-2.5 rounded-full transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px]">{shareCopied ? 'check' : 'share'}</span>
                      {shareCopied ? 'Lien copié !' : 'Partager'}
                    </button>
                    {boutique.whatsapp && (
                      <a
                        href={`https://wa.me/${boutique.whatsapp.replace(/\D/g,'')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs px-4 py-2.5 rounded-full transition-all border border-green-100"
                      >
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                        WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => setShowContact(v => !v)}
                      className="flex items-center gap-1.5 bg-[#1B6B3A] hover:bg-[#134e29] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-md shadow-green-900/20"
                    >
                      <span className="material-symbols-outlined text-[15px]">mail</span>
                      Contacter
                    </button>
                  </div>
                </div>

                {/* Description */}
                {boutique.description && (
                  <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 italic">
                    &ldquo;{boutique.description}&rdquo;
                  </p>
                )}

                {/* Tags */}
                {boutique.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {boutique.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PANNEAU CONTACT
      ══════════════════════════════════════════════ */}
      {showContact && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-white border border-gray-100 shadow-sm rounded-[24px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1B6B3A] text-[20px]">forum</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Envoyer un message à {boutique.nom}</h3>
                <p className="text-xs text-gray-400">Le vendeur vous répondra dans les meilleurs délais</p>
              </div>
            </div>

            {!session?.user ? (
              <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Connectez-vous pour envoyer un message</p>
                <Link href="/connexion" className="inline-flex items-center gap-2 bg-[#1B6B3A] text-white font-bold text-xs px-6 py-2.5 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">login</span> Se connecter
                </Link>
              </div>
            ) : contactSent ? (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#1B6B3A] text-[24px]">check_circle</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Message envoyé avec succès !</p>
                  <button onClick={() => router.push('/messages')} className="text-xs font-bold text-[#1B6B3A] hover:underline mt-0.5">
                    Voir mes messages →
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={contactMsg}
                  onChange={e => setContactMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Bonjour ${boutique.nom}, je souhaiterais...`}
                  className="flex-1 bg-gray-50 border border-gray-200 focus:border-[#1B6B3A] outline-none rounded-2xl px-5 py-3.5 text-sm font-medium transition-colors"
                />
                <button
                  disabled={!contactMsg.trim() || contactSending}
                  onClick={handleSendMessage}
                  className="bg-[#1B6B3A] hover:bg-[#134e29] text-white font-bold text-sm px-6 py-3.5 rounded-2xl whitespace-nowrap disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {contactSending
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <span className="material-symbols-outlined text-[17px]">send</span>
                  }
                  {contactSending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          ONGLETS
      ══════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
          {[
            { id: 'produits', label: 'Articles', icon: 'storefront', count: produits.length },
            { id: 'avis', label: 'Avis clients', icon: 'star', count: boutique.totalAvis },
            { id: 'infos', label: 'À propos', icon: 'info', count: null },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setOnglet(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all ${
                onglet === tab.id
                  ? 'bg-[#1B6B3A] text-white shadow-md shadow-green-900/20'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${onglet === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CONTENU ONGLET
      ══════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* ── PRODUITS ── */}
        {onglet === 'produits' && (
          <div>
            {/* Barre recherche */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:border-[#1B6B3A] outline-none rounded-2xl pl-11 pr-4 py-3 text-sm font-medium transition-colors shadow-sm"
                />
              </div>
              <p className="text-xs text-gray-400 font-medium self-center">
                {produitsFiltres.length} article{produitsFiltres.length > 1 ? 's' : ''} disponible{produitsFiltres.length > 1 ? 's' : ''}
              </p>
            </div>

            {produitsFiltres.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                <span className="material-symbols-outlined text-5xl text-gray-200 mb-4 block">inventory_2</span>
                <p className="font-bold text-gray-500">Aucun article trouvé</p>
                {search && <button onClick={() => setSearch('')} className="text-xs text-[#1B6B3A] font-bold mt-2 hover:underline">Effacer la recherche</button>}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {produitsFiltres.map(p => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    boutiqueNom={boutique.nom}
                    ajouterAuPanier={ajouterAuPanier}
                    estDansPanier={estDansPanier}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AVIS ── */}
        {onglet === 'avis' && (
          reviewsLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Résumé */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
                  <div className="text-center mb-6">
                    <p className="text-[64px] font-extrabold text-gray-900 leading-none">
                      {reviewsData.avg_rating > 0 ? reviewsData.avg_rating.toFixed(1) : '—'}
                    </p>
                    <div className="flex justify-center gap-0.5 my-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-symbols-outlined text-[22px] ${i < Math.round(reviewsData.avg_rating) ? 'text-amber-400' : 'text-gray-200'}`}>star</span>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {reviewsData.total_reviews} avis vérifiés
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {[5, 4, 3, 2, 1].map(n => {
                      const pct = reviewsData.distribution[n]?.pct || 0
                      return (
                        <div key={n} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gray-600 w-3 shrink-0">{n}</span>
                          <span className="material-symbols-outlined text-amber-400 text-[13px]">star</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 w-8 text-right">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Liste des avis */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {reviews.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                    <span className="material-symbols-outlined text-5xl text-gray-200 mb-4 block">rate_review</span>
                    <p className="font-bold text-gray-500 mb-1">Aucun avis pour le moment</p>
                    <p className="text-xs text-gray-400">Soyez le premier à évaluer cette boutique après votre achat</p>
                  </div>
                ) : reviews.map((avis, i) => (
                  <div key={avis.id || i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
                    <img
                      src={avis.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(avis.user?.name || 'A')}&background=1B6B3A&color=fff&size=100`}
                      alt={avis.user?.name}
                      className="w-12 h-12 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-sm text-gray-900">{avis.user?.name || 'Client anonyme'}</h4>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(avis.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className={`material-symbols-outlined text-[14px] ${j < avis.rating ? 'text-amber-400' : 'text-gray-200'}`}>star</span>
                        ))}
                      </div>
                      {avis.comment && (
                        <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{avis.comment}&rdquo;</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* ── À PROPOS ── */}
        {onglet === 'infos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Description détaillée */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-extrabold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1B6B3A] text-[22px]">auto_stories</span>
                Notre histoire
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {boutique.description || 'Aucune description disponible pour cette boutique.'}
              </p>
            </div>

            {/* Infos pratiques */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="font-extrabold text-gray-900 text-base mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1B6B3A] text-[20px]">contact_page</span>
                  Informations
                </h2>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: 'location_on', label: 'Localisation', val: boutique.localisation },
                    { icon: 'storefront', label: 'Catégorie', val: boutique.categorie },
                    { icon: 'person', label: 'Vendeur', val: boutique.proprietaire },
                    { icon: 'calendar_month', label: 'Membre depuis', val: boutique.membreDepuis || '—' },
                  ].map((info, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[17px] text-gray-400">{info.icon}</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{info.label}</p>
                        <p className="text-sm font-semibold text-gray-800">{info.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Réseaux sociaux */}
              {(boutique.whatsapp || boutique.instagram) && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h2 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1B6B3A] text-[20px]">share</span>
                    Réseaux & Contact
                  </h2>
                  <div className="flex flex-col gap-3">
                    {boutique.whatsapp && (
                      <a href={`https://wa.me/${boutique.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-green-50 hover:bg-green-100 transition-colors px-4 py-3 rounded-2xl border border-green-100">
                        <span className="material-symbols-outlined text-green-600 text-[20px]">chat</span>
                        <span className="text-sm font-bold text-gray-700">{boutique.whatsapp}</span>
                      </a>
                    )}
                    {boutique.instagram && (
                      <a href={`https://instagram.com/${boutique.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-pink-50 hover:bg-pink-100 transition-colors px-4 py-3 rounded-2xl border border-pink-100">
                        <span className="material-symbols-outlined text-pink-500 text-[20px]">photo_camera</span>
                        <span className="text-sm font-bold text-gray-700">{boutique.instagram}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
