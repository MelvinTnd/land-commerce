'use client'
import { useState } from 'react'
import { createShop } from '@/lib/api'

export default function CreateShopWizard({ token, onCreated }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', location: '', description: '' })

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Le nom de la boutique est requis.'); return }
    setLoading(true)
    setError('')
    try {
      const data = await createShop(form.name, form.location, form.description, token)
      onCreated(data.shop || data)
    } catch (err) {
      setError(err.message || 'Erreur lors de la création. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const villes = [
    'Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon',
    'Abomey', 'Natitingou', 'Kandi', 'Ouidah', 'Lokossa', 'Dassa-Zoumè'
  ]

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-xl">

        {/* Illustration */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-[28px] mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1B6B3A, #0D4A28)' }}>
            <span className="material-symbols-outlined text-white text-[44px]">storefront</span>
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: '#0D0D0D' }}>
            Créez votre boutique
          </h1>
          <p className="text-base font-medium" style={{ color: '#6B7280' }}>
            Rejoignez des centaines d&apos;artisans béninois sur BéninMarket
          </p>
        </div>

        {/* Étapes */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black"
                style={{
                  background: step >= s ? '#1B6B3A' : '#F3F4F6',
                  color: step >= s ? 'white' : '#9CA3AF'
                }}>
                {step > s ? '✓' : s}
              </div>
              {s < 2 && <div className="w-16 h-[2px]" style={{ background: step > s ? '#1B6B3A' : '#E5E7EB' }} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleCreate} className="bg-white rounded-[28px] p-8"
          style={{ border: '1px solid #EBEBEB', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#6B7280' }}>
                  Nom de votre boutique *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Atelier Kanvô, Miel ParaD…"
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all"
                  style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}
                  onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#6B7280' }}>
                  Ville / Localisation
                </label>
                <select
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all appearance-none"
                  style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}>
                  <option value="">-- Sélectionner une ville --</option>
                  {villes.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <button type="button" onClick={() => { if (!form.name.trim()) { setError('Entrez un nom de boutique'); return }; setError(''); setStep(2) }}
                className="w-full py-4 rounded-2xl font-black text-white text-sm uppercase tracking-widest transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1B6B3A, #0D4A28)' }}>
                Continuer →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#6B7280' }}>
                  Description de votre boutique
                </label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Racontez votre histoire, vos savoir-faire, ce qui vous rend unique…"
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none resize-none transition-all"
                  style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}
                  onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <p className="text-[10px] mt-1" style={{ color: '#9CA3AF' }}>
                  Optionnel — vous pourrez modifier ça plus tard dans les paramètres.
                </p>
              </div>

              {/* Récap */}
              <div className="rounded-2xl p-4" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <p className="text-[11px] font-black uppercase tracking-wider mb-1" style={{ color: '#1B6B3A' }}>Récapitulatif</p>
                <p className="text-sm font-bold" style={{ color: '#0D0D0D' }}>{form.name}</p>
                {form.location && <p className="text-xs" style={{ color: '#6B7280' }}>📍 {form.location}</p>}
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm font-bold" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:opacity-80"
                  style={{ background: '#F3F4F6', color: '#374151' }}>
                  ← Retour
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-4 rounded-2xl font-black text-white text-sm uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#D4920A' }}>
                  {loading ? 'Création...' : '🚀 Créer ma boutique'}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center text-[11px] mt-6" style={{ color: '#9CA3AF' }}>
          En créant votre boutique, vous acceptez les conditions de BéninMarket.
        </p>
      </div>
    </div>
  )
}
