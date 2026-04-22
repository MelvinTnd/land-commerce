import Link from 'next/link'

const stats = [
  { icon: 'storefront', label: 'Boutiques', value: '3+', bg: '#E6F8EA', color: '#1B6B3A' },
  { icon: 'category', label: 'Catégories', value: '8', bg: '#FEF3C7', color: '#D4920A' },
  { icon: 'inventory_2', label: 'Produits', value: '12+', bg: '#EDE9FE', color: '#7C3AED' },
  { icon: 'star', label: 'Note moy.', value: '4.8', bg: '#FCE7F3', color: '#DB2777' },
]

export default function ProduitsHero({ total = 0 }) {
  // Met à jour la valeur des produits dynamiquement
  const statsLive = stats.map(s =>
    s.label === 'Produits' ? { ...s, value: total > 0 ? `${total}+` : s.value } : s
  )

  return (
    <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>

      {/* Ligne décorative verte en haut */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #1B6B3A, #D4920A, #7C3AED, #1B6B3A)' }} />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-14">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">

          {/* Gauche : texte */}
          <div className="max-w-xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] font-bold mb-6" style={{ color: '#9CA3AF' }}>
              <Link href="/" className="hover:text-[#1B6B3A] transition-colors">Accueil</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span style={{ color: '#0D0D0D' }}>Produits</span>
            </div>

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-5"
              style={{ background: 'rgba(27,107,58,0.08)', color: '#1B6B3A', border: '1px solid rgba(27,107,58,0.18)' }}>
              🛍️ Marketplace BéninMarket
            </span>
            <h1 className="text-4xl md:text-[52px] font-black text-[#0D0D0D] leading-none tracking-tight mb-5">
              Catalogue<br />
              <span style={{ color: '#1B6B3A' }}>Artisanal</span>
            </h1>
            <p className="text-[15px] font-medium leading-relaxed mb-7" style={{ color: '#6B7280' }}>
              {total > 0 ? `${total} produits` : 'Des produits'} authentiques — sculptures, wax, épices, bijoux — sélectionnés directement chez les artisans.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/boutiques"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-[12px] uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: '#1B6B3A' }}>
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                Boutiques
              </Link>
              <Link href="/inscription-vendeur"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-[12px] uppercase tracking-wider transition-all hover:bg-[#F0FDF4]"
                style={{ border: '1.5px solid rgba(27,107,58,0.25)', color: '#1B6B3A' }}>
                Devenir vendeur
              </Link>
            </div>
          </div>

          {/* Droite : stats & filtre rapide */}
          <div className="flex flex-col gap-4 lg:w-80 shrink-0 w-full">

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {statsLive.map(s => (
                <div key={s.label}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white transition-all hover:-translate-y-0.5"
                  style={{ border: '1px solid #EBEBEB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: s.bg }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: s.color }}>{s.icon}</span>
                  </div>
                  <div>
                    <p className="font-black text-[18px] leading-none" style={{ color: '#0D0D0D' }}>{s.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide mt-0.5" style={{ color: '#9CA3AF' }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo badge */}
            <Link href="/promotions"
              className="group flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '1px solid rgba(212,146,10,0.25)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(212,146,10,0.2)' }}>
                <span className="material-symbols-outlined text-[18px]" style={{ color: '#D4920A' }}>local_offer</span>
              </div>
              <div className="flex-1">
                <p className="font-black text-[13px]" style={{ color: '#0D0D0D' }}>Promotions actives</p>
                <p className="text-[11px] font-medium" style={{ color: '#92400E' }}>Jusqu&apos;à -35% sur certains articles</p>
              </div>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1" style={{ color: '#D4920A' }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Séparation élégante */}
      <div className="h-[1px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #EBEBEB, transparent)' }} />
    </section>
  )
}