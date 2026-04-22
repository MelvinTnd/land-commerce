'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function ConnexionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

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
        // Mapper les erreurs NextAuth en messages lisibles
        if (result.error === 'CredentialsSignin') {
          throw new Error('Email ou mot de passe incorrect.')
        }
        throw new Error(result.error)
      }

      // Redirection selon le rôle (récupéré via la session)
      // On fait une requête pour récupérer la session fraîche
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      const role = session?.user?.role

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
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: '#F6F6F6',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30H15L30 0zm0 60L15 30h30L30 60zM0 30l30-15v30L0 30zm60 0L30 45V15l30 15z' fill='%231B6B3A' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }}
    >
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div
          className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white"
          style={{ borderRadius: '2.5rem', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.1)' }}
        >
          {/* Côté gauche — branding */}
          <div
            className="hidden lg:flex lg:col-span-5 flex-col justify-between p-16 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #004e2c 100%)' }}
          >
            {/* Decoration circles */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #92febc, transparent)' }} />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #F5B731, transparent)' }} />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 relative rounded-xl bg-white/10 p-1 overflow-hidden">
                <Image src="/logo.png" alt="BéninMarket" fill className="object-contain" sizes="40px" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">BéninMarket</span>
            </div>

            {/* Main text */}
            <div className="relative z-10">
              <h1 className="text-[42px] lg:text-[48px] font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                Bienvenue<br />de retour !
              </h1>
              <p className="text-white/70 text-base leading-relaxed max-w-xs mb-10">
                Connectez-vous pour retrouver vos artisans favoris, suivre vos commandes et explorer de nouveaux trésors.
              </p>

              {/* Avatars */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop',
                  ].map((src, i) => (
                    <div key={i} className="w-10 h-10 rounded-full overflow-hidden border-2 relative" style={{ borderColor: '#1B6B3A' }}>
                      <Image src={src} alt={`Artisan ${i + 1}`} fill className="object-cover" sizes="40px" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  +2 500 membres actifs
                </span>
              </div>
            </div>

            {/* Image décorative */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 opacity-60 pointer-events-none">
              <div className="absolute inset-0 z-10 rounded-full" style={{ background: 'linear-gradient(to top, rgba(27,107,58,0.8), transparent)' }} />
              <div className="relative w-full h-full rounded-full overflow-hidden" style={{ transform: 'rotate(12deg) scale(1.1)' }}>
                <Image
                  src="https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=400"
                  alt="Artisanat béninois"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
            </div>
          </div>

          {/* Côté droit — formulaire */}
          <div className="lg:col-span-7 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div className="max-w-[380px] w-full mx-auto">

              <h2 className="text-[28px] font-extrabold tracking-tight mb-1" style={{ color: '#1A1A1A' }}>
                Connexion
              </h2>
              <p className="text-sm font-medium mb-10" style={{ color: '#9CA3AF' }}>
                Pas encore de compte ?{' '}
                <Link href="/inscription" className="font-bold text-[#1B6B3A] hover:underline">
                  S'inscrire
                </Link>
              </p>

              {/* Bouton Google */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loadingGoogle}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-full font-bold text-sm transition-all hover:bg-gray-50 mb-8 disabled:opacity-70"
                style={{
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  color: '#1A1A1A',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <div className="w-5 h-5 relative shrink-0">
                  <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" fill className="object-contain" sizes="20px" />
                </div>
                {loadingGoogle ? 'Redirection...' : 'Continuer avec Google'}
              </button>

              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100" />
                </div>
                <span className="relative px-4 text-[10px] font-bold uppercase tracking-widest" style={{ background: 'white', color: '#9CA3AF' }}>
                  Ou par email
                </span>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-500 text-sm font-bold p-4 rounded-[12px] border border-red-100 mb-6">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  {error}
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Adresse email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none">mail</span>
                    <input
                      type="email"
                      placeholder="votre@email.bj"
                      className="w-full bg-[#F7F5F0] text-sm font-medium pl-12 pr-4 py-3.5 rounded-[12px] border border-transparent outline-none focus:border-[#1B6B3A] focus:bg-white transition-colors"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700">Mot de passe</label>
                    <Link href="/mot-de-passe-oublie" className="text-xs font-bold text-[#1B6B3A] hover:underline">
                      Oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none">lock</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-[#F7F5F0] text-sm font-extrabold tracking-widest pl-12 pr-12 py-3.5 rounded-[12px] border border-transparent outline-none focus:border-[#1B6B3A] focus:bg-white transition-colors"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full font-bold text-[15px] py-4 rounded-[100px] mt-2 flex justify-center items-center gap-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed text-white"
                  style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)' }}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                  {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                </button>
              </form>

              {/* Sécurité */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <span className="material-symbols-outlined text-gray-300 text-[16px]">verified_user</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-300">
                  Connexion 100% sécurisée
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
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