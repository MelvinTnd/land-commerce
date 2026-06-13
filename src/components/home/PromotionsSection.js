'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api'

// Promos par défaut (affichées si le backend est vide ou injoignable)
const promosDefaut = [
  {
    id: 'default-1',
    titre: 'Vente Flash Artisanat',
    reduction: 30,
    description: "Sculptures, masques et mobilier d'exception à prix réduit pendant 48h.",
    date_fin: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1200',
    categorie: 'FLASH',
    color: '#EF4444',
  },
  {
    id: 'default-2',
    titre: 'Spécial Terroir',
    reduction: 20,
    description: 'Miel, épices et produits bio des collines à prix doux.',
    date_fin: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800',
    categorie: 'TERROIR',
    color: '#F59E0B',
  },
  {
    id: 'default-3',
    titre: 'Collection Mode',
    reduction: 25,
    description: 'Tuniques, bijoux et accessoires de créateurs béninois.',
    date_fin: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    categorie: 'MODE',
    color: '#8B5CF6',
  },
]

// Couleurs associées aux catégories/tags du backend
const COLORS = {
  FLASH: '#EF4444', flash: '#EF4444',
  TERROIR: '#F59E0B', terroir: '#F59E0B',
  MODE: '#8B5CF6', mode: '#8B5CF6',
  BIO: '#22C55E', bio: '#22C55E',
  ART: '#0EA5E9', art: '#0EA5E9',
  default: '#1B6B3A',
}

function getColor(promo) {
  if (promo.color) return promo.color
  const key = (promo.categorie || '').toUpperCase()
  return COLORS[key] || COLORS[promo.categorie] || COLORS.default
}

function getTag(promo) {
  return promo.categorie || promo.tag || 'PROMO'
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
      <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-[18px] sm:text-[22px] md:text-[28px]"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest mt-1 sm:mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
    </div>
  )
}

export default function PromotionsSection() {
  const [promos, setPromos] = useState(promosDefaut)
  const [actif, setActif] = useState(0)

  // Charger les promos depuis le backend, garder les défaut si vide/erreur
  useEffect(() => {
    fetch(`${API_BASE}/promotions`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPromos(data)
          setActif(0)
        }
        // Si vide → on garde les promos par défaut
      })
      .catch(() => {
        // Backend injoignable → on garde les promos par défaut
      })
  }, [])

  const p = promos[actif] || promos[0]
  const t = useCountdown(p?.date_fin || new Date().toISOString())
  const color = getColor(p)
  const tag = getTag(p)
  const reduction = getReduction(p)
  const image = getImage(p)

  // Auto-rotate
  useEffect(() => {
    if (promos.length <= 1) return
    const id = setInterval(() => setActif(a => (a + 1) % promos.length), 5000)
    return () => clearInterval(id)
  }, [promos])

  if (!p) return null

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-gray-50/50">
      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              Promotions <span style={{ color: '#1B6B3A' }}>&amp; Ventes Flash</span>
            </h2>
          </div>
          <Link href="/promotions"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-900 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-gray-50 hover:text-[#1B6B3A] hover:border-[#1B6B3A] bg-white">
            Toutes les offres
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Big promo card */}
          <div className="lg:col-span-3 relative group bg-gray-100 border border-gray-200 overflow-hidden" style={{ minHeight: '460px' }}>
            {promos.map((pr, i) => (
              <div key={pr.id || i} className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === actif ? 1 : 0, pointerEvents: i === actif ? 'auto' : 'none' }}>
                <Image src={getImage(pr)} alt={pr.titre} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 60vw"
                  unoptimized />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)' }} />
              </div>
            ))}

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 z-10">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white"
                  style={{ background: '#1B6B3A' }}>
                  {tag}
                </span>
                <span className="text-[20px] sm:text-[24px] font-bold text-white px-3 sm:px-4 py-1 sm:py-1.5"
                  style={{ background: '#D4920A' }}>
                  {reduction}
                </span>
              </div>

              {/* Bottom content */}
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">{p.titre}</h3>
                <p className="text-white/80 text-sm font-medium mb-6 max-w-sm leading-relaxed">{p.description}</p>

                {/* Countdown */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Expire dans</span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CountdownUnit value={t.h} label="H" />
                    <span className="text-lg sm:text-xl font-black text-white/40">:</span>
                    <CountdownUnit value={t.m} label="M" />
                    <span className="text-lg sm:text-xl font-black text-white/40">:</span>
                    <CountdownUnit value={t.s} label="S" />
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <Link href="/produits"
                    className="flex items-center gap-2 px-8 py-3 text-[11px] sm:text-[12px] font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                    style={{ background: '#1B6B3A' }}>
                    Profiter de l&apos;offre
                  </Link>

                  {/* Dots nav */}
                  <div className="flex gap-2">
                    {promos.map((_, i) => (
                      <button key={i} onClick={() => setActif(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width: i === actif ? '28px' : '8px',
                          height: '8px',
                          background: i === actif ? '#D4920A' : 'rgba(255,255,255,0.3)',
                        }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side list */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {promos.map((pr, i) => {
              const prColor = getColor(pr)
              const isActive = i === actif;
              return (
                <button key={pr.id || i} onClick={() => setActif(i)}
                  className="group relative flex items-center gap-4 p-4 text-left transition-colors duration-300 border bg-white"
                  style={{
                    borderColor: isActive ? '#1B6B3A' : '#E5E7EB',
                  }}>
                  <div className="relative w-[90px] h-[90px] bg-gray-100 border border-gray-100 shrink-0">
                    <Image src={getImage(pr)} alt={pr.titre} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="90px" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white mb-2"
                      style={{ background: prColor }}>{getReduction(pr)}</span>
                    <h4 className="font-bold text-[14px] text-gray-900 leading-tight line-clamp-1 mb-1 transition-colors group-hover:text-[#1B6B3A]">{pr.titre}</h4>
                    <p className="text-[11px] font-medium line-clamp-2" style={{ color: '#9CA3AF' }}>{pr.description}</p>
                  </div>
                  <span className="material-symbols-outlined text-[20px] shrink-0 transition-opacity duration-300"
                    style={{ color: '#1B6B3A', opacity: isActive ? 1 : 0 }}>arrow_forward</span>

                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: '#1B6B3A' }} />
                  )}
                </button>
              )
            })}

            {/* CTA mobile */}
            <Link href="/promotions"
              className="md:hidden flex items-center justify-center gap-2 py-4 border border-gray-200 bg-white text-gray-900 text-[11px] font-bold uppercase tracking-widest mt-2 hover:bg-gray-50 hover:text-[#1B6B3A] hover:border-[#1B6B3A] transition-colors">
              Voir toutes les offres
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
