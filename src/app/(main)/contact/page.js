'use client'
import { useState } from 'react'
import Link from 'next/link'

const infos = [
  { icon: 'location_on', titre: 'Adresse', details: ['Quartier Cadjèhoun', 'Rue 1234, Cotonou, Bénin'] },
  { icon: 'mail', titre: 'Email', details: ['contact@caurimarket.bj', 'support@caurimarket.bj'] },
  { icon: 'phone', titre: 'Téléphone', details: ['+229 97 00 00 00', 'Lun–Ven : 8h – 18h'] },
]

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ background: '#F7F5F0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-14">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-8" style={{ color: '#9CA3AF' }}>
            <Link href="/" className="hover:text-[#1B6B3A] transition-colors">Accueil</Link>
            <span>/</span>
            <span style={{ color: '#0D0D0D' }}>Contact</span>
          </div>
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] mb-4"
            style={{ color: '#1B6B3A' }}>
            <span className="w-4 h-px bg-[#1B6B3A] inline-block" />
            Contactez-nous
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-4" style={{ color: '#0D0D0D' }}>
            On est là<br />
            <span style={{ color: '#1B6B3A' }}>pour vous aider.</span>
          </h1>
          <p className="text-[15px] font-medium max-w-lg" style={{ color: '#6B7280' }}>
            Une question, une suggestion ou un partenariat ? Notre équipe vous répond sous 24h.
          </p>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-16 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Infos */}
          <div className="flex flex-col gap-px bg-gray-200">
            {infos.map(info => (
              <div key={info.titre} className="bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[20px]" style={{ color: '#1B6B3A' }}>{info.icon}</span>
                  <h3 className="font-black text-[14px]" style={{ color: '#0D0D0D' }}>{info.titre}</h3>
                </div>
                {info.details.map((d, i) => (
                  <p key={i} className="text-[13px] font-medium leading-relaxed" style={{ color: i === 0 ? '#374151' : '#9CA3AF' }}>{d}</p>
                ))}
              </div>
            ))}

            {/* Réseaux */}
            <div className="bg-white p-6">
              <h3 className="font-black text-[14px] mb-4" style={{ color: '#0D0D0D' }}>Suivez-nous</h3>
              <div className="flex gap-2">
                {[
                  { icon: 'language' },
                  { icon: 'chat' },
                  { icon: 'share' },
                ].map(s => (
                  <button key={s.icon}
                    className="w-10 h-10 border border-gray-200 flex items-center justify-center transition-colors hover:border-gray-900 hover:bg-gray-900"
                    style={{ color: '#6B7280' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#6B7280' }}>
                    <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10" style={{ border: '1px solid #E5E7EB' }}>

              {sent ? (
                <div className="flex flex-col items-center text-center py-16">
                  <div className="w-16 h-16 mb-6 flex items-center justify-center" style={{ background: '#F7F5F0' }}>
                    <span className="material-symbols-outlined text-[36px]" style={{ color: '#1B6B3A', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <h3 className="text-2xl font-black mb-2" style={{ color: '#0D0D0D' }}>Message envoyé !</h3>
                  <p className="text-[14px] font-medium mb-8 max-w-sm" style={{ color: '#9CA3AF' }}>
                    Merci {form.nom || ''} ! Notre équipe vous répondra sous 24h ouvrés.
                  </p>
                  <button onClick={() => { setSent(false); setForm({ nom: '', email: '', sujet: '', message: '' }) }}
                    className="px-8 py-3 font-black text-[11px] uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                    style={{ background: '#1B6B3A' }}>
                    Nouveau message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D' }}>Envoyez un message</h2>
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
                            className="w-full px-4 py-3.5 text-[13px] font-medium outline-none transition-colors border border-gray-200 bg-white"
                            style={{ color: '#0D0D0D' }}
                            onFocus={e => e.target.style.borderColor = '#0D0D0D'}
                            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Sujet</label>
                      <select value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })}
                        className="w-full px-4 py-3.5 text-[13px] font-medium outline-none cursor-pointer border border-gray-200 bg-white transition-colors"
                        style={{ color: form.sujet ? '#0D0D0D' : '#9CA3AF' }}
                        onFocus={e => e.target.style.borderColor = '#0D0D0D'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}>
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
                        className="w-full px-4 py-3.5 text-[13px] font-medium outline-none resize-none border border-gray-200 bg-white transition-colors"
                        style={{ color: '#0D0D0D' }}
                        onFocus={e => e.target.style.borderColor = '#0D0D0D'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                      />
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full py-4 font-black text-[12px] uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                      style={{ background: loading ? '#9CA3AF' : '#1B6B3A' }}>
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
