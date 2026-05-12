'use client'
import Link from 'next/link'
import Image from 'next/image'

const stats = [
  { icon: 'storefront',  label: 'Boutiques',  value: '3+',  bg: 'rgba(255,255,255,0.15)', color: 'white' },
  { icon: 'category',    label: 'Catégories', value: '8',   bg: 'rgba(255,255,255,0.15)', color: 'white' },
  { icon: 'inventory_2', label: 'Produits',   value: '12+', bg: 'rgba(255,255,255,0.15)', color: 'white' },
  { icon: 'star',        label: 'Note moy.',  value: '4.8', bg: 'rgba(255,255,255,0.15)', color: 'white' },
]

export default function ProduitsHeroArtisan({ total = 0 }) {
  const statsLive = stats.map(s =>
    s.label === 'Produits' ? { ...s, value: total > 0 ? `${total}+` : s.value } : s
  )

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '480px' }}>
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/artisanat-hero.jpg"
          alt="Artisanat béninois"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay dégradé */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(13,13,13,0.82) 0%, rgba(27,107,58,0.6) 50%, rgba(13,13,13,0.75) 100%)'
        }} />
      </div>

      {/* Ligne arc-en-ciel en haut */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{
        background: 'linear-gradient(90deg, #1B6B3A, #D4920A, #7C3AED, #1B6B3A)'
      }} />

      {/* Contenu */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 py-16 flex flex-col lg:flex-row items-center justify-between gap-10">

        {/* Gauche */}
        <div className="max-w-xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-bold mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-white">Produits</span>
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-5"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
            🛍️ Marketplace BéninMarket
          </span>

          <h1 className="text-4xl md:text-[58px] font-black leading-none tracking-tight mb-5 text-white">
            Catalogue<br />
            <span style={{ color: '#4ADE80' }}>Artisanal</span>
          </h1>

          <p className="text-[15px] font-medium leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {total > 0 ? `${total} produits` : 'Des produits'} authentiques — sculptures, wax, épices, bijoux — sélectionnés directement chez les artisans béninois.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/boutiques"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-black text-[12px] uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-900/30"
              style={{ background: '#1B6B3A' }}>
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              Boutiques
            </Link>
            <Link href="/inscription-vendeur"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-black text-[12px] uppercase tracking-wider transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
              Devenir vendeur
            </Link>
          </div>
        </div>

        {/* Droite — stats + promo */}
        <div className="flex flex-col gap-3 lg:w-72 shrink-0 w-full">
          <div className="grid grid-cols-2 gap-3">
            {statsLive.map(s => (
              <div key={s.label}
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <span className="material-symbols-outlined text-[18px] text-white">{s.icon}</span>
                </div>
                <div>
                  <p className="font-black text-[20px] leading-none text-white">{s.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/promotions"
            className="group flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: 'rgba(212,146,10,0.25)', border: '1px solid rgba(212,146,10,0.4)', backdropFilter: 'blur(12px)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(212,146,10,0.3)' }}>
              <span className="material-symbols-outlined text-[18px]" style={{ color: '#FCD34D' }}>local_offer</span>
            </div>
            <div className="flex-1">
              <p className="font-black text-[13px] text-white">Promotions actives</p>
              <p className="text-[11px] font-medium" style={{ color: 'rgba(252,211,77,0.8)' }}>Jusqu&apos;à -35% sur certains articles</p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-white transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}