'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const promos = [
  { id: 1, titre: 'Vente Flash Artisanat', reduction: '-30%', prix: '25 000', original: '35 714', description: "Sculptures, masques et mobilier d'exception.", finDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=800', color: '#EF4444', tag: '🔥 FLASH' },
  { id: 2, titre: 'Spécial Terroir', reduction: '-20%', prix: '12 000', original: '15 000', description: 'Miel, épices et produits bio des collines à prix doux.', finDate: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800', color: '#F59E0B', tag: '🌿 TERROIR' },
  { id: 3, titre: 'Collection Mode', reduction: '-25%', prix: '18 000', original: '24 000', description: 'Tuniques, bijoux et accessoires de créateurs béninois.', finDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=800', color: '#8B5CF6', tag: '👗 MODE' },
  { id: 4, titre: 'Maison & Déco', reduction: '-15%', prix: '30 000', original: '35 294', description: 'Tables, coussins et luminaires artisanaux pour votre intérieur.', finDate: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800', color: '#06B6D4', tag: '🏡 DÉCO' },
  { id: 5, titre: 'Bijoux & Accessoires', reduction: '-35%', prix: '8 000', original: '12 307', description: 'Colliers, bracelets et boucles d\'oreilles en bronze et perles.', finDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', color: '#EC4899', tag: '💎 BIJOUX' },
  { id: 6, titre: 'Épices du Monde', reduction: '-10%', prix: '5 000', original: '5 555', description: 'Mélanges d\'épices rares et huiles essentielles du Bénin.', finDate: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(), image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=800', color: '#10B981', tag: '🌶️ ÉPICES' },
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

  return (
    <div className="group relative bg-white overflow-hidden transition-all duration-400 hover:-translate-y-2"
      style={{ borderRadius: '28px', border: '1px solid #EBEBEB', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <Image src={p.image} alt={p.titre} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide text-white" style={{ background: p.color }}>{p.tag}</span>
          {urgency && <span className="px-3 py-1.5 rounded-full text-[10px] font-black text-white animate-pulse" style={{ background: '#EF4444' }}>⚡ URGENT</span>}
        </div>
        <div className="absolute top-4 right-4 text-[26px] font-black text-white px-4 py-1.5 rounded-[14px]"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          {p.reduction}
        </div>

        {/* Mini countdown on image */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {t.d > 0 && <div className="text-center"><div className="font-black text-[16px] text-white">{t.d}j</div></div>}
          <div className="font-black text-white text-[15px]">
            {String(t.h).padStart(2, '0')}:{String(t.m).padStart(2, '0')}:{String(t.s).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-black text-[17px] text-[#0D0D0D] mb-2 leading-tight">{p.titre}</h3>
        <p className="text-[13px] font-medium mb-4 line-clamp-2" style={{ color: '#9CA3AF' }}>{p.description}</p>

        <div className="flex items-end justify-between">
          <div>
            <p className="font-black text-[22px] leading-none" style={{ color: p.color }}>{p.prix} <span className="text-[12px] text-gray-400">CFA</span></p>
            <p className="text-[12px] line-through mt-0.5" style={{ color: '#9CA3AF' }}>{p.original} CFA</p>
          </div>
          <Link href="/produits"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all hover:opacity-90"
            style={{ background: p.color, color: 'white' }}>
            Voir l'offre
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PromotionsPage() {
  return (
    <div style={{ background: '#0D1117', minHeight: '100vh' }}>

      {/* Hero dark */}
      <div className="relative pt-28 pb-20 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(212,146,10,0.2) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest mb-6"
            style={{ background: 'rgba(212,146,10,0.15)', color: '#D4920A', border: '1px solid rgba(212,146,10,0.25)' }}>
            <span className="material-symbols-outlined text-[15px]">local_offer</span>
            Offres Exclusives
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05] mb-5">
            Promotions &<br />
            <span style={{ color: '#D4920A' }}>Ventes Flash</span>
          </h1>
          <p className="text-[17px] font-medium max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Profitez d'offres exclusives sur les trésors du Bénin. Des prix cassés, des délais limités.
          </p>
        </div>
      </div>

      {/* Promos grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-28" style={{ background: '#F7F5F0', borderRadius: '40px 40px 0 0' }}>
        <div className="pt-16 pb-4">
          <p className="text-[12px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>{promos.length} offres actives</p>
          <h2 className="text-3xl font-black text-[#0D0D0D]">Toutes les promotions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {promos.map(p => <PromoCard key={p.id} p={p} />)}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-20 relative overflow-hidden p-12 text-center"
          style={{ borderRadius: '32px', background: 'linear-gradient(135deg, #0B1F12, #1B6B3A)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10">
            <span className="material-symbols-outlined text-[40px] mb-4 block" style={{ color: '#D4920A' }}>notifications_active</span>
            <h3 className="text-3xl font-black text-white mb-3">Ne manquez aucune offre</h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto">Recevez les alertes promotions directement dans votre boîte mail.</p>
            <div className="flex max-w-md mx-auto gap-3">
              <input type="email" placeholder="votre@email.bj"
                className="flex-1 px-5 py-4 rounded-2xl text-sm font-medium outline-none"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} />
              <button className="px-7 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:opacity-90"
                style={{ background: '#D4920A', color: '#0D0D0D' }}>
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
