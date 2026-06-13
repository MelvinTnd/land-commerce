'use client'
import Link from 'next/link'

const stats = [
  { icon: 'storefront',  label: 'Boutiques',  value: '3+' },
  { icon: 'category',    label: 'Catégories', value: '8' },
  { icon: 'inventory_2', label: 'Produits',   value: '12+' },
  { icon: 'star',        label: 'Note moy.',  value: '4.8' },
]

export default function ProduitsHeroArtisan({ total = 0 }) {
  const statsLive = stats.map(s =>
    s.label === 'Produits' ? { ...s, value: total > 0 ? `${total}` : s.value } : s
  )

  return (
    <section style={{ background: '#F7F5F0', borderBottom: '1px solid #E5E7EB' }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-14">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-8" style={{ color: '#9CA3AF' }}>
          <Link href="/" className="hover:text-[#1B6B3A] transition-colors">Accueil</Link>
          <span>/</span>
          <span style={{ color: '#0D0D0D' }}>Produits</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">

          {/* Left — titre */}
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] mb-4"
              style={{ color: '#1B6B3A' }}>
              <span className="w-4 h-px bg-[#1B6B3A] inline-block" />
              Marketplace CauriMarket
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-4" style={{ color: '#0D0D0D' }}>
              Catalogue<br />
              <span style={{ color: '#1B6B3A' }}>Artisanal</span>
            </h1>
            <p className="text-[15px] font-medium leading-relaxed max-w-lg" style={{ color: '#6B7280' }}>
              {total > 0 ? `${total} produits` : 'Des produits'} authentiques — sculptures, wax, épices, bijoux — directement chez les artisans béninois.
            </p>
            <div className="flex items-center gap-3 flex-wrap mt-6">
              <Link href="/boutiques"
                className="inline-flex items-center gap-2 px-6 py-3 font-black text-[11px] uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                style={{ background: '#1B6B3A' }}>
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                Boutiques
              </Link>
              <Link href="/promotions"
                className="inline-flex items-center gap-2 px-6 py-3 font-black text-[11px] uppercase tracking-widest border transition-colors hover:bg-gray-900 hover:text-white"
                style={{ borderColor: '#0D0D0D', color: '#0D0D0D' }}>
                <span className="material-symbols-outlined text-[16px]">local_offer</span>
                Promotions
              </Link>
            </div>
          </div>

          {/* Right — stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 lg:w-64 shrink-0">
            {statsLive.map(s => (
              <div key={s.label}
                className="flex flex-col gap-1 p-4 bg-white"
                style={{ border: '1px solid #E5E7EB' }}>
                <span className="material-symbols-outlined text-[18px]" style={{ color: '#1B6B3A' }}>{s.icon}</span>
                <p className="font-black text-[22px] leading-none" style={{ color: '#0D0D0D' }}>{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}