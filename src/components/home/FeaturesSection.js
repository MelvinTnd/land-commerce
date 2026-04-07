const features = [
  {
    id: 1,
    icon: 'local_shipping',
    titre: 'Logistique Fiable',
    description: 'Expédition soignée depuis nos artisans vers n\'importe quel département sous 48h.',
  },
  {
    id: 2,
    icon: 'payments',
    titre: 'Mobile Money',
    description: 'Paiement ultra-sécurisé via MTN MoMo, Moov Money et Celtiis.',
  },
  {
    id: 3,
    icon: 'handshake',
    titre: 'Direct Créateur',
    description: 'Chaque achat finance directement les familles d\'artisans locaux et leur art.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="relative bg-[#1B6B3A] rounded-[40px] px-10 py-16 md:py-20 lg:px-20 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Abstract Patterns / Deco */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none">
            <div className="w-full h-full border border-white rounded-full scale-150 -translate-y-1/4 translate-x-1/4"></div>
            <div className="w-full h-full border border-white rounded-full scale-110 -translate-y-1/3 translate-x-1/3 absolute inset-0"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-[#F5B731]/20 to-transparent blur-[50px] pointer-events-none"></div>

          <div className="relative w-full grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 z-10">
            {features.map((f) => (
              <div key={f.id} className="flex flex-col items-center md:items-start text-center md:text-left gap-5">
                {/* Icône */}
                <div className="w-16 h-16 rounded-[16px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#EAB308] shadow-lg">
                   <span className="material-symbols-outlined text-[32px]">{f.icon}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-white font-extrabold text-[20px] tracking-tight">
                    {f.titre}
                  </h4>
                  <p className="text-[14px] text-gray-300 leading-relaxed font-medium">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}