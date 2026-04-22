const features = [
  {
    id: 1,
    icon: 'local_shipping',
    titre: 'Logistique Fiable',
    description: 'Expédition soignée depuis nos artisans vers n\'importe quel département sous 48h.',
    stat: '48h',
    statLabel: 'délai garanti',
    color: '#34d399',
  },
  {
    id: 2,
    icon: 'payments',
    titre: 'Mobile Money',
    description: 'Paiement ultra-sécurisé via MTN MoMo, Moov Money et Celtiis. Zero frais cachés.',
    stat: '100%',
    statLabel: 'sécurisé',
    color: '#fbbf24',
  },
  {
    id: 3,
    icon: 'handshake',
    titre: 'Direct Créateur',
    description: 'Chaque achat finance directement les familles d\'artisans locaux et leur art ancestral.',
    stat: '500+',
    statLabel: 'artisans soutenus',
    color: '#a78bfa',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-6 px-6 md:px-12 lg:px-20" style={{ background: '#F7F5F0' }}>
      <div className="max-w-[1280px] mx-auto">
        <div
          className="relative rounded-[40px] overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0B1F12 0%, #0D2B1A 50%, #111827 100%)' }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,146,10,0.12) 0%, transparent 70%)' }} />

          {/* Grid lines deco */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x"
            style={{ divideColor: 'rgba(255,255,255,0.06)' }}>
            {features.map((f, i) => (
              <div key={f.id} className="p-10 lg:p-14 flex flex-col gap-6 group">
                {/* Icon + stat row */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                    <span className="material-symbols-outlined text-[28px]" style={{ color: f.color }}>{f.icon}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black" style={{ color: f.color }}>{f.stat}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.statLabel}</div>
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h4 className="text-[20px] font-black text-white tracking-tight mb-3">{f.titre}</h4>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.description}</p>
                </div>

                {/* Bottom line */}
                <div className="h-[2px] rounded-full w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: f.color }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}