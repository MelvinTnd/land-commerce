'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0]
          throw new Error(firstError)
        }
        throw new Error(data.message || 'Identifiants incorrects')
      }

      localStorage.setItem('auth_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role === 'vendeur') {
        router.push('/vendeur')
      } else if (data.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
            {/* Overlay décoratif */}
            <div
              className="absolute inset-0 opacity-40"
              style={{ background: 'radial-gradient(circle at 0% 0%, #92febc 0%, transparent 70%)' }}
            />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <img src="/logo.png" alt="BéninMarket" className="w-10 h-10 object-contain rounded-xl bg-white/10 p-1" />
              <span className="text-2xl font-extrabold text-white tracking-tight">
                BéninMarket
              </span>
            </div>

            {/* Texte central */}
            <div className="relative z-10">
              <h1 className="text-5xl font-extrabold text-white leading-tight mb-8 tracking-tight">
                L'héritage Béninois{' '}
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>à votre portée.</span>
              </h1>
              <p className="text-lg mb-10 font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Découvrez une marketplace d'exception célébrant le savoir-faire ancestral et l'artisanat contemporain du Bénin.
              </p>

              {/* Avatars */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDpCuM1raMH_d0yZ4seMOYQeSAXkpCLTGp8PSjBJEqnwjEtefivizDw7wYqIvFGMkRu6XapStFUssIpLwIuedznmegaIr4w4KEIqtoNOrQLpn4bGQLIxwOamAloySaxm2v_62WszW4vc0yj0Pl6AWHxoYIoNM-VgUZzsHhHQ5ASSqF05kBhhq1jZ-Y65gzhmZOuDkPpzO93rYFQAWghChe6Y_UTJrfKlJcZWYf9fwC59HtPheOUIUoZSWVvjKAPot5Fm4RfR71iOZE',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBn86rtc6C63qQaDekp0jAyOU9muzPWYngtXZ9UWkihzwo7nXc_cYCa0n-gPOBF_ffJAZ1Wm5Xx1Bxeutkl7iD9y520ZJVQFepzYlBJMaXPDfY6T-CZdBBhhg1omxXCKtsr5Ue1oYxtJX_Ag8NCw_PxqzKBM-mVQcJpXfYg7kJqUQnZ3Ug8jI109CXSbRTkc-ZrxZAtAuucBkjtnEPWauGROLJNUR0jIH3SLUpTZzJalePs9vAgE_2kllxOFqxHDiYG_8-vcXjRxMY',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuA2afMDoCl0cmLAnabdQvzASiobQIDKTOHjMNApDH87KmPjBzS_aicU6F06AckemvVfID8xB7JCB2oZmGUmEK0J1IzR4koyPOa9oMfT3ShMuNEUo3_YpuKqhrcLiAYayg_v5WvYUpnBCKIwCLyzE_wjTeQ-E8J9REMsow_PJ2Vt-fqHPkZV8pKrLK1FNNbrKwCHqmA3sxA5asR_V6XEbJFP-w8_l8183VSoaxqbmf0fBRORTIRkXaWjkgGAWbu73U6fUO4lDFOfNvw',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Artisan ${i + 1}`}
                      className="w-10 h-10 rounded-full object-cover"
                      style={{ border: '2px solid #1B6B3A' }}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  +2k Artisans passionnés
                </span>
              </div>
            </div>

            {/* Bas */}
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-0.5 w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.3em' }}
              >
                Egun Heritage Design
              </span>
            </div>

            {/* Image décorative */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 opacity-60 pointer-events-none">
              <div
                className="absolute inset-0 z-10 rounded-full"
                style={{ background: 'linear-gradient(to top, rgba(27,107,58,0.8), transparent)' }}
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQWt3NsHUOOcKgwDibsPPLilYMKO3ygaYWDdvHdsDg4LCV8TJwv0kSw5EGxRz7o_NoxtE39htKAzNOxFGDp8W7asYbM-Txolc1fRRmELgtKN-uGOi83rb0agNO706CIkerjUB4zKOMWpk7o6y6n1j30_lGgaxXcWLNJU38_Gf36l2xgHxgk9E65T8yx1xkIlN5pBnGaqj_mQWuEuzF-xXWpPd6aBEsJh6a-N9i44F-1H2mNrddeHLM_TUvy7dHjVida3nsiXz3e9E"
                alt="Artisanat béninois"
                className="w-full h-full object-cover rounded-full"
                style={{ transform: 'rotate(12deg) scale(1.1)' }}
              />
            </div>
          </div>

          {/* Côté droit — formulaire */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-20 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">

              {/* Titre */}
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: '#1A1A1A' }}>
                  Bon retour
                </h2>
                <p className="text-base font-medium" style={{ color: '#6B7280' }}>
                  Accédez à l'artisanat d'exception du Bénin
                </p>
              </div>

              {/* Bouton Google */}
              <button
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-full font-bold text-sm transition-all hover:bg-gray-50 mb-8"
                style={{
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  color: '#1A1A1A',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continuer avec Google
              </button>

              {/* Séparateur */}
              <div className="relative flex items-center mb-8">
                <div className="flex-grow border-t" style={{ borderColor: '#F0EDE8' }} />
                <span
                  className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-widest"
                  style={{ color: '#9CA3AF' }}
                >
                  OU
                </span>
                <div className="flex-grow border-t" style={{ borderColor: '#F0EDE8' }} />
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Email */}
                <div>
                  <label
                    className="block text-[11px] font-black uppercase tracking-wider mb-2 ml-1"
                    style={{ color: '#9CA3AF' }}
                  >
                    Adresse Email
                  </label>
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ fontSize: '18px', color: '#9CA3AF' }}
                    >
                      mail
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.bj"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all"
                      style={{
                        background: '#F4F4F0',
                        border: '2px solid transparent',
                        color: '#1A1A1A',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#1B6B3A'}
                      onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label
                      className="text-[11px] font-black uppercase tracking-wider"
                      style={{ color: '#9CA3AF' }}
                    >
                      Mot de passe
                    </label>
                    <Link
                      href="/mot-de-passe-oublie"
                      className="text-xs font-bold transition-colors hover:opacity-70"
                      style={{ color: '#1B6B3A' }}
                    >
                      Oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ fontSize: '18px', color: '#9CA3AF' }}
                    >
                      lock
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 rounded-2xl text-sm font-medium outline-none transition-all"
                      style={{
                        background: '#F4F4F0',
                        border: '2px solid transparent',
                        color: '#1A1A1A',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#1B6B3A'}
                      onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: '#9CA3AF' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="bg-red-50 text-red-500 text-sm font-bold p-4 rounded-[12px] border border-red-100 flex items-center gap-2 mb-2 ml-1">
                    <span className="material-symbols-outlined text-[20px]">error</span>
                    {error}
                  </div>
                )}

                {/* Bouton submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-full font-bold text-base text-white flex items-center justify-center gap-3 transition-all hover:opacity-90 hover:-translate-y-0.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: '#1B6B3A',
                    boxShadow: '0 8px 24px rgba(27,107,58,0.3)',
                  }}
                >
                  {loading ? 'Connexion en cours...' : "Se connecter à l'espace client"}
                  {!loading && (
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      arrow_right_alt
                    </span>
                  )}
                </button>

              </form>

              {/* Lien inscription */}
              <div className="mt-10 text-center">
                <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
                  Nouveau sur l'aventure ?{' '}
                  <Link
                    href="/inscription"
                    className="font-bold underline underline-offset-4 transition-colors hover:opacity-70"
                    style={{ color: '#1B6B3A' }}
                  >
                    Créer un compte d'exception
                  </Link>
                </p>

                {/* Paiements mobiles */}
                <div
                  className="flex items-center justify-center gap-6 mt-8 pt-6"
                  style={{ borderTop: '1px solid #F0EDE8' }}
                >
                  <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#374151' }}>
                      payments
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-tight" style={{ color: '#374151' }}>
                      MTN MoMo
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#374151' }}>
                      account_balance_wallet
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-tight" style={{ color: '#374151' }}>
                      Moov Money
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer
        className="w-full px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{ color: 'rgba(107,114,128,0.6)' }}
      >
        <div className="flex gap-10">
          {['Assistance', 'Confidentialité', 'Conditions Générales'].map((link) => (
            <Link
              key={link}
              href="#"
              className="text-[10px] font-bold uppercase tracking-widest hover:text-green-800 transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest">
          © 2024 BéninMarket. L'excellence Béninoise.
        </p>
      </footer>

    </div>
  )
}