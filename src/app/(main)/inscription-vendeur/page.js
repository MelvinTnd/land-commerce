'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const VILLES = ['Cotonou', 'Porto-Novo', 'Abomey', 'Parakou', 'Natitingou', 'Bohicon']
const CATEGORIES = ['Artisanat', 'Mode & Textile', 'Alimentation & Épices', 'Art & Décoration', 'Bijoux', 'Cosmétiques naturels']

export default function InscriptionVendeur() {
  const router = useRouter()
  const { data: session } = useSession()

  // Champs de base
  const [shopName, setShopName]       = useState('')
  const [description, setDescription] = useState('')
  const [ville, setVille]             = useState('Cotonou')
  const [categorie, setCategorie]     = useState('')
  const [whatsapp, setWhatsapp]       = useState('')
  const [instagram, setInstagram]     = useState('')

  // Upload images
  const [logoFile, setLogoFile]         = useState(null)
  const [logoPreview, setLogoPreview]   = useState(null)
  const [bannerFile, setBannerFile]     = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)

  const logoRef   = useRef()
  const bannerRef = useRef()

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  // ─── Handlers images ───────────────────────────────────────────────────────
  const handleLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleBanner = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerFile(file)
    setBannerPreview(URL.createObjectURL(file))
  }

  // ─── Soumission ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!shopName.trim()) { setError('Le nom de la boutique est requis.'); return }

    // Priorité à localStorage (token frais), fallback sur la session NextAuth
    const token = (typeof window !== 'undefined' && localStorage.getItem('auth_token')) || session?.user?.apiToken
    if (!token) { router.push('/connexion'); return }

    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api'

      // Utiliser FormData pour envoyer les images
      const form = new FormData()
      form.append('name', shopName)
      form.append('location', ville)
      form.append('description', description)
      if (categorie) form.append('category', categorie)
      if (whatsapp)  form.append('whatsapp', whatsapp)
      if (instagram) form.append('instagram', instagram)
      if (logoFile)  form.append('logo', logoFile)
      if (bannerFile) form.append('banner', bannerFile)

      const res = await fetch(`${apiUrl}/shops`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // Ne pas mettre Content-Type ici pour laisser le boundary FormData s'ajouter automatiquement
        },
        body: form,
      })

      const data = await res.json()

      if (!res.ok) {
        // Token invalide/expiré → rediriger vers la connexion
        if (res.status === 401) {
          localStorage.removeItem('auth_token')
          router.push('/connexion')
          return
        }
        throw new Error(data.message || 'Erreur lors de la création')
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ─── Écran de succès ───────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#F1F2F4] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-8 max-w-sm w-full text-center border border-gray-200">
          <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#008060]/20">
            <span className="material-symbols-outlined text-[#008060] text-[32px]">check_circle</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Boutique créée</h1>
          <p className="text-gray-500 text-[13px] mb-6 leading-relaxed">
            <strong className="text-gray-800">{shopName}</strong> est maintenant en ligne. Ajoutez vos premiers articles pour commencer à vendre.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/vendeur"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2.5 rounded-lg font-semibold text-[13px] transition-colors border border-transparent shadow-sm">
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              Tableau de bord
            </Link>
            <Link href="/"
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-semibold text-[13px] transition-colors border border-gray-200 shadow-sm">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ─── Formulaire ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F1F2F4] py-12 px-4">
      <div className="max-w-[540px] mx-auto">

        {/* Header */}
        <div className="mb-6 flex flex-col items-start">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[#008060] font-semibold text-[13px] mb-4 hover:underline">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Configurez votre boutique</h1>
          <p className="text-gray-500 text-[13px] mt-1">Personnalisez votre espace vendeur sur CauriMarket.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── DESIGN DE LA BOUTIQUE ─────────────────────────────────────────── */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h2 className="text-[14px] font-bold text-gray-900 mb-4">Profil visuel</h2>
            
            <div className="flex gap-5">
              {/* Logo */}
              <div className="flex flex-col items-center">
                <div
                  className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 cursor-pointer group shrink-0"
                  onClick={() => logoRef.current?.click()}
                >
                  {logoPreview
                    ? <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                    : <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-[24px]">storefront</span>
                      </div>
                  }
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-[18px]">add_photo_alternate</span>
                  </div>
                  <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                </div>
                <span className="text-[11px] font-semibold text-gray-500 mt-2">Logo</span>
              </div>

              {/* Bannière */}
              <div className="flex-[1]">
                <div
                  className="relative h-20 w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-200 cursor-pointer group"
                  onClick={() => bannerRef.current?.click()}
                >
                  {bannerPreview
                    ? <Image src={bannerPreview} alt="Bannière" fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-[24px]">landscape</span>
                      </div>
                  }
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-[18px]">add_photo_alternate</span>
                  </div>
                  <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
                </div>
                <span className="text-[11px] font-semibold text-gray-500 mt-2 block">Bannière</span>
              </div>
            </div>
          </div>

          {/* ── INFOS PRINCIPALES ────────────────────────────────────────── */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
            <h2 className="text-[14px] font-bold text-gray-900 mb-1">Détails de la boutique</h2>

            {/* Erreur globale */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-[13px] font-medium px-3 py-2 rounded-lg border border-red-200">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}

            {/* Nom */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                Nom de la boutique <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Les Tissages d'Abomey"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[13px] text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-[#008060] transition-shadow"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                Description <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Décrivez ce que vous vendez..."
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[13px] text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-[#008060] transition-shadow resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <p className="text-right text-[11px] text-gray-500 mt-1">{description.length} caractères</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Catégorie */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Catégorie <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[13px] text-gray-900 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-[#008060]"
                    value={categorie}
                    onChange={e => setCategorie(e.target.value)}
                    required
                  >
                    <option value="">Sélectionner</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[18px]">unfold_more</span>
                </div>
              </div>

              {/* Ville */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Ville <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-[13px] text-gray-900 appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-[#008060]"
                    value={ville}
                    onChange={e => setVille(e.target.value)}
                    required
                  >
                    {VILLES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[18px]">unfold_more</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTACT & RÉSEAUX ─────────────────────────────────────────── */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
            <h2 className="text-[14px] font-bold text-gray-900 mb-1">Contacts publics</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">WhatsApp <span className="text-gray-400 font-normal">(optionnel)</span></label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-gray-400 text-[16px]">chat</span>
                  <input
                    type="tel"
                    placeholder="+229 97 00 00 00"
                    className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-[13px] text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-[#008060]"
                    value={whatsapp}
                    onChange={e => {
                      const val = e.target.value;
                      if (/^[0-9+ \-]*$/.test(val)) setWhatsapp(val);
                    }}
                  />
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Instagram <span className="text-gray-400 font-normal">(optionnel)</span></label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-gray-400 text-[16px]">photo_camera</span>
                  <input
                    type="text"
                    placeholder="@votre_boutique"
                    className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-[13px] text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-[#008060]"
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── BOUTON SUBMIT ─────────────────────────────────────────────── */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[14px] py-2.5 rounded-lg shadow-sm border border-transparent flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  Création...
                </>
              ) : (
                <>Enregistrer la boutique</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
