'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const promos = [
  { id: 1, titre: 'Vente Flash Artisanat', reduction: '-30%', prix: '25 000', original: '35 714', description: "Sculptures, masques et mobilier d'exception.", finDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800', tag: 'FLASH' },
  { id: 2, titre: 'Spécial Terroir', reduction: '-20%', prix: '12 000', original: '15 000', description: 'Miel, épices et produits bio des collines à prix doux.', finDate: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800', tag: 'TERROIR' },
  { id: 3, titre: 'Collection Mode', reduction: '-25%', prix: '18 000', original: '24 000', description: 'Tuniques, bijoux et accessoires de créateurs béninois.', finDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800', tag: 'MODE' },
  { id: 4, titre: 'Maison & Déco', reduction: '-15%', prix: '30 000', original: '35 294', description: 'Tables, coussins et luminaires artisanaux pour votre intérieur.', finDate: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800', tag: 'DÉCO' },
  { id: 5, titre: 'Bijoux & Accessoires', reduction: '-35%', prix: '8 000', original: '12 307', description: "Colliers, bracelets et boucles d'oreilles en bronze et perles.", finDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', tag: 'BIJOUX' },
  { id: 6, titre: 'Épices du Monde', reduction: '-10%', prix: '5 000', original: '5 555', description: "Mélanges d'épices rares et huiles essentielles du Bénin.", finDate: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=800', tag: 'ÉPICES' },
]

function useCountdown(finDate) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(finDate) - Date.now())
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [finDate])
  return t
}

function PromoCard({ p }) {
  const t = useCountdown(p.finDate)
  const urgency = new Date(p.finDate) - Date.now() < 72 * 3600 * 1000
  const [imgErr, setImgErr] = useState(false)

  return (
    <div className="group bg-white flex flex-col overflow-hidden transition-colors"
      style={{ border: '1px solid #E5E7EB' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#0D0D0D'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}>

      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '4/3' }}>
        {imgErr ? (
          <div className="w-full h-full flex items-center justify-center" style={{ background: '#F3F4F6' }}>
            <span className="material-symbols-outlined text-[48px]" style={{ color: '#D1D5DB' }}>broken_image</span>
          </div>
        ) : (
          <Image src={p.image} alt={p.titre} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" unoptimized onError={() => setImgErr(true)} />
        )}

        {/* Overlay gradient bas */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />

        {/* Tag + urgency */}
        <div className="absolute top-0 left-0 flex gap-0">
          <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-[#0D0D0D]">
            {p.tag}
          </span>
          {urgency && (
            <span className="px-3 py-1.5 text-[10px] font-black text-white bg-[#EF4444] animate-pulse">
              URGENT
            </span>
          )}
        </div>

        {/* Badge réduction */}
        <div className="absolute top-0 right-0 px-3 py-1.5 text-[14px] font-black text-white"
          style={{ background: '#D4920A' }}>
          {p.reduction}
        </div>

        {/* Countdown bas */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[13px] text-white/70">schedule</span>
          <div className="flex items-center gap-1 text-white">
            {t.d > 0 && (
              <span className="text-[13px] font-black">{t.d}j</span>
            )}
            <span className="font-black text-[13px] tabular-nums">
              {String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}:{String(t.s).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-black text-[16px] mb-1.5 leading-snug" style={{ color: '#0D0D0D' }}>{p.titre}</h3>
        <p className="text-[13px] font-medium mb-5 line-clamp-2 flex-1" style={{ color: '#6B7280' }}>{p.description}</p>

        <div className="flex items-end justify-between pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
          <div>
            <p className="font-black text-[20px] leading-none" style={{ color: '#1B6B3A' }}>
              {p.prix} <span className="text-[11px] text-gray-400 font-bold">CFA</span>
            </p>
            <p className="text-[12px] line-through mt-0.5" style={{ color: '#9CA3AF' }}>{p.original} CFA</p>
          </div>
          <Link href="/produits"
            className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest border border-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
            style={{ color: '#0D0D0D' }}>
            Voir l&apos;offre
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PromotionsPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ background: '#F7F5F0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-14">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-8" style={{ color: '#9CA3AF' }}>
            <Link href="/" className="hover:text-[#1B6B3A] transition-colors">Accueil</Link>
            <span>/</span>
            <span style={{ color: '#0D0D0D' }}>Promotions</span>
          </div>

          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] mb-4"
            style={{ color: '#D4920A' }}>
            <span className="w-4 h-px bg-[#D4920A] inline-block" />
            Offres Exclusives
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-4" style={{ color: '#0D0D0D' }}>
            Promotions &<br />
            <span style={{ color: '#D4920A' }}>Ventes Flash</span>
          </h1>
          <p className="text-[15px] font-medium max-w-lg" style={{ color: '#6B7280' }}>
            Profitez d&apos;offres exclusives sur les trésors du Bénin. Des prix cassés, des délais limités.
          </p>
        </div>
      </div>

      {/* ── Section promos ── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-14">

        {/* Sous-titre */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-1" style={{ color: '#9CA3AF' }}>
              {promos.length} offres actives
            </p>
            <h2 className="text-2xl font-black tracking-tight" style={{ color: '#0D0D0D' }}>
              Toutes les promotions
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-bold" style={{ color: '#9CA3AF' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#EF4444' }} />
            Mise à jour en temps réel
          </div>
        </div>

        {/* Grille promos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map(p => <PromoCard key={p.id} p={p} />)}
        </div>
      </div>



    </div>
  )
}
