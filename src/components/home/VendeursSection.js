'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getShops } from '@/lib/api'
import { defaultShops } from '@/lib/defaultData'
import SafeImage from '@/components/ui/SafeImage'

export default function VendeursSection() {
  const [vendeurs, setVendeurs] = useState(defaultShops)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getShops({ limit: 3 })
      .then(data => {
        if (!data || !Array.isArray(data) || data.length === 0) { setLoading(false); return }
        const apiShops = data
          .filter(s => s.status === 'active')
          .map(s => {
            const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api').replace('/api', '')
            let avatar = s.logo 
            if (avatar && avatar.startsWith('/storage/')) avatar = apiBase + avatar
            if (!avatar) avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1a1a1a&color=fff&size=200`
            
            return {
              id: s.slug || s.id,
              nom: s.name,
              subtitle: s.location || 'Bénin',
              avatar: avatar,
              quote: s.description ? s.description.substring(0, 110) + (s.description.length > 110 ? '...' : '') : 'Produits exceptionnels et savoir-faire unique du Bénin.',
              extra: s.products_count || 0,
            }
          })
        if (apiShops.length > 0) setVendeurs(apiShops)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#F1F2F4]">
      <div className="max-w-[1280px] mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              Boutiques à la Une.
            </h2>
          </div>
          <Link href="/boutiques"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 border border-gray-200 bg-white text-gray-900 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-gray-50 hover:text-[#1B6B3A] hover:border-[#1B6B3A]">
            Toutes les boutiques
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 animate-pulse border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-100 shrink-0 border border-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 mb-2 w-3/4" />
                    <div className="h-3 bg-gray-100 w-1/2" />
                  </div>
                </div>
                <div className="h-20 bg-gray-100 mb-4" />
              </div>
            ))}
          </div>
        ) : vendeurs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-200">
            <span className="material-symbols-outlined text-[48px] text-gray-300 mb-4">storefront</span>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-6">Aucun artisan n'est encore inscrit</h3>
            <Link href="/inscription-vendeur"
              className="px-8 py-3 text-[12px] font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors">
              Devenir Créateur
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {vendeurs.map(v => (
              <Link key={v.id} href={`/boutique/${v.id}`}
                className="group bg-white flex flex-col transition-all duration-500 hover:-translate-y-1 border border-gray-100 hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

                <div className="p-6 flex flex-col flex-1">
                  
                  {/* Header de la carte */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="relative w-16 h-16 shrink-0 bg-white border border-gray-200 p-0.5">
                      <SafeImage 
                        src={v.avatar} 
                        name={v.nom}
                        alt={v.nom} 
                        fill 
                        className="object-cover" 
                        sizes="64px" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[15px] font-bold text-gray-900 leading-tight group-hover:underline truncate">{v.nom}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1 truncate">
                        {v.subtitle} • {v.extra} Articles
                      </p>
                    </div>
                  </div>

                  {/* Citation / Bio */}
                  <div className="flex-1 mb-6">
                    <p className="text-[13px] leading-relaxed text-gray-600 line-clamp-3">
                      "{v.quote}"
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <span className="inline-flex content-center items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-900 group-hover:text-gray-500 transition-colors">
                      Visiter la boutique
                      <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </span>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link href="/boutiques"
            className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest">
            Toutes les boutiques
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}