import Link from 'next/link'

export default function ProduitsHero({ total = 0 }) {
  return (
    <section
      className="relative overflow-hidden py-20 px-6 md:px-10"
      style={{ background: 'linear-gradient(135deg, #0B4A26 0%, #1B6B3A 60%, #2D8A50 100%)' }}
    >
      {/* Cercles décoratifs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 border-2 border-white" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-10 border border-white" />
      <div className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-yellow-300 opacity-40" />
      <div className="absolute top-1/4 right-1/3 w-2 h-2 rounded-full bg-white opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* Texte gauche */}
          <div className="flex flex-col gap-5 max-w-xl">
            <span className="w-fit px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-yellow-900"
              style={{ background: '#F5B731' }}>
              🛍️ Marketplace BéninMarket
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              L'artisanat béninois<br />
              <span style={{ color: '#A7F3D0' }}>à portée de clic.</span>
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-md">
              Découvrez {total > 0 ? `${total} produits authentiques` : 'des produits authentiques'} — sculptures, wax, épices, bijoux — directement des mains des artisans du Bénin.
            </p>

            <div className="flex items-center gap-4 mt-2">
              <Link href="/boutiques"
                className="px-6 py-3 rounded-full bg-white font-bold text-sm transition-all hover:bg-gray-100"
                style={{ color: '#0B4A26' }}>
                Voir les boutiques
              </Link>
              <Link href="/inscription-vendeur"
                className="px-6 py-3 rounded-full border border-white/40 text-white font-bold text-sm hover:bg-white/10 transition-all">
                Devenir vendeur
              </Link>
            </div>
          </div>

          {/* Stats droite */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            {[
              { icon: 'storefront', label: 'Boutiques', value: '3+' },
              { icon: 'category', label: 'Catégories', value: '8' },
              { icon: 'inventory_2', label: 'Produits', value: total > 0 ? `${total}+` : '12+' },
              { icon: 'star', label: 'Note moy.', value: '4.8/5' },
            ].map((s) => (
              <div key={s.label}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex flex-col items-center text-center gap-2 border border-white/20">
                <span className="material-symbols-outlined text-yellow-300 text-[28px]">{s.icon}</span>
                <span className="text-2xl font-black text-white">{s.value}</span>
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}