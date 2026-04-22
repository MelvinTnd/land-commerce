'use client'
import { useState } from 'react'
import Link from 'next/link'

const infos = [
  { icon: 'location_on', titre: 'Adresse', details: ['Quartier Cadjèhoun', 'Rue 1234, Cotonou, Bénin'], color: '#1B6B3A', bg: '#E6F8EA' },
  { icon: 'mail', titre: 'Email', details: ['contact@beninmarket.bj', 'support@beninmarket.bj'], color: '#7C3AED', bg: '#EDE9FE' },
  { icon: 'phone', titre: 'Téléphone', details: ['+229 97 00 00 00', 'Lun–Ven : 8h – 18h'], color: '#D4920A', bg: '#FEF3C7' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000)) // simule envoi
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Hero clair */}
      <div className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-20"
        style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #DCFCE7 50%, #F7F5F0 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30H15L30 0zm0 60L15 30h30L30 60z' fill='%231B6B3A' fill-opacity='0.05'/%3E%3C/svg%3E")` }} />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-5"
            style={{ background: 'rgba(27,107,58,0.1)', color: '#1B6B3A', border: '1px solid rgba(27,107,58,0.2)' }}>
            <span className="material-symbols-outlined text-[14px]">support_agent</span>
            Contactez-nous
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-[#0D0D0D] tracking-tight mb-4">
            On est là<br />
            <span style={{ color: '#1B6B3A' }}>pour vous aider.</span>
          </h1>
          <p className="text-[16px] font-medium max-w-lg" style={{ color: '#6B7280' }}>
            Une question, une suggestion ou un partenariat ? Notre équipe vous répond sous 24h.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-16 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Infos */}
          <div className="flex flex-col gap-5">
            {infos.map(info => (
              <div key={info.titre} className="bg-white rounded-[24px] p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ border: '1px solid #EBEBEB' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: info.bg }}>
                    <span className="material-symbols-outlined text-[20px]" style={{ color: info.color }}>{info.icon}</span>
                  </div>
                  <h3 className="font-black text-[14px]" style={{ color: '#0D0D0D' }}>{info.titre}</h3>
                </div>
                {info.details.map((d, i) => (
                  <p key={i} className="text-[13px] font-medium leading-relaxed" style={{ color: i === 0 ? '#374151' : '#9CA3AF' }}>{d}</p>
                ))}
              </div>
            ))}

            {/* Réseaux */}
            <div className="bg-white rounded-[24px] p-6" style={{ border: '1px solid #EBEBEB' }}>
              <h3 className="font-black text-[14px] mb-4" style={{ color: '#0D0D0D' }}>Suivez-nous</h3>
              <div className="flex gap-3">
                {[
                  { icon: 'language', color: '#1B6B3A', bg: '#E6F8EA' },
                  { icon: 'chat', color: '#7C3AED', bg: '#EDE9FE' },
                  { icon: 'share', color: '#D4920A', bg: '#FEF3C7' },
                ].map(s => (
                  <button key={s.icon}
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5"
                    style={{ background: s.bg }}>
                    <span className="material-symbols-outlined text-[20px]" style={{ color: s.color }}>{s.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] p-8 md:p-10" style={{ border: '1px solid #EBEBEB', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>

              {sent ? (
                <div className="flex flex-col items-center text-center py-16">
                  <div className="w-20 h-20 rounded-full mb-6 flex items-center justify-center" style={{ background: '#E6F8EA' }}>
                    <span className="material-symbols-outlined text-[40px]" style={{ color: '#1B6B3A', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0D0D0D] mb-2">Message envoyé !</h3>
                  <p className="text-[14px] font-medium mb-8 max-w-sm" style={{ color: '#9CA3AF' }}>
                    Merci {form.nom || ''} ! Notre équipe vous répondra sous 24h ouvrés.
                  </p>
                  <button onClick={() => { setSent(false); setForm({ nom: '', email: '', sujet: '', message: '' }) }}
                    className="px-8 py-3 rounded-full font-black text-[12px] uppercase tracking-wider transition-all hover:opacity-90 text-white"
                    style={{ background: '#1B6B3A' }}>
                    Nouveau message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black mb-2" style={{ color: '#0D0D0D' }}>Envoyez un message</h2>
                  <p className="text-[13px] mb-8" style={{ color: '#9CA3AF' }}>Tous les champs sont facultatifs sauf l&apos;email.</p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        { key: 'nom', label: 'Nom complet', placeholder: 'Votre nom', type: 'text' },
                        { key: 'email', label: 'Email *', placeholder: 'nom@exemple.bj', type: 'email', required: true },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>{f.label}</label>
                          <input type={f.type} required={f.required}
                            value={form[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            placeholder={f.placeholder}
                            className="w-full px-4 py-3.5 rounded-2xl text-[13px] font-medium outline-none transition-all"
                            style={{ background: '#F7F5F0', border: '2px solid transparent', color: '#0D0D0D' }}
                            onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                            onBlur={e => e.target.style.borderColor = 'transparent'}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Sujet</label>
                      <select value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-2xl text-[13px] font-medium outline-none cursor-pointer"
                        style={{ background: '#F7F5F0', border: '2px solid transparent', color: form.sujet ? '#0D0D0D' : '#9CA3AF' }}
                        onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                        onBlur={e => e.target.style.borderColor = 'transparent'}>
                        <option value="">Sélectionnez un sujet</option>
                        <option value="commande">Question sur une commande</option>
                        <option value="vendeur">Devenir vendeur</option>
                        <option value="partenariat">Partenariat</option>
                        <option value="bug">Signaler un problème</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Message</label>
                      <textarea rows={5} placeholder="Votre message..."
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-2xl text-[13px] font-medium outline-none resize-none transition-all"
                        style={{ background: '#F7F5F0', border: '2px solid transparent', color: '#0D0D0D' }}
                        onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                        onBlur={e => e.target.style.borderColor = 'transparent'}
                      />
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5"
                      style={{ background: loading ? '#9CA3AF' : '#1B6B3A', boxShadow: loading ? 'none' : '0 8px 24px rgba(27,107,58,0.25)' }}>
                      {loading ? (
                        <><span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span> Envoi…</>
                      ) : (
                        <><span className="material-symbols-outlined text-[18px]">send</span> Envoyer le message</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
