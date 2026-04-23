'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { getVendorProducts, createProduct, deleteProduct, getCategories } from '@/lib/api'
import { getProductImage } from '@/lib/images'

export default function InventoryTab({ token }) {
  const [produits, setProduits] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageMode, setImageMode] = useState('url') // 'url' ou 'upload'
  const [imagePreview, setImagePreview] = useState('')
  const fileRef = useRef(null)
  const [form, setForm] = useState({
    name: '', price: '', promo_price: '', stock: '',
    description: '', category_id: '', image: ''
  })

  const charger = () => {
    setLoading(true)
    getVendorProducts(token)
      .then(data => {
        setProduits(Array.isArray(data) ? data : (data.data || []))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    charger()
    getCategories().then(data => setCategories(data)).catch(() => {})
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Aperçu local immédiat
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)

    // Upload vers le backend pour obtenir une URL persistante
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api'
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch(`${apiUrl}/vendor/upload-image`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setForm(f => ({ ...f, image: data.url }))
      }
      // Si upload échoue (ex: serveur hors ligne), on garde base64 en fallback
    } catch {
      // Fallback: utilise le base64 déjà mis dans imagePreview
      setForm(f => ({ ...f, image: f.image || '' }))
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Construction du payload - on n'envoie image que si fournie
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        description: form.description || '',
      }
      if (form.promo_price) payload.promo_price = parseFloat(form.promo_price)
      if (form.category_id) payload.category_id = form.category_id
      if (form.image) payload.image = form.image

      await createProduct(payload, token)
      setShowModal(false)
      setForm({ name: '', price: '', promo_price: '', stock: '', description: '', category_id: '', image: '' })
      setImagePreview('')
      charger()
    } catch (err) {
      alert('Erreur: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) return
    try {
      await deleteProduct(id, token)
      setProduits(produits.filter(p => p.id !== id))
    } catch (err) {
      alert('Erreur: ' + err.message)
    }
  }

  const filteredProduits = produits.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  const stockBadge = (stock) => {
    if (stock === 0)  return { label: 'Épuisé',       bg: '#FEF2F2', color: '#DC2626' }
    if (stock <= 5)   return { label: 'Stock faible', bg: '#FFF7ED', color: '#D97706' }
    return              { label: 'En stock',         bg: '#F0FDF4', color: '#16A34A' }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ─── Modal Nouveau Produit ─────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-lg" style={{ color: '#0D0D0D' }}>Nouveau produit</h3>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Remplissez les informations de votre article</p>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100">
                <span className="material-symbols-outlined text-[20px]" style={{ color: '#6B7280' }}>close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-5">
              {/* Nom */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#6B7280' }}>
                  Nom du produit *
                </label>
                <input required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Masque Gèlèdè en bois"
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all"
                  style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}
                  onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Prix */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#6B7280' }}>Prix (FCFA) *</label>
                  <input required type="number" min="0" value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none"
                    style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}
                    onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#6B7280' }}>Prix Promo (optionnel)</label>
                  <input type="number" min="0" value={form.promo_price}
                    onChange={e => setForm({ ...form, promo_price: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none"
                    style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}
                    onFocus={e => e.target.style.borderColor = '#D4920A'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>

              {/* Stock + Catégorie */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#6B7280' }}>Quantité en stock</label>
                  <input type="number" min="0" value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none"
                    style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}
                    onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#6B7280' }}>Catégorie</label>
                  <select value={form.category_id}
                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none appearance-none"
                    style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}>
                    <option value="">-- Choisir --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#6B7280' }}>Image du produit</label>
                <div className="flex gap-2 mb-3">
                  {['url', 'upload'].map(mode => (
                    <button key={mode} type="button"
                      onClick={() => { setImageMode(mode); setForm(f => ({ ...f, image: '' })); setImagePreview('') }}
                      className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      style={imageMode === mode
                        ? { background: '#1B6B3A', color: 'white' }
                        : { background: '#F3F4F6', color: '#6B7280' }}>
                      {mode === 'url' ? '🔗 URL' : '📁 Fichier'}
                    </button>
                  ))}
                </div>
                {imageMode === 'url' ? (
                  <input value={form.image}
                    onChange={e => { setForm({ ...form, image: e.target.value }); setImagePreview(e.target.value) }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none"
                    style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}
                  />
                ) : (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-full py-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-green-600"
                    style={{ borderColor: '#D1D5DB', background: '#FAFAFA' }}>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                    <span className="material-symbols-outlined text-[32px] mb-2" style={{ color: '#9CA3AF' }}>cloud_upload</span>
                    <p className="text-xs font-bold" style={{ color: '#6B7280' }}>Cliquer pour choisir une image</p>
                    <p className="text-[10px]" style={{ color: '#9CA3AF' }}>JPG, PNG — max 5 Mo</p>
                  </div>
                )}
                {imagePreview && (
                  <div className="mt-3 relative w-full h-24 rounded-xl overflow-hidden">
                    <Image src={imagePreview} alt="Aperçu" fill className="object-cover" sizes="100%" unoptimized />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: '#6B7280' }}>Description</label>
                <textarea rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez votre produit : matériaux, origine, utilisation…"
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none resize-none"
                  style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}
                  onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-80"
                  style={{ background: '#F3F4F6', color: '#374151' }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3.5 rounded-2xl text-xs font-black text-white uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #1B6B3A, #0D4A28)' }}>
                  {saving ? '⏳ Création...' : '✅ Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Table Inventaire ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-[28px] p-7" style={{ border: '1px solid #EBEBEB' }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-black text-lg" style={{ color: '#0D0D0D' }}>Inventaire & Stock</h3>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{produits.length} produit(s) dans votre boutique</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-2xl font-black text-[12px] text-white uppercase tracking-wider flex items-center gap-2 transition-all hover:opacity-90"
            style={{ background: '#1B6B3A' }}>
            <span className="material-symbols-outlined text-[16px]">add</span>
            Ajouter un produit
          </button>
        </div>

        {/* Recherche */}
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: '#9CA3AF' }}>search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-11 pr-5 py-3.5 rounded-2xl text-sm font-medium outline-none"
            style={{ background: '#F9F9F9', border: '2px solid #E5E7EB' }}
            onFocus={e => e.target.style.borderColor = '#1B6B3A'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1B6B3A', borderTopColor: 'transparent' }} />
          </div>
        ) : filteredProduits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[64px] mb-4" style={{ color: '#E5E7EB' }}>inventory_2</span>
            <p className="font-black text-base mb-1" style={{ color: '#374151' }}>
              {search ? 'Aucun produit trouvé' : 'Votre inventaire est vide'}
            </p>
            <p className="text-sm mb-5" style={{ color: '#9CA3AF' }}>
              {search ? 'Essayez un autre terme' : 'Ajoutez votre premier produit pour commencer à vendre'}
            </p>
            {!search && (
              <button onClick={() => setShowModal(true)}
                className="px-6 py-3 rounded-2xl font-black text-sm text-white uppercase tracking-wider"
                style={{ background: '#1B6B3A' }}>
                + Créer mon premier produit
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  {['Produit', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="pb-4 text-[9px] font-black uppercase tracking-[0.15em] text-right" style={{ color: '#9CA3AF', textAlign: h === 'Produit' ? 'left' : h === 'Actions' ? 'right' : 'center' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProduits.map(p => {
                  const sb = stockBadge(p.stock)
                  const img = getProductImage(p)
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-gray-50/50"
                      style={{ borderBottom: '1px solid #F9F9F9' }}>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden relative shrink-0" style={{ background: '#F3F4F6' }}>
                            <Image src={img} alt={p.name} fill className="object-cover" sizes="44px" />
                          </div>
                          <div>
                            <span className="block font-bold text-sm" style={{ color: '#0D0D0D' }}>{p.name}</span>
                            <span className="text-[10px]" style={{ color: '#9CA3AF' }}>
                              {p.avg_rating > 0 ? `★ ${p.avg_rating}` : 'Pas d\'avis'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-[11px] font-medium" style={{ color: '#6B7280' }}>
                        {p.category?.name || '—'}
                      </td>
                      <td className="py-4 pr-4">
                        <span className="font-black text-sm" style={{ color: '#1B6B3A' }}>
                          {parseFloat(p.price).toLocaleString('fr-FR')} FCFA
                        </span>
                        {p.promo_price && (
                          <span className="block text-[10px] line-through" style={{ color: '#9CA3AF' }}>
                            → {parseFloat(p.promo_price).toLocaleString('fr-FR')}
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black"
                          style={{ background: sb.bg, color: sb.color }}>
                          {p.stock} · {sb.label}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black"
                          style={p.status === 'active' || p.status === 'publié'
                            ? { background: '#F0FDF4', color: '#16A34A' }
                            : { background: '#F3F4F6', color: '#6B7280' }}>
                          {p.status === 'active' ? 'Actif' : (p.status || 'Brouillon')}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors ml-auto tooltip-delete" title="Supprimer le produit">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
