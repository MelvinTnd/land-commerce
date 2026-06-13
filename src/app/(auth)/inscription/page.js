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
          role: form.type === 'vendeur' ? 'vendeur' : 'acheteur'
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

      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (result?.error) {
        router.push('/connexion')
        return
      }

      const sessionRes = await fetch('/api/auth/session')
      const freshSession = await sessionRes.json()
      if (freshSession?.user?.apiToken) {
        localStorage.setItem('auth_token', freshSession.user.apiToken)
        localStorage.setItem('user', JSON.stringify({
          id: freshSession.user.id,
          name: freshSession.user.name,
          email: freshSession.user.email,
          role: freshSession.user.role,
        }))
      }

      router.refresh()
      if (form.type === 'vendeur') {
        router.push('/inscription-vendeur')
      } else {
        router.push('/compte')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true)
    try {
      await signIn('google', { callbackUrl: '/compte' })
    } catch (err) {
      setError("Erreur de connexion Google : " + err.message)
      setLoadingGoogle(false)
    }
  }

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left panel - Image (Shopify Style) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200"
          alt="Shopping expérience"
          fill
          className="object-cover object-center opacity-80"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <div className="absolute bottom-20 left-12 right-12 text-white">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
            Vendez et achetez<br/>l'excellence.
          </h2>
          <p className="text-lg text-white/90 font-medium max-w-lg mb-8">
            Rejoignez des créateurs talentueux et des clients passionnés par notre savoir-faire local.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop',
              ].map((src, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 overflow-hidden relative">
                  <Image src={src} alt="Utilisateur" fill className="object-cover" sizes="40px" />
                </div>
              ))}
            </div>
            <div className="text-sm font-bold text-white">
              +5,000 artisans
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-12">
          <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex mb-6">
            <Link href="/">
              <div className="w-14 h-14 relative">
                <Image src="/logo.png" alt="CauriMarket" fill className="object-contain" sizes="56px" />
              </div>
            </Link>
          </div>

          <h1 className="text-3xl font-extrabold text-[#202223] mb-2 tracking-tight">Créer un compte</h1>
          <p className="text-sm text-[#6d7175] mb-8">
            Vous avez déjà un compte ?{' '}
            <Link href="/connexion" className="font-medium text-[#008060] hover:underline">
              Se connecter
            </Link>
          </p>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-md flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Account Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#202223] mb-2">
                Type de compte
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: 'acheteur' })}
                  className={`relative flex flex-col items-center justify-center p-3 sm:p-4 border rounded-xl cursor-pointer transition-all ${
                    form.type === 'acheteur' 
                      ? 'border-[#008060] bg-[#f4fdf8] text-[#008060] shadow-[0_0_0_1.5px_#008060]' 
                      : 'border-[#c9cccf] bg-white text-[#6d7175] hover:border-[#8c9196]'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5 focus:outline-none">
                    <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                    <span className="text-sm font-bold">Client</span>
                  </div>
                  {form.type === 'acheteur' && (
                    <span className="material-symbols-outlined absolute top-2 right-2 text-[16px]">check_circle</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: 'vendeur' })}
                  className={`relative flex flex-col items-center justify-center p-3 sm:p-4 border rounded-xl cursor-pointer transition-all ${
                    form.type === 'vendeur' 
                      ? 'border-[#008060] bg-[#f4fdf8] text-[#008060] shadow-[0_0_0_1.5px_#008060]' 
                      : 'border-[#c9cccf] bg-white text-[#6d7175] hover:border-[#8c9196]'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5 focus:outline-none">
                    <span className="material-symbols-outlined text-[24px]">storefront</span>
                    <span className="text-sm font-bold">Vendeur</span>
                  </div>
                  {form.type === 'vendeur' && (
                    <span className="material-symbols-outlined absolute top-2 right-2 text-[16px]">check_circle</span>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1.5">Nom complet</label>
              <input
                type="text"
                required
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="appearance-none block w-full px-4 py-2.5 border border-[#c9cccf] rounded-lg shadow-sm placeholder-[#8c9196] focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-[#008060] sm:text-sm text-[#202223] transition-colors"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1.5">Adresse e-mail</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="appearance-none block w-full px-4 py-2.5 border border-[#c9cccf] rounded-lg shadow-sm placeholder-[#8c9196] focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-[#008060] sm:text-sm text-[#202223] transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1.5">
                Téléphone <span className="text-[#6d7175] font-normal">(optionnel)</span>
              </label>
              <input
                type="tel"
                value={form.tel}
                onChange={(e) => {
                  const val = e.target.value;
                  // Only allow digits, space, and + at the beginning or -
                  if (/^[0-9+ \-]*$/.test(val)) {
                    setForm({ ...form, tel: val });
                  }
                }}
                className="appearance-none block w-full px-4 py-2.5 border border-[#c9cccf] rounded-lg shadow-sm placeholder-[#8c9196] focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-[#008060] sm:text-sm text-[#202223] transition-colors"
                placeholder="+229 01 00 00 00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="appearance-none block w-full px-4 py-2.5 border border-[#c9cccf] rounded-lg shadow-sm placeholder-[#8c9196] focus:outline-none focus:ring-2 focus:ring-[#008060] focus:border-[#008060] sm:text-sm text-[#202223] transition-colors pr-11"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6d7175] hover:text-[#202223] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#008060] hover:bg-[#006e52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008060] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Création...' : 'S\'inscrire'}
              </button>
            </div>
            
            <p className="text-xs text-[#6d7175] text-center mt-4">
              En vous inscrivant, vous acceptez nos{' '}
              <Link href="/cgu" className="text-[#008060] hover:underline">Conditions d'utilisation</Link>.
            </p>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e1e3e5]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-[#6d7175] font-medium">Ou avec</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleGoogleSignIn}
                disabled={loadingGoogle}
                className="w-full flex justify-center items-center py-3 px-4 border border-[#c9cccf] rounded-lg shadow-sm bg-white text-sm font-bold text-[#202223] hover:bg-[#f4f6f8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008060] disabled:opacity-60 transition-colors"
              >
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} className="mr-3" />
                {loadingGoogle ? 'Redirection...' : 'Continuer avec Google'}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
