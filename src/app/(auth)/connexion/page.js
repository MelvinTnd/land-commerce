'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function ConnexionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/compte'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          throw new Error('Email ou mot de passe incorrect.')
        }
        throw new Error(result.error)
      }

      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      const role = session?.user?.role

      if (session?.user?.apiToken) {
        localStorage.setItem('auth_token', session.user.apiToken)
        localStorage.setItem('user', JSON.stringify({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        }))
      }

      if (role === 'vendeur') {
        router.push('/vendeur')
      } else if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push(callbackUrl)
      }
      router.refresh()
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
      setError("Erreur de connexion : " + err.message)
      setLoadingGoogle(false)
    }
  }

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left panel - Image (Shopify Style) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#f4f6f8] items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=1200"
          alt="Artisanat local"
          fill
          className="object-cover opacity-90"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-md tracking-tight">CauriMarket</h2>
          <p className="text-lg text-white/90 font-medium drop-shadow-sm max-w-lg">
            Gérez vos achats, trouvez des trésors locaux et suivez vos artisans préférés.
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-1/2 h-screen overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-12 lg:px-24">
          <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex mb-8">
            <Link href="/" className="font-black text-[24px] tracking-tight" style={{ color: '#0D0D0D' }}>
              Cauri<span style={{ color: '#1B6B3A' }}>Market</span>
            </Link>
          </div>

          <h1 className="text-3xl font-extrabold text-[#202223] mb-2 tracking-tight">Connexion</h1>
          <p className="text-sm text-[#6d7175] mb-8">
            Nouveau sur CauriMarket ?{' '}
            <Link href="/inscription" className="font-medium text-[#008060] hover:underline">
              Créer un compte
            </Link>
          </p>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-md flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1.5">
                Adresse e-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-2.5 border border-[#c9cccf] rounded-lg shadow-sm placeholder-[#8c9196] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A] focus:border-[#1B6B3A] sm:text-sm text-[#202223] transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-[#202223]">
                  Mot de passe
                </label>
                <Link href="/mot-de-passe-oublie" className="text-sm font-medium text-[#008060] hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-2.5 border border-[#c9cccf] rounded-lg shadow-sm placeholder-[#8c9196] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A] focus:border-[#1B6B3A] sm:text-sm text-[#202223] transition-colors pr-11"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6d7175] hover:text-[#202223] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black uppercase tracking-widest text-white bg-[#1B6B3A] hover:bg-[#155a30] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e1e3e5]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-[#6d7175] font-medium">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleGoogleSignIn}
                disabled={loadingGoogle}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 bg-white text-sm font-bold text-[#202223] hover:bg-[#f4f6f8] focus:outline-none transition-colors disabled:opacity-60"
              >
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} className="mr-3" />
                {loadingGoogle ? 'Connexion...' : 'Google'}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  )
}