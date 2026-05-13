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

    const token = session?.user?.apiToken || (typeof window !== 'undefined' && localStorage.getItem('auth_token'))
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
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la création')
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
      <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-green-100">
          <div className="w-24 h-24 bg-gradient-to-br from-[#0B7A3E] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
            <span className="material-symbols-outlined text-white text-[52px]">check_circle</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">🎉 Boutique créée !</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            <strong className="text-gray-800">{shopName}</strong> est maintenant en ligne sur BéninMarket.
            Commencez à ajouter vos produits !
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/vendeur"
              className="inline-flex items-center justify-center gap-2 bg-[#0B4A26] hover:bg-[#073319] text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all">
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              Mon tableau de bord
            </Link>
            <Link href="/"
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium py-2">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ─── Formulaire ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F9F8] py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#0B7A3E] font-bold text-sm mb-6 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Retour à l&apos;accueil
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Créer ma boutique</h1>
          <p className="text-gray-500 text-sm mt-2">Quelques infos pour lancer votre espace de vente sur BéninMarket.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── PREVIEW BANNIÈRE ─────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Bannière */}
            <div
              className="relative h-40 bg-gradient-to-r from-[#0B4A26] to-[#0B7A3E] cursor-pointer group"
              onClick={() => bannerRef.current?.click()}
            >
              {bannerPreview
                ? <Image src={bannerPreview} alt="Bannière" fill className="object-cover" />
                : null
              }
              <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all
                ${bannerPreview ? 'bg-black/40 opacity-0 group-hover:opacity-100' : 'bg-black/20'}`}>
                <span className="material-symbols-outlined text-white text-[32px]">add_photo_alternate</span>
                <span className="text-white text-xs font-bold tracking-wider">
                  {bannerPreview ? 'CHANGER LA BANNIÈRE' : 'AJOUTER UNE BANNIÈRE'}
                </span>
              </div>
              <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
            </div>

            {/* Logo + nom preview */}
            <div className="px-6 pb-5">
              <div className="flex items-end gap-4 -mt-8 mb-4">
                {/* Logo cliquable */}
                <div
                  className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-md cursor-pointer group shrink-0"
                  onClick={() => logoRef.current?.click()}
                >
                  {logoPreview
                    ? <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-[#0B7A3E] to-[#059669] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[28px]">storefront</span>
                      </div>
                  }
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-[20px]">edit</span>
                  </div>
                  <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                </div>
                <div className="pb-1">
                  <p className="font-extrabold text-gray-900 text-base">{shopName || 'Nom de votre boutique'}</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    {ville}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#0B7A3E]">info</span>
                Cliquez sur le logo ou la bannière pour les modifier
              </p>
            </div>
          </div>

          {/* ── INFOS PRINCIPALES ────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0B7A3E] text-[18px]">storefront</span>
              Informations de la boutique
            </h2>

            {/* Erreur globale */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-2xl border border-red-100">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* Nom */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Nom de la boutique <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Les Tissages d'Abomey"
                className="w-full bg-[#F7F9F8] border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B7A3E] focus:bg-white transition-all"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Description <span className="text-gray-400 font-normal normal-case">(optionnel)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Décrivez votre boutique, votre savoir-faire, vos produits..."
                className="w-full bg-[#F7F9F8] border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B7A3E] focus:bg-white transition-all resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <p className="text-right text-xs text-gray-400 mt-1">{description.length} caractères</p>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Catégorie</label>
              <div className="relative">
                <select
                  className="w-full bg-[#F7F9F8] border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 appearance-none focus:outline-none focus:border-[#0B7A3E] focus:bg-white transition-all cursor-pointer"
                  value={categorie}
                  onChange={e => setCategorie(e.target.value)}
                >
                  <option value="">-- Choisir une catégorie --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
              </div>
            </div>

            {/* Ville */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Ville</label>
              <div className="flex flex-wrap gap-2">
                {VILLES.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setVille(city)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      ville === city
                        ? 'bg-[#0B4A26] text-white shadow-sm scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── CONTACT & RÉSEAUX ─────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0B7A3E] text-[18px]">share</span>
              Contact & Réseaux sociaux
              <span className="text-gray-400 font-normal text-xs">(optionnel)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Business</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-green-600 text-[18px]">chat</span>
                  <input
                    type="tel"
                    placeholder="+229 97 00 00 00"
                    className="w-full bg-[#F7F9F8] border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B7A3E] transition-all"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                  />
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Instagram</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-500 text-[18px]">photo_camera</span>
                  <input
                    type="text"
                    placeholder="@votre_boutique"
                    className="w-full bg-[#F7F9F8] border border-gray-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0B7A3E] transition-all"
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── BOUTON SUBMIT ─────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0B4A26] to-[#0B7A3E] hover:from-[#073319] hover:to-[#0B4A26] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/25"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                Création en cours...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">add_business</span>
                Créer ma boutique
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  )
}
