'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api'

const promosDefaut = [
  {
    id: 'default-1',
    titre: 'Vente Flash Artisanat',
    reduction: 30,
    description: "Sculptures, masques et mobilier d'exception à prix réduit pendant 48h.",
    date_fin: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1200',
    categorie: 'FLASH',
  },
  {
    id: 'default-2',
    titre: 'Spécial Terroir',
    reduction: 20,
    description: 'Miel, épices et produits bio des collines à prix doux.',
    date_fin: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800',
    categorie: 'TERROIR',
  },
  {
    id: 'default-3',
    titre: 'Collection Mode',
    reduction: 25,
    description: 'Tuniques, bijoux et accessoires de créateurs béninois.',
    date_fin: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    categorie: 'MODE',
  },
]

function getTag(promo) {
  return promo.categorie || promo.tag || 'OFFRE'
}

function getReduction(promo) {
  if (typeof promo.reduction === 'number') return `-${promo.reduction}%`
  return promo.reduction || '-?%'
}

function getImage(promo) {
  const img = promo.image || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800'
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api').replace('/api', '')
  if (img.startsWith('/storage/')) return apiBase + img
  return img
}

function useCountdown(finDate) {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(finDate) - Date.now())
      setT({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [finDate])
  return t
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 border border-gray-100 flex items-center justify-center font-bold text-[18px] sm:text-[22px] md:text-[28px] text-gray-900 bg-white">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest mt-2 px-1 text-gray-500">{label}</span>
    </div>
  )
}

export default function PromotionsSection() {
  const [promos, setPromos] = useState(promosDefaut)
  const [actif, setActif] = useState(0)

  useEffect(() => {
    fetch(`${API_BASE}/promotions`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPromos(data)
          setActif(0)
        }
      })
      .catch(() => {})
  }, [])

  const p = promos[actif] || promos[0]
  const t = useCountdown(p?.date_fin || new Date().toISOString())
  const tag = getTag(p)
  const reduction = getReduction(p)
  const image = getImage(p)

  useEffect(() => {
    if (promos.length <= 1) return
    const id = setInterval(() => setActif(a => (a + 1) % promos.length), 6000)
    return () => clearInterval(id)
  }, [promos])

  if (!p) return null

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#F1F2F4]">
      <div className="max-w-[1280px] mx-auto border border-gray-200 bg-white p-6 sm:p-10 lg:p-12">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              Offres Exclusives.
            </h2>
          </div>
          <Link href="/promotions"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-gray-900 hover:text-white">
            Toutes les promotions
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* ── CONTENT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Big promo card */}
          <div className="lg:col-span-3 relative flex flex-col group bg-[#F1F2F4] border border-gray-200 overflow-hidden" style={{ minHeight: '400px' }}>
            {promos.map((pr, i) => (
              <div key={pr.id || i} className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: i === actif ? 1 : 0, pointerEvents: i === actif ? 'auto' : 'none' }}>
                <Image src={getImage(pr)} alt={pr.titre} fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 60vw"
                  unoptimized />
                <div className="absolute inset-0 bg-black/5" />
              </div>
            ))}

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <span className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-black bg-white">
                  {tag}
                </span>
                <span className="text-[20px] sm:text-[24px] font-bold text-white px-3 py-1 bg-red-600">
                  {reduction}
                </span>
              </div>
            </div>
          </div>

          {/* Details and List */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">{p.titre}</h3>
              <p className="text-gray-500 text-sm font-normal mb-8 leading-relaxed">{p.description}</p>

              {/* Countdown */}
              <div className="flex items-center gap-2 sm:gap-4 mb-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mr-2 border-r pr-6 border-gray-200">Expire dans</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CountdownUnit value={t.h} label="H" />
                  <span className="text-lg font-bold text-gray-300">:</span>
                  <CountdownUnit value={t.m} label="M" />
                  <span className="text-lg font-bold text-gray-300">:</span>
                  <CountdownUnit value={t.s} label="S" />
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/produits"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                  Profiter de l&apos;offre
                </Link>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 mt-4 border-t border-gray-100 pt-8">
              {promos.map((pr, i) => {
                return (
                  <button key={pr.id || i} onClick={() => setActif(i)}
                    className={`group relative flex items-center gap-4 p-3 text-left transition-colors duration-300 border ${i === actif ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-300 bg-white'}`}>
                    <div className="relative w-16 h-16 bg-gray-100 shrink-0 border border-gray-200">
                      <Image src={getImage(pr)} alt={pr.titre} fill className="object-cover" sizes="64px" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-red-600">{getReduction(pr)}</span>
                        <h4 className="font-bold text-[13px] text-gray-900 line-clamp-1 group-hover:underline">{pr.titre}</h4>
                      </div>
                      <p className="text-[11px] font-normal text-gray-500 line-clamp-1">{pr.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* CTA mobile */}
            <Link href="/promotions"
              className="md:hidden flex items-center justify-center gap-2 p-4 text-[11px] font-bold uppercase tracking-widest border border-gray-900 text-gray-900 mt-2">
              Voir toutes les promotions
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
