'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const promosDefaut = [
  {
    id: 1, titre: 'Vente Flash Artisanat', reduction: '-30%',
    description: "Sculptures, masques et mobilier d'exception à prix réduit pendant 48h.",
    finDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=800',
    tag: 'FLASH',
    color: '#EF4444',
  },
  {
    id: 2, titre: 'Spécial Terroir', reduction: '-20%',
    description: 'Miel, épices et produits bio des collines à prix doux.',
    finDate: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    tag: 'TERROIR',
    color: '#F59E0B',
  },
  {
    id: 3, titre: 'Collection Mode', reduction: '-25%',
    description: 'Tuniques, bijoux et accessoires de créateurs béninois.',
    finDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800',
    tag: 'MODE',
    color: '#8B5CF6',
  },
]

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
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-[28px]"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
    </div>
  )
}

export default function PromotionsSection() {
  const [actif, setActif] = useState(0)
  const p = promosDefaut[actif]
  const t = useCountdown(p.finDate)

  // Auto-rotate
  useEffect(() => {
    const id = setInterval(() => setActif(a => (a + 1) % promosDefaut.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="py-8 px-6 md:px-12 lg:px-20" style={{ background: '#F7F5F0' }}>
      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-4"
              style={{ background: 'rgba(212,146,10,0.1)', color: '#D4920A', border: '1px solid rgba(212,146,10,0.2)' }}>
              <span className="material-symbols-outlined text-[14px]">local_offer</span>
              Offres Spéciales
            </span>
            <h2 className="text-4xl md:text-[52px] font-black text-[#0D0D0D] tracking-tight leading-[1.05]">
              Promotions <span style={{ color: '#D4920A' }}>& Ventes Flash</span>
            </h2>
          </div>
          <Link href="/promotions"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all hover:opacity-80"
            style={{ background: '#0D0D0D', color: 'white' }}>
            Toutes les promotions
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Big promo card */}
          <div className="lg:col-span-3 relative overflow-hidden group" style={{ borderRadius: '32px', minHeight: '460px' }}>
            {promosDefaut.map((pr, i) => (
              <div key={pr.id} className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === actif ? 1 : 0, pointerEvents: i === actif ? 'auto' : 'none' }}>
                <Image src={pr.image} alt={pr.titre} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 60vw" />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)' }} />
              </div>
            ))}

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <span className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest text-white"
                  style={{ background: p.color }}>
                  {p.tag}
                </span>
                <span className="text-[28px] font-black text-white px-4 py-1.5 rounded-[12px]"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                  {p.reduction}
                </span>
              </div>

              {/* Bottom content */}
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{p.titre}</h3>
                <p className="text-white/60 text-sm font-medium mb-6 max-w-sm">{p.description}</p>

                {/* Countdown */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Expire dans</span>
                  <div className="flex items-center gap-2">
                    <CountdownUnit value={t.h} label="H" />
                    <span className="text-xl font-black text-white/40">:</span>
                    <CountdownUnit value={t.m} label="M" />
                    <span className="text-xl font-black text-white/40">:</span>
                    <CountdownUnit value={t.s} label="S" />
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <Link href="/produits"
                    className="flex items-center gap-2 px-8 py-4 rounded-full text-[12px] font-black uppercase tracking-widest text-black transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: '#D4920A' }}>
                    Profiter de l'offre
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>

                  {/* Dots nav */}
                  <div className="flex gap-2">
                    {promosDefaut.map((_, i) => (
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
          <div className="lg:col-span-2 flex flex-col gap-4">
            {promosDefaut.map((pr, i) => (
              <button key={pr.id} onClick={() => setActif(i)}
                className="group relative flex items-center gap-4 p-4 text-left transition-all duration-300 overflow-hidden"
                style={{
                  borderRadius: '24px',
                  background: i === actif ? 'white' : 'rgba(255,255,255,0.5)',
                  border: i === actif ? `1.5px solid ${pr.color}40` : '1.5px solid transparent',
                  boxShadow: i === actif ? `0 8px 30px rgba(0,0,0,0.1)` : 'none',
                }}>
                <div className="relative w-[90px] h-[90px] rounded-[18px] overflow-hidden shrink-0">
                  <Image src={pr.image} alt={pr.titre} fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="90px" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white mb-2"
                    style={{ background: pr.color }}>{pr.reduction}</span>
                  <h4 className="font-black text-[14px] text-[#0D0D0D] leading-tight line-clamp-1 mb-1">{pr.titre}</h4>
                  <p className="text-[11px] font-medium line-clamp-2" style={{ color: '#9CA3AF' }}>{pr.description}</p>
                </div>
                <span className="material-symbols-outlined text-[20px] shrink-0 transition-all duration-300 group-hover:translate-x-1"
                  style={{ color: i === actif ? pr.color : '#D1D5DB' }}>chevron_right</span>

                {/* Active indicator bar */}
                {i === actif && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ background: pr.color }} />
                )}
              </button>
            ))}

            {/* CTA mobile */}
            <Link href="/promotions"
              className="md:hidden flex items-center justify-center gap-2 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest mt-2"
              style={{ background: '#0D0D0D', color: 'white' }}>
              Voir toutes les promotions
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
