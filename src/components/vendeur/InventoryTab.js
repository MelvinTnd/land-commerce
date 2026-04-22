'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getVendorProducts, createProduct, getCategories } from '@/lib/api'

export default function InventoryTab() {
  const [produits, setProduits] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', price: '', promo_price: '', stock: '', description: '', category_id: '', image: ''
  })

  const charger = () => {
    setLoading(true)
    getVendorProducts()
      .then(data => {
        setProduits(Array.isArray(data) ? data : data.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    charger()
    getCategories().then(data => setCategories(data)).catch(() => {})
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createProduct({
        name: form.name,
        price: parseFloat(form.price),
        promo_price: form.promo_price ? parseFloat(form.promo_price) : null,
        stock: parseInt(form.stock) || 0,
        description: form.description,
        category_id: form.category_id || null,
        image: form.image || null,
      })
      setShowModal(false)
      setForm({ name: '', price: '', promo_price: '', stock: '', description: '', category_id: '', image: '' })
      charger()
    } catch (err) {
      alert('Erreur: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const filteredProduits = produits.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const getStockStyle = (stock) => {
    if (stock === 0)  return { text: 'Épuisé',      sColor: 'text-red-600',    sBg: 'bg-red-50' }
    if (stock <= 5)   return { text: 'Stock faible', sColor: 'text-orange-600', sBg: 'bg-orange-50' }
    return              { text: 'En stock',       sColor: 'text-green-700',  sBg: 'bg-green-50' }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Modal Nouveau Produit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-base">Nouveau Produit</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined text-gray-500 text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nom du produit *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm outline-none focus:border-green-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Prix (FCFA) *</label>
                  <input required type="number" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm outline-none focus:border-green-700" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Prix Promo</label>
                  <input type="number" min="0" value={form.promo_price} onChange={e => setForm({...form, promo_price: e.target.value})}
                    className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm outline-none focus:border-green-700" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                    className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm outline-none focus:border-green-700" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Catégorie</label>
                  <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}
                    className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm outline-none focus:border-green-700">
                    <option value="">-- Choisir --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">URL Image</label>
                <input value={form.image} onChange={e => setForm({...form, image: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm outline-none focus:border-green-700" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm outline-none focus:border-green-700 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-100 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-[#1B6B3A] rounded-full text-xs font-bold text-white hover:bg-[#08381d] transition-colors disabled:opacity-50">
                  {saving ? 'Création...' : 'Créer le Produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[24px] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Inventaire & Stock</h3>
            <p className="text-xs text-gray-500 mt-1">{produits.length} produit(s) dans votre boutique</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-[#1B6B3A] hover:bg-[#08381d] text-white font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[16px]">add</span> Ajouter
          </button>
        </div>

        {/* Recherche */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full bg-gray-50 text-xs font-medium pl-10 pr-4 py-3 rounded-xl border border-gray-100 outline-none focus:border-green-700" />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProduits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-gray-300 text-[48px] mb-3">inventory_2</span>
            <p className="text-sm font-bold text-gray-500">Aucun produit trouvé</p>
            <button onClick={() => setShowModal(true)}
              className="mt-4 px-5 py-2.5 bg-[#1B6B3A] text-white rounded-full text-xs font-bold hover:bg-[#08381d] transition-colors">
              Créer mon premier produit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                  <th className="pb-4 w-5/12">Produit</th>
                  <th className="pb-4 w-2/12">Catégorie</th>
                  <th className="pb-4 w-2/12">Prix</th>
                  <th className="pb-4 w-2/12">Stock</th>
                  <th className="pb-4 w-1/12 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredProduits.map((p) => {
                  const s = getStockStyle(p.stock)
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                            {p.image
                              ? <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                              : <span className="material-symbols-outlined text-gray-400 text-xl">image</span>
                            }
                          </div>
                          <div>
                            <span className="font-bold text-xs text-gray-800 block">{p.name}</span>
                            <span className="text-[10px] text-gray-400">{p.avg_rating > 0 ? `★ ${p.avg_rating}` : '—'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-[11px] font-medium text-gray-500">{p.category?.name || '—'}</td>
                      <td className="py-4 font-bold text-xs text-green-800">
                        {parseFloat(p.price).toLocaleString('fr-FR')} CFA
                        {p.promo_price && <span className="text-gray-400 font-normal ml-1 line-through text-[10px]">→ {parseFloat(p.promo_price).toLocaleString('fr-FR')}</span>}
                      </td>
                      <td className="py-4">
                        <span className={`${s.sBg} ${s.sColor} text-[9px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wide inline-flex items-center gap-1`}>
                          {p.stock} — {s.text}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`text-[9px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wide inline-block ${
                          p.status === 'publié' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {p.status}
                        </span>
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
