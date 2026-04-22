import { useState, useEffect } from 'react'
import Image from 'next/image'
import { updateShop } from '@/lib/api'

export default function SettingsTab({ shop }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name || '',
        location: shop.location || '',
        description: shop.description || ''
      })
    }
  }, [shop])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!shop) return
    setLoading(true)
    try {
      await updateShop(shop.id, formData)
      alert("Profil mis à jour avec succès !")
    } catch (err) {
      alert("Erreur lors de la mise à jour: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-[24px] p-8 shadow-sm">
        <h3 className="font-bold text-gray-900 text-base mb-6">Store Settings</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Shop Appearance */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Shop Appearance</h4>
            <div className="flex gap-6 items-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-100 relative group cursor-pointer">
                <Image
                  src={shop?.logo || "https://images.unsplash.com/photo-1544626154-1fe3bfab5dd1?w=200&h=200&fit=crop"}
                  alt="Logo boutique"
                  fill
                  className="object-cover group-hover:opacity-50 transition-opacity"
                  sizes="96px"
                />
                <span className="material-symbols-outlined absolute text-white opacity-0 group-hover:opacity-100 transition-opacity">photo</span>
              </div>
              <div className="flex-1 max-w-sm">
                <p className="text-xs font-bold text-gray-800 mb-1">Store Logo</p>
                <p className="text-[10px] text-gray-500 mb-3">Square image, min 400x400px. JPG or PNG.</p>
                <button type="button" className="text-[10px] font-bold px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors uppercase tracking-wider">Upload New</button>
              </div>
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* Basic Info */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Store Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 outline-none focus:border-green-700 text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Location</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 outline-none focus:border-green-700 text-sm font-medium" />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-xs font-bold text-gray-700 mb-2">Store Biography (Storytelling)</label>
              <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 outline-none focus:border-green-700 text-sm font-medium resize-none" />
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* Payment & Payout */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Methods Accepted</h4>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-700" />
                <span className="text-sm font-bold text-gray-800">Mobile Money (Moov, MTN)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-700" />
                <span className="text-sm font-bold text-gray-800">Bank Cards (Visa, Mastercard)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="bg-[#1B6B3A] hover:bg-[#08381d] text-white font-bold text-xs px-8 py-3.5 rounded-full transition-colors shadow-sm tracking-wide uppercase disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
