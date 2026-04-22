'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { updateShop } from '@/lib/api'

export default function SettingsTab({ shop, token, onUpdated }) {
  const [form, setForm] = useState({ name: '', location: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const fileRef = useRef(null)

  const villes = [
    'Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon',
    'Abomey', 'Natitingou', 'Kandi', 'Ouidah', 'Lokossa', 'Dassa-Zoumè'
  ]

  useEffect(() => {
    if (shop) {
      setForm({
        name: shop.name || '',
        location: shop.location || '',
        description: shop.description || ''
      })
      setLogoPreview(shop.logo || '')
    }
  }, [shop])

  const handleLogoFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!shop) return
    setLoading(true)
    setSuccess(false)
    setError('')
    try {
      const payload = { ...form }
      if (logoPreview && logoPreview !== shop.logo) {
        payload.logo = logoPreview
      }
      const updated = await updateShop(shop.id, payload, token)
      if (onUpdated) onUpdated(updated.shop || updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: '#F9F9F9',
    border: '2px solid #E5E7EB',
    borderRadius: '16px',
    padding: '14px 18px',
    fontSize: '14px',
    fontWeight: '500',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-[28px] p-8" style={{ border: '1px solid #EBEBEB' }}>
        <div className="mb-8">
          <h3 className="font-black text-xl" style={{ color: '#0D0D0D' }}>Paramètres de la boutique</h3>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
            Personnalisez les informations visibles par vos clients
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* ─── Logo ────────────────────────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-4" style={{ color: '#6B7280' }}>
              Logo & Identité visuelle
            </p>
            <div className="flex items-center gap-6">
              <div
                className="relative cursor-pointer group shrink-0"
                onClick={() => fileRef.current?.click()}>
                <div className="w-24 h-24 rounded-[20px] overflow-hidden"
                  style={{ border: '3px solid #E5E7EB' }}>
                  {logoPreview ? (
                    <Image src={logoPreview} alt="Logo" fill className="object-cover" sizes="96px" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #1B6B3A, #D4920A)' }}>
                      <span className="text-white font-black text-2xl">
                        {shop?.name?.charAt(0)?.toUpperCase() || 'B'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-[20px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.45)' }}>
                  <span className="material-symbols-outlined text-white text-[22px]">photo_camera</span>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
              </div>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: '#0D0D0D' }}>Logo de la boutique</p>
                <p className="text-xs mb-3" style={{ color: '#9CA3AF' }}>
                  Cliquez sur l&apos;image pour changer. Format carré recommandé (JPG ou PNG, min 400×400).
                </p>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-colors hover:opacity-80"
                  style={{ background: '#F3F4F6', color: '#374151' }}>
                  📁 Choisir un fichier
                </button>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: '#F3F4F6' }} />

          {/* ─── Informations de base ─────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-5" style={{ color: '#6B7280' }}>
              Informations générales
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: '#374151' }}>
                  Nom de la boutique
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: '#374151' }}>
                  Ville / Localisation
                </label>
                <select
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="">-- Sélectionner --</option>
                  {villes.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-5">
              <label className="block text-xs font-bold mb-2" style={{ color: '#374151' }}>
                Histoire & Description (storytelling)
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Parlez de vous, de votre passion, de vos savoir-faire ancestraux…"
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          <div style={{ height: '1px', background: '#F3F4F6' }} />

          {/* ─── Moyens de paiement ────────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-4" style={{ color: '#6B7280' }}>
              Moyens de paiement acceptés
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Mobile Money (MTN MoMo & Moov Money)', icon: '📱' },
                { label: 'Cartes bancaires (Visa, Mastercard)', icon: '💳' },
                { label: 'Paiement à la livraison', icon: '🏠' },
              ].map((m, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors hover:bg-gray-50">
                  <input type="checkbox" defaultChecked className="w-4 h-4" style={{ accentColor: '#1B6B3A' }} />
                  <span className="text-sm font-semibold" style={{ color: '#374151' }}>{m.icon}  {m.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ─── Feedback ──────────────────────────────────────────────── */}
          {success && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <span className="text-xl">✅</span>
              <p className="text-sm font-bold" style={{ color: '#16A34A' }}>
                Paramètres sauvegardés avec succès !
              </p>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <span className="text-xl">❌</span>
              <p className="text-sm font-bold" style={{ color: '#DC2626' }}>{error}</p>
            </div>
          )}

          {/* ─── Bouton ──────────────────────────────────────────────── */}
          <div className="flex justify-end">
            <button type="submit" disabled={loading || !shop}
              className="px-8 py-4 rounded-2xl font-black text-sm text-white uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1B6B3A, #0D4A28)' }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>💾 Sauvegarder les modifications</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
