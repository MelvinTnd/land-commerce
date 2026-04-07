'use client'
import { useState } from 'react'

const infos = [
  {
    icon: 'location_on',
    titre: 'Adresse',
    details: ['Quartier Cadjèhoun', 'Rue 1234, Cotonou, Bénin'],
  },
  {
    icon: 'mail',
    titre: 'Email',
    details: ['contact@beninmarket.bj', 'support@beninmarket.bj'],
  },
  {
    icon: 'phone',
    titre: 'Téléphone',
    details: ['+229 97 00 00 00', 'Lun - Ven : 8h - 18h'],
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
    alert('Message envoyé avec succès !')
  }

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Hero */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #004d28 100%)' }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Contactez-Nous
        </h1>
        <p className="text-white/70 max-w-md mx-auto">
          Une question, une suggestion ou un partenariat ? Nous sommes à votre écoute.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Infos de contact */}
          <div className="flex flex-col gap-6">
            {infos.map((info) => (
              <div
                key={info.titre}
                className="bg-white rounded-2xl p-6"
                style={{ border: '1px solid #E5E7EB' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: '#1B6B3A' }}
                  >
                    <span className="material-symbols-outlined" style={{ color: '#F5B731', fontSize: '20px' }}>
                      {info.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-base" style={{ color: '#1A1A1A' }}>{info.titre}</h3>
                </div>
                {info.details.map((d, i) => (
                  <p key={i} className="text-sm" style={{ color: '#6B7280' }}>{d}</p>
                ))}
              </div>
            ))}

            {/* Réseaux sociaux */}
            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E5E7EB' }}>
              <h3 className="font-bold text-base mb-3" style={{ color: '#1A1A1A' }}>Suivez-nous</h3>
              <div className="flex gap-3">
                {['public', 'chat', 'share'].map((icon) => (
                  <button
                    key={icon}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-green-50"
                    style={{ border: '1px solid #1B6B3A', color: '#1B6B3A' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8"
              style={{ border: '1px solid #E5E7EB' }}
            >
              <h2 className="text-2xl font-extrabold mb-6" style={{ color: '#1A1A1A' }}>
                Envoyez-nous un message
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: '#F7F5F0', border: '2px solid transparent' }}
                    onFocus={(e) => e.target.style.borderColor = '#1B6B3A'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="nom@exemple.bj"
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: '#F7F5F0', border: '2px solid transparent' }}
                    onFocus={(e) => e.target.style.borderColor = '#1B6B3A'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
                  Sujet
                </label>
                <select
                  value={form.sujet}
                  onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none cursor-pointer"
                  style={{ background: '#F7F5F0', border: '2px solid transparent', color: form.sujet ? '#1A1A1A' : '#9CA3AF' }}
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="vendeur">Devenir vendeur</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="bug">Signaler un problème</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Votre message..."
                  rows={5}
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{ background: '#F7F5F0', border: '2px solid transparent' }}
                  onFocus={(e) => e.target.style.borderColor = '#1B6B3A'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full font-bold text-white text-base flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background: '#1B6B3A', boxShadow: '0 8px 24px rgba(27,107,58,0.3)' }}
              >
                Envoyer le message
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  )
}
