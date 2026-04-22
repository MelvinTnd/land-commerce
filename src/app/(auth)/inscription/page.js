'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function InscriptionPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nom: '', email: '', tel: '', password: '', type: 'acheteur' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: form.nom,
          email: form.email,
          phone: form.tel || null,
          password: form.password,
          password_confirmation: form.password,
          role: form.type === 'artisan' ? 'vendeur' : 'acheteur'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0]
          throw new Error(firstError)
        }
        throw new Error(data.message || "Une erreur est survenue lors de l'inscription")
      }

      // Inscription réussie → créer la session NextAuth automatiquement
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        // Connexion auto échouée mais inscription ok — on redirige quand même
        router.push('/connexion')
        return
      }

      // Redirection en fonction du type de compte choisi
      router.refresh()
      if (form.type === 'artisan') {
        router.push('/inscription-vendeur')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Connexion Google via NextAuth
  const handleGoogleSignIn = () => {
    setLoadingGoogle(true)
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">

      {/* Left Panel - Hero */}
      <div className="hidden md:flex flex-col relative w-full md:w-[45%] lg:w-[40%] bg-[#1B6B3A] overflow-hidden">
        {/* Background Image with Green Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-50"
          style={{ backgroundImage: `url("https://images.unsplash.com/photo-1544208365-d69806b9bba0?auto=format&fit=crop&w=1000&q=80")` }}
        ></div>
        {/* Additional gradient for smoothing */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B6B3A] via-transparent to-[#1B6B3A]/80"></div>

        <div className="relative z-10 flex flex-col h-full p-10 lg:p-14">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-12 h-12 relative rounded-xl bg-white/10 p-1 overflow-hidden">
              <Image src="/logo.png" alt="BéninMarket" fill className="object-contain" sizes="48px" />
            </div>
            <span className="font-extrabold text-white text-2xl tracking-tighter">
              BéninMarket
            </span>
          </div>

          {/* Main Content */}
          <div className="mt-auto mb-20 lg:mb-32">
            <h1 className="text-[40px] lg:text-[56px] font-extrabold text-[#D2F4DE] leading-[1.1] mb-6 tracking-tight">
              L'héritage du<br />
              Bénin à<br />
              portée de<br />
              main.
            </h1>
            <p className="text-[#a1dfbe] text-lg max-w-sm leading-relaxed font-medium">
              Rejoignez la première place de marché dédiée à l'artisanat d'excellence et aux produits authentiques du Dahomey.
            </p>
          </div>

          {/* Footer Avatars */}
          <div className="flex items-center gap-4 mt-auto">
            <div className="flex -space-x-3">
              {[
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop',
              ].map((src, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1B6B3A] overflow-hidden relative">
                  <Image
                    src={src}
                    alt={`Artisan ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ))}
            </div>
            <span className="text-sm text-[#A0D9B9] font-medium">+2,500 artisans nous font confiance</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center bg-[#F9FAFA] p-8 sm:p-12 lg:p-20 relative overflow-y-auto">
        <div className="max-w-[500px] w-full mx-auto">

          <div className="mb-10">
            <h2 className="text-[32px] font-extrabold text-[#111827] tracking-tight mb-2">Créer un compte</h2>
            <p className="text-sm font-medium text-gray-500">Prêt à découvrir ou à vendre le meilleur du Bénin ?</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Account Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'acheteur' })}
                className={`relative flex flex-col items-center justify-center py-6 px-4 rounded-[16px] transition-all duration-200 border-2 ${form.type === 'acheteur' ? 'bg-white border-[#1B6B3A] shadow-sm' : 'bg-gray-100 border-transparent text-gray-400'}`}
              >
                {form.type === 'acheteur' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#1B6B3A] rounded-full flex items-center justify-center text-white shadow-sm">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${form.type === 'acheteur' ? 'bg-[#D2F4DE] text-[#1B6B3A]' : 'bg-gray-200 text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                </div>
                <span className={`text-[13px] font-bold ${form.type === 'acheteur' ? 'text-gray-900' : 'text-gray-500'}`}>Je suis un acheteur</span>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'artisan' })}
                className={`relative flex flex-col items-center justify-center py-6 px-4 rounded-[16px] transition-all duration-200 border-2 ${form.type === 'artisan' ? 'bg-white border-[#1B6B3A] shadow-sm' : 'bg-gray-100 border-transparent'}`}
              >
                {form.type === 'artisan' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#1B6B3A] rounded-full flex items-center justify-center text-white shadow-sm">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${form.type === 'artisan' ? 'bg-[#D2F4DE] text-[#1B6B3A]' : 'bg-gray-200 text-gray-500'}`}>
                  <span className="material-symbols-outlined text-[24px]">storefront</span>
                </div>
                <span className={`text-[13px] font-bold ${form.type === 'artisan' ? 'text-gray-900' : 'text-gray-500'}`}>Je suis un artisan</span>
              </button>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Nom complet</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">person</span>
                <input
                  type="text"
                  placeholder="Ex: Koffi Mensah"
                  className="w-full bg-[#EAECEE] text-sm font-medium pl-12 pr-4 py-3.5 rounded-[12px] border border-transparent outline-none focus:border-[#1B6B3A] focus:bg-white transition-colors"
                  value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none">mail</span>
                <input
                  type="email"
                  placeholder="koffi@exemple.bj"
                  className="w-full bg-[#EAECEE] text-sm font-medium pl-12 pr-4 py-3.5 rounded-[12px] border border-transparent outline-none focus:border-[#1B6B3A] focus:bg-white transition-colors"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Téléphone <span className="text-gray-400 font-normal">(optionnel)</span></label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-[#EAECEE] pl-4 pr-3 py-3.5 rounded-[12px] border border-transparent shrink-0">
                  <span className="text-base leading-none">🇧🇯</span>
                  <span className="text-sm font-bold text-gray-700">+229</span>
                </div>
                <input
                  type="tel"
                  placeholder="01 00 00 00 00"
                  className="w-full bg-[#EAECEE] text-sm font-medium px-4 py-3.5 rounded-[12px] border border-transparent outline-none focus:border-[#1B6B3A] focus:bg-white transition-colors"
                  value={form.tel} onChange={e => setForm({ ...form, tel: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="w-full bg-[#EAECEE] text-sm font-extrabold tracking-widest pl-12 pr-12 py-3.5 rounded-[12px] border border-transparent outline-none focus:border-[#1B6B3A] focus:bg-white transition-colors"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 mt-2">
              <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1B6B3A] focus:ring-[#1B6B3A]" />
              <label htmlFor="terms" className="text-[11px] text-gray-500 font-medium leading-relaxed">
                J'accepte les <Link href="/cgu" className="font-bold text-[#1B6B3A] hover:underline">Conditions Générales d'Utilisation</Link> et la <Link href="/confidentialite" className="font-bold text-[#1B6B3A] hover:underline">Politique de Confidentialité</Link> de BéninMarket.
              </label>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 text-red-500 text-sm font-bold p-4 rounded-[12px] border border-red-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button disabled={loading} className="w-full bg-[#004e2c] hover:bg-[#134e29] text-white font-bold text-[15px] py-4 rounded-[100px] mt-4 flex justify-center items-center gap-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Création en cours...' : 'Créer mon compte'}
              {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-10 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2 flex items-center gap-3 ml-auto z-10">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 rounded-full bg-[#FFCC00] flex items-center justify-center font-extrabold text-[6px] text-[#003366]">MTN</div>
                <div className="w-6 h-6 rounded-full bg-[#0066CC] flex items-center justify-center font-extrabold text-[6px] text-white">Moov</div>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-extrabold text-gray-800 uppercase leading-none">Paiements sécurisés</span>
                <span className="text-[7px] text-gray-500 uppercase">Via Mobile Money</span>
              </div>
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 bg-[#F9FAFA] px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Ou s'inscrire avec
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-1 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle}
              className="flex items-center justify-center gap-3 py-3.5 bg-white border border-gray-200 rounded-[12px] hover:bg-gray-50 transition-colors disabled:opacity-70 shadow-sm"
            >
              <div className="w-5 h-5 relative shrink-0">
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  fill
                  className="object-contain"
                  sizes="20px"
                />
              </div>
              <span className="text-[13px] font-bold text-gray-800">
                {loadingGoogle ? 'Redirection...' : "Continuer avec Google"}
              </span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm font-medium text-gray-500 mt-10">
            Déjà membre ? <Link href="/connexion" className="font-bold text-[#1B6B3A] hover:underline">Connectez-vous ici</Link>
          </p>

        </div>
      </div>
    </div>
  )
}
