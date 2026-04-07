'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [envoye, setEnvoye] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnvoye(true)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F6F6F6', backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30H15L30 0zm0 60L15 30h30L30 60zM0 30l30-15v30L0 30zm60 0L30 45V15l30 15z' fill='%231B6B3A' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white p-10 md:p-14" style={{ borderRadius: '2.5rem', boxShadow: '0 32px 64px -16px rgba(0,0,0,0.1)' }}>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1B6B3A' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'white' }}>storefront</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight" style={{ color: '#1B6B3A' }}>BéninMarket</span>
          </div>

          {!envoye ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#F0FDF4' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#1B6B3A' }}>lock_reset</span>
                </div>
                <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#1A1A1A' }}>Mot de passe oublié ?</h1>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider mb-2 ml-1" style={{ color: '#9CA3AF' }}>Adresse Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2" style={{ fontSize: '18px', color: '#9CA3AF' }}>mail</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nom@exemple.bj"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium outline-none" style={{ background: '#F4F4F0', border: '2px solid transparent', color: '#1A1A1A' }}
                      onFocus={(e) => e.target.style.borderColor = '#1B6B3A'} onBlur={(e) => e.target.style.borderColor = 'transparent'} />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  style={{ background: '#1B6B3A', boxShadow: '0 8px 24px rgba(27,107,58,0.3)' }}>
                  Envoyer le lien
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_right_alt</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#F0FDF4' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#1B6B3A' }}>mark_email_read</span>
              </div>
              <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#1A1A1A' }}>Email envoyé !</h2>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception.
              </p>
              <button onClick={() => setEnvoye(false)} className="text-sm font-bold underline underline-offset-4" style={{ color: '#1B6B3A' }}>
                Renvoyer l'email
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/connexion" className="text-sm font-semibold flex items-center justify-center gap-1" style={{ color: '#6B7280' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
              Retour à la connexion
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}
