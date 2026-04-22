'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getShops } from '@/lib/api'
import { defaultShops } from '@/lib/defaultData'

export default function VendeursSection() {
  const [vendeurs, setVendeurs] = useState(defaultShops)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getShops()
      .then(data => {
        if (!data || data.length === 0) { setLoading(false); return }
        const apiShops = data
          .filter(s => s.status === 'active')
          .map(s => ({
            id: s.slug,
            nom: s.name,
            subtitle: s.location || 'Bénin',
            avatar: s.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1B6B3A&color=fff&size=200`,
            quote: s.description ? s.description.substring(0, 110) + (s.description.length > 110 ? '...' : '') : 'Produits exceptionnels et savoir-faire unique du Bénin.',
            extra: s.products_count || 0,
          }))
        if (apiShops.length > 0) setVendeurs(apiShops)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-28 px-6 md:px-12 lg:px-20" style={{ background: '#F7F5F0' }}>
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-5"
              style={{ background: 'rgba(27,107,58,0.08)', color: '#1B6B3A', border: '1px solid rgba(27,107,58,0.18)' }}>
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Maîtres Artisans
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0D0D0D] tracking-tight leading-tight">
              Vendeurs à <span style={{ color: '#1B6B3A' }}>la Une</span>
            </h2>
          </div>
          <Link href="/boutiques"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: '#0D0D0D', color: 'white' }}>
            Toutes les boutiques
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[28px] p-6 animate-pulse" style={{ border: '1px solid #EBEBEB' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-20 bg-gray-100 rounded-[16px] mb-4" />
              </div>
            ))}
          </div>
        ) : vendeurs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-[32px] bg-white"
            style={{ border: '1px dashed #D1D5DB' }}>
            <span className="material-symbols-outlined text-[48px] mb-4" style={{ color: '#D1D5DB' }}>storefront</span>
            <h3 className="text-xl font-black text-[#0D0D0D] mb-2">Aucun artisan encore inscrit</h3>
            <Link href="/inscription"
              className="mt-6 px-8 py-4 rounded-full text-[12px] font-black uppercase tracking-widest text-white"
              style={{ background: '#1B6B3A' }}>
              Devenir Vendeur →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendeurs.map(v => (
              <Link key={v.id} href={`/boutique/${v.id}`}
                className="group bg-white overflow-hidden flex flex-col transition-all duration-400 hover:-translate-y-2 hover:shadow-xl"
                style={{ borderRadius: '28px', border: '1px solid #EBEBEB', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>

                {/* Top color band */}
                <div className="relative h-24 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #E6F8EA 0%, #D2F4DE 100%)', borderRadius: '28px 28px 0 0' }}>
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full" style={{ background: 'rgba(27,107,58,0.1)' }} />
                  <div className="absolute -bottom-4 left-8 w-16 h-16 rounded-full" style={{ background: 'rgba(212,146,10,0.1)' }} />
                </div>

                {/* Avatar overlapping */}
                <div className="px-6 pb-6 flex flex-col flex-1 -mt-8">
                  <div className="flex items-end gap-4 mb-5">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-white"
                      style={{ border: '2px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                      <Image src={v.avatar} alt={v.nom} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="pb-1">
                      <h4 className="text-[16px] font-black text-[#0D0D0D] leading-tight group-hover:text-[#1B6B3A] transition-colors">{v.nom}</h4>
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide mt-0.5" style={{ color: '#D4920A' }}>
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {v.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wide"
                      style={{ background: '#E6F8EA', color: '#1B6B3A', border: '1px solid rgba(27,107,58,0.2)' }}>
                      <span className="material-symbols-outlined text-[11px]">verified</span>
                      Vendeur Vérifié
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: '#9CA3AF' }}>{v.extra} produits</span>
                  </div>

                  {/* Quote */}
                  <div className="bg-[#F7F5F0] rounded-[16px] p-4 mb-5 relative">
                    <span className="material-symbols-outlined absolute -top-3 left-3 text-[28px]" style={{ color: '#E6F8EA' }}>format_quote</span>
                    <p className="text-[13px] leading-relaxed line-clamp-3 italic" style={{ color: '#6B7280' }}>
                      "{v.quote}"
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <span className="text-[11px] font-black uppercase tracking-widest transition-colors group-hover:text-[#1B6B3A]" style={{ color: '#9CA3AF' }}>
                      Voir la boutique
                    </span>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all group-hover:bg-[#1B6B3A] group-hover:scale-105"
                      style={{ background: '#E6F8EA', color: '#1B6B3A' }}>
                      <span className="material-symbols-outlined text-[18px] group-hover:text-white transition-colors group-hover:translate-x-0.5">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link href="/boutiques"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest text-white"
            style={{ background: '#0D0D0D' }}>
            Toutes les boutiques
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}